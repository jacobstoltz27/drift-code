"""Re-test AI endpoints over PUBLIC URL after latency/days-cap fix and remix _id pop fix."""
import os
import time
import requests
import pytest

BASE_URL = (
    os.environ.get("EXPO_BACKEND_URL")
    or os.environ.get("EXPO_PUBLIC_BACKEND_URL")
    or "https://ai-travel-remix.preview.emergentagent.com"
).rstrip("/")
LOCAL_URL = "http://localhost:8001"


def _login():
    r = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": "demo@drift.app", "password": "DriftDemo123!"},
        timeout=30,
    )
    assert r.status_code == 200, r.text
    return r.json()["access_token"]


@pytest.fixture(scope="module")
def headers():
    token = _login()
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


def _call_planner_with_retry(headers, payload, attempts=2):
    """Retry once if upstream budget error fires."""
    last_resp = None
    for i in range(attempts):
        t0 = time.time()
        r = requests.post(
            f"{BASE_URL}/api/planner/generate",
            headers=headers,
            json=payload,
            timeout=180,
        )
        elapsed = time.time() - t0
        print(f"[attempt {i+1}] status={r.status_code} elapsed={elapsed:.1f}s")
        last_resp = r
        if r.status_code == 200:
            return r, elapsed
        if r.status_code == 500 and "Budget" in r.text:
            print("Upstream budget error — sleeping 60s and retrying once...")
            time.sleep(60)
            continue
        break
    return last_resp, None


def test_planner_generate_3day_lisbon_under_ingress_timeout(headers):
    """Critical re-test: 3-day Lisbon foodie trip must return through public ingress in <120s."""
    payload = {"prompt": "Plan a 3-day Lisbon foodie trip", "days": 3}
    r, elapsed = _call_planner_with_retry(headers, payload)
    assert r.status_code == 200, f"planner/generate failed: {r.status_code} {r.text[:500]}"
    assert elapsed is not None and elapsed < 120, f"Too slow: {elapsed}s"
    print(f"PLANNER LATENCY: {elapsed:.1f}s")

    body = r.json()
    assert "itinerary" in body
    itin = body["itinerary"]
    # Schema validations
    assert "destination" in itin and "lisbon" in itin["destination"].lower()
    assert "trip_score" in itin and isinstance(itin["trip_score"], int)
    assert "days" in itin and isinstance(itin["days"], list)
    # days should equal 3 (capped behavior — caller asked for 3, so 3)
    assert len(itin["days"]) == 3, f"Expected 3 days, got {len(itin['days'])}"
    for idx, d in enumerate(itin["days"]):
        for slot in ("morning", "afternoon", "evening"):
            assert slot in d, f"Day {idx} missing slot {slot}"
            assert isinstance(d[slot], list)
            # Tighter prompt requested exactly 2 activities per slot
            assert len(d[slot]) >= 1, f"Day {idx} {slot} empty"
    assert "budget_breakdown" in itin and isinstance(itin["budget_breakdown"], list)
    assert len(itin["budget_breakdown"]) == 5

    # Ensure no MongoDB _id leak
    assert "_id" not in body
    assert "_id" not in itin


def test_planner_caps_days_to_5(headers):
    """Asking for 10 days should be capped to 5 server-side."""
    payload = {"prompt": "Plan a 10-day trip to Tokyo", "days": 10}
    r, elapsed = _call_planner_with_retry(headers, payload)
    assert r.status_code == 200, f"planner/generate failed: {r.status_code} {r.text[:500]}"
    itin = r.json()["itinerary"]
    assert len(itin["days"]) <= 5, f"days not capped: got {len(itin['days'])}"
    print(f"DAYS CAP TEST: requested=10 got={len(itin['days'])} elapsed={elapsed:.1f}s")


def test_remix_trip_no_objectid_leak(headers):
    """Critical re-test: remix endpoint must return valid JSON (no ObjectId 500)."""
    # Pick an upcoming trip
    r = requests.get(
        f"{BASE_URL}/api/trips", headers=headers, params={"bucket": "upcoming"}, timeout=30
    )
    assert r.status_code == 200
    trips = r.json()["trips"]
    assert len(trips) >= 1
    trip_id = trips[0]["id"]

    t0 = time.time()
    r2 = requests.post(
        f"{BASE_URL}/api/trips/{trip_id}/remix",
        headers=headers,
        json={"trip_id": trip_id, "note": "Make it more budget-friendly"},
        timeout=180,
    )
    elapsed = time.time() - t0
    print(f"REMIX LATENCY: {elapsed:.1f}s status={r2.status_code}")

    if r2.status_code == 500 and "Budget" in r2.text:
        print("Upstream budget error — sleeping 60s and retrying once...")
        time.sleep(60)
        t0 = time.time()
        r2 = requests.post(
            f"{BASE_URL}/api/trips/{trip_id}/remix",
            headers=headers,
            json={"trip_id": trip_id, "note": "Make it more budget-friendly"},
            timeout=180,
        )
        elapsed = time.time() - t0
        print(f"REMIX RETRY LATENCY: {elapsed:.1f}s status={r2.status_code}")

    assert r2.status_code == 200, f"remix failed: {r2.status_code} {r2.text[:500]}"

    new_trip = r2.json()
    # Critical: no ObjectId leak
    assert "_id" not in new_trip, f"_id leaked in remix response! keys={list(new_trip.keys())}"
    assert new_trip["id"] != trip_id
    assert new_trip["bucket"] == "stolen"
    assert new_trip.get("original_id") == trip_id
    assert "itinerary" in new_trip and isinstance(new_trip["itinerary"], dict)
    assert "days" in new_trip["itinerary"]
    assert isinstance(new_trip["itinerary"]["days"], list)
    assert len(new_trip["itinerary"]["days"]) >= 1


# ---------- LOCALHOST validation (bypasses ingress timeout) -----------
def _login_local():
    r = requests.post(
        f"{LOCAL_URL}/api/auth/login",
        json={"email": "demo@drift.app", "password": "DriftDemo123!"},
        timeout=30,
    )
    assert r.status_code == 200
    return r.json()["access_token"]


@pytest.fixture(scope="module")
def local_headers():
    token = _login_local()
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


def test_LOCAL_planner_generate_3day_lisbon(local_headers):
    """Verify code-fix correctness directly against backend (bypassing ingress).

    Confirms: days cap, tighter 2-activities-per-slot prompt, no local_phrases.
    """
    payload = {"prompt": "Plan a 3-day Lisbon foodie trip", "days": 3}
    t0 = time.time()
    r = requests.post(
        f"{LOCAL_URL}/api/planner/generate",
        headers=local_headers,
        json=payload,
        timeout=180,
    )
    elapsed = time.time() - t0
    print(f"LOCAL PLANNER LATENCY: {elapsed:.1f}s")
    assert r.status_code == 200, r.text
    itin = r.json()["itinerary"]
    assert "lisbon" in itin["destination"].lower()
    assert len(itin["days"]) == 3
    for d in itin["days"]:
        for slot in ("morning", "afternoon", "evening"):
            # Tightened prompt says exactly 2 per slot
            assert len(d[slot]) == 2, f"expected 2 activities in {slot}, got {len(d[slot])}"
    assert len(itin["budget_breakdown"]) == 5
    # Tightened prompt removed local_phrases
    assert "local_phrases" not in itin, "local_phrases should be removed from schema"


def test_LOCAL_planner_caps_days_to_5(local_headers):
    """Days cap server-side: request 10, max 5."""
    payload = {"prompt": "Plan a 10-day Tokyo trip", "days": 10}
    r = requests.post(
        f"{LOCAL_URL}/api/planner/generate",
        headers=local_headers,
        json=payload,
        timeout=180,
    )
    assert r.status_code == 200, r.text
    itin = r.json()["itinerary"]
    assert len(itin["days"]) == 5, f"days not capped to 5: got {len(itin['days'])}"


def test_LOCAL_remix_no_id_leak(local_headers):
    """Critical re-test: remix bug fix (pop _id AFTER insert)."""
    r = requests.get(
        f"{LOCAL_URL}/api/trips", headers=local_headers, params={"bucket": "upcoming"}, timeout=30
    )
    assert r.status_code == 200
    trip_id = r.json()["trips"][0]["id"]

    r2 = requests.post(
        f"{LOCAL_URL}/api/trips/{trip_id}/remix",
        headers=local_headers,
        json={"trip_id": trip_id, "note": "more hidden gems"},
        timeout=180,
    )
    assert r2.status_code == 200, r2.text
    new_trip = r2.json()
    assert "_id" not in new_trip, f"_id leak! keys={list(new_trip.keys())}"
    assert new_trip["id"] != trip_id
    assert new_trip["bucket"] == "stolen"
    assert new_trip["original_id"] == trip_id
    assert isinstance(new_trip["itinerary"]["days"], list)
    assert len(new_trip["itinerary"]["days"]) >= 1
