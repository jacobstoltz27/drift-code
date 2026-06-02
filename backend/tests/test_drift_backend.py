"""Drift backend full API regression tests."""
import os
import uuid
import time
import requests
import pytest

BASE_URL = (
    os.environ.get("EXPO_BACKEND_URL")
    or os.environ.get("EXPO_PUBLIC_BACKEND_URL")
    or "https://ai-travel-remix.preview.emergentagent.com"
).rstrip("/")


# -------- Auth ---------
class TestAuth:
    def test_root(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        assert r.json().get("ok") is True

    def test_login_demo(self, api_client):
        r = api_client.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "demo@drift.app", "password": "DriftDemo123!"},
            timeout=30,
        )
        assert r.status_code == 200, r.text
        body = r.json()
        assert "access_token" in body and body["token_type"] == "bearer"
        assert body["user"]["email"] == "demo@drift.app"
        assert body["user"]["onboarded"] is True

    def test_login_wrong_password(self, api_client):
        r = api_client.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "demo@drift.app", "password": "WRONG_PASSWORD"},
            timeout=30,
        )
        assert r.status_code == 401

    def test_me_requires_auth(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 401

    def test_me_with_token(self, api_client, auth_headers):
        r = api_client.get(f"{BASE_URL}/api/auth/me", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == "demo@drift.app"
        assert data["onboarded"] is True
        assert data.get("preferences", {}).get("interests")

    def test_register_and_onboarding(self, api_client):
        unique = uuid.uuid4().hex[:8]
        email = f"test_{unique}@drift.app"
        # register
        r = api_client.post(
            f"{BASE_URL}/api/auth/register",
            json={"email": email, "password": "Passw0rd!", "name": "TEST User"},
            timeout=30,
        )
        assert r.status_code == 200, r.text
        body = r.json()
        token = body["access_token"]
        assert body["user"]["onboarded"] is False
        headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

        # me
        r2 = api_client.get(f"{BASE_URL}/api/auth/me", headers=headers)
        assert r2.status_code == 200
        assert r2.json()["email"] == email

        # onboarding
        prefs = {
            "travel_frequency": "2-4 times per year",
            "age_range": "25-34",
            "budget": "$1,500 - $3,000",
            "companions": "Friends",
            "interests": ["Beaches", "Food"],
        }
        r3 = api_client.post(
            f"{BASE_URL}/api/auth/onboarding", json=prefs, headers=headers
        )
        assert r3.status_code == 200
        updated = r3.json()
        assert updated["onboarded"] is True
        assert updated["preferences"]["interests"] == ["Beaches", "Food"]

        # verify persisted via GET /me
        r4 = api_client.get(f"{BASE_URL}/api/auth/me", headers=headers)
        assert r4.status_code == 200
        assert r4.json()["onboarded"] is True

    def test_register_duplicate_email(self, api_client):
        r = api_client.post(
            f"{BASE_URL}/api/auth/register",
            json={"email": "demo@drift.app", "password": "Passw0rd!", "name": "Dup"},
            timeout=30,
        )
        assert r.status_code == 400


# -------- Feed ---------
class TestFeed:
    def test_feed_requires_auth(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/feed")
        assert r.status_code == 401

    def test_feed_list(self, api_client, auth_headers):
        r = api_client.get(f"{BASE_URL}/api/feed", headers=auth_headers)
        assert r.status_code == 200
        body = r.json()
        assert "posts" in body
        posts = body["posts"]
        assert len(posts) >= 8, f"Expected >=8 seeded posts, got {len(posts)}"
        sample = posts[0]
        required_keys = [
            "id", "creator", "title", "destination", "image_url",
            "score", "summary", "days", "saves", "likes", "tags",
        ]
        for k in required_keys:
            assert k in sample, f"Missing key in feed post: {k}"
        assert isinstance(sample["tags"], list)

    def test_feed_single(self, api_client, auth_headers):
        r = api_client.get(f"{BASE_URL}/api/feed/feed-bali-1", headers=auth_headers)
        assert r.status_code == 200
        post = r.json()
        assert post["id"] == "feed-bali-1"
        assert post["destination"] == "Bali, Indonesia"

    def test_feed_single_not_found(self, api_client, auth_headers):
        r = api_client.get(f"{BASE_URL}/api/feed/non-existent", headers=auth_headers)
        assert r.status_code == 404


# -------- Trips ---------
class TestTrips:
    def test_trips_requires_auth(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/trips")
        assert r.status_code == 401

    def test_upcoming_trips(self, api_client, auth_headers):
        r = api_client.get(
            f"{BASE_URL}/api/trips", headers=auth_headers, params={"bucket": "upcoming"}
        )
        assert r.status_code == 200
        trips = r.json()["trips"]
        assert len(trips) >= 2
        dests = [t["destination"] for t in trips]
        assert any("Tokyo" in d for d in dests)
        assert any("Lisbon" in d for d in dests)
        for t in trips:
            assert t["bucket"] == "upcoming"
            assert t.get("start_date", "") >= "2026-01-01"

    @pytest.mark.parametrize("bucket", ["past", "stolen"])
    def test_other_buckets_initially_empty_or_list(self, api_client, auth_headers, bucket):
        r = api_client.get(
            f"{BASE_URL}/api/trips", headers=auth_headers, params={"bucket": bucket}
        )
        assert r.status_code == 200
        trips = r.json()["trips"]
        # past should be empty; stolen may or may not be empty depending on prior tests
        assert isinstance(trips, list)
        for t in trips:
            assert t["bucket"] == bucket

    def test_saved_bucket_lists(self, api_client, auth_headers):
        r = api_client.get(
            f"{BASE_URL}/api/trips", headers=auth_headers, params={"bucket": "saved"}
        )
        assert r.status_code == 200
        assert isinstance(r.json()["trips"], list)


# -------- Save / Steal idempotency ---------
class TestSaveSteal:
    def test_save_is_idempotent(self, api_client, auth_headers):
        post_id = "feed-iceland-1"
        # call twice
        r1 = api_client.post(f"{BASE_URL}/api/feed/{post_id}/save", headers=auth_headers)
        assert r1.status_code == 200, r1.text
        r2 = api_client.post(f"{BASE_URL}/api/feed/{post_id}/save", headers=auth_headers)
        assert r2.status_code == 200, r2.text
        # Verify only 1 saved trip exists for this original_id
        r3 = api_client.get(
            f"{BASE_URL}/api/trips", headers=auth_headers, params={"bucket": "saved"}
        )
        assert r3.status_code == 200
        saved = [t for t in r3.json()["trips"] if t.get("original_id") == post_id]
        assert len(saved) == 1, f"Save not idempotent — found {len(saved)} entries"
        assert saved[0]["bucket"] == "saved"
        assert saved[0]["destination"] == "Iceland"

    def test_steal_increments_count(self, api_client, auth_headers):
        # get current count
        me1 = api_client.get(f"{BASE_URL}/api/auth/me", headers=auth_headers).json()
        before = me1.get("stats", {}).get("stolen_count", 0)

        r = api_client.post(
            f"{BASE_URL}/api/feed/feed-amalfi-1/steal", headers=auth_headers
        )
        assert r.status_code == 200, r.text
        trip = r.json()
        assert trip["bucket"] == "stolen"
        assert trip["original_id"] == "feed-amalfi-1"

        me2 = api_client.get(f"{BASE_URL}/api/auth/me", headers=auth_headers).json()
        after = me2.get("stats", {}).get("stolen_count", 0)
        assert after == before + 1, f"stolen_count not incremented: {before} -> {after}"

    def test_save_nonexistent_returns_404(self, api_client, auth_headers):
        r = api_client.post(f"{BASE_URL}/api/feed/nope-xxx/save", headers=auth_headers)
        assert r.status_code == 404


# -------- Planner Score (fast/deterministic) ---------
class TestPlannerScore:
    def test_score_endpoint(self, api_client, auth_headers):
        r = api_client.post(
            f"{BASE_URL}/api/planner/score",
            headers=auth_headers,
            json={
                "destination": "Bali, Indonesia",
                "interests": ["Beaches", "Food"],
                "budget": "$1,500 - $3,000",
            },
        )
        assert r.status_code == 200
        data = r.json()
        assert "score" in data and isinstance(data["score"], int)
        assert 0 <= data["score"] <= 100
        assert data["destination"] == "Bali, Indonesia"

    def test_score_rare_destination_bonus(self, api_client, auth_headers):
        r = api_client.post(
            f"{BASE_URL}/api/planner/score",
            headers=auth_headers,
            json={"destination": "Bhutan", "interests": []},
        )
        assert r.status_code == 200
        data = r.json()
        assert data["score"] >= 70  # base 60 + rare 10

    def test_score_requires_auth(self, api_client):
        r = api_client.post(
            f"{BASE_URL}/api/planner/score",
            json={"destination": "Paris", "interests": []},
        )
        assert r.status_code == 401


# -------- Invites ---------
class TestInvites:
    def test_invites_get(self, api_client, auth_headers):
        r = api_client.get(f"{BASE_URL}/api/invites", headers=auth_headers)
        assert r.status_code == 200
        data = r.json()
        for k in ["remaining", "used", "total"]:
            assert k in data
        assert data["total"] == 5
        assert data["remaining"] + data["used"] == 5

    def test_invites_send(self, api_client, auth_headers):
        r = api_client.post(
            f"{BASE_URL}/api/invites/send",
            headers=auth_headers,
            json={"email": "friend@test.com"},
        )
        assert r.status_code == 200
        body = r.json()
        assert body.get("ok") is True
        assert body.get("sent_to") == "friend@test.com"

    def test_invites_send_missing_email(self, api_client, auth_headers):
        r = api_client.post(
            f"{BASE_URL}/api/invites/send", headers=auth_headers, json={}
        )
        assert r.status_code == 400

    def test_invites_requires_auth(self, api_client):
        r = api_client.get(f"{BASE_URL}/api/invites")
        assert r.status_code == 401


# -------- No booking endpoints ---------
class TestNoBooking:
    @pytest.mark.parametrize(
        "path",
        ["/api/bookings", "/api/book", "/api/checkout", "/api/payment", "/api/payments", "/api/orders"],
    )
    def test_booking_endpoints_do_not_exist(self, api_client, auth_headers, path):
        r = api_client.get(f"{BASE_URL}{path}", headers=auth_headers)
        # Either 404 (not found) or 405 (method not allowed) is fine; anything 2xx would be bad.
        assert r.status_code in (404, 405, 401), f"{path} unexpectedly returned {r.status_code}"


# -------- AI Planner (SLOW: 60-120s) ---------
class TestPlannerAI:
    @pytest.mark.slow
    def test_planner_generate(self, api_client, auth_headers):
        payload = {
            "prompt": "Plan a 5-day food and culture trip to Lisbon for 2 friends in spring.",
            "days": 5,
        }
        r = api_client.post(
            f"{BASE_URL}/api/planner/generate",
            headers=auth_headers,
            json=payload,
            timeout=180,
        )
        assert r.status_code == 200, r.text
        body = r.json()
        assert "itinerary" in body
        itin = body["itinerary"]
        # Validate structure
        assert "destination" in itin
        assert "trip_score" in itin and isinstance(itin["trip_score"], int)
        assert "days" in itin and isinstance(itin["days"], list)
        assert len(itin["days"]) >= 1
        day0 = itin["days"][0]
        for slot in ("morning", "afternoon", "evening"):
            assert slot in day0 and isinstance(day0[slot], list)
            assert len(day0[slot]) >= 1
        assert "budget_breakdown" in itin
        assert isinstance(itin["budget_breakdown"], list)
        assert len(itin["budget_breakdown"]) == 5

    @pytest.mark.slow
    def test_remix_trip(self, api_client, auth_headers):
        # Pick an upcoming trip
        r = api_client.get(
            f"{BASE_URL}/api/trips", headers=auth_headers, params={"bucket": "upcoming"}
        )
        assert r.status_code == 200
        trips = r.json()["trips"]
        assert len(trips) >= 1
        trip_id = trips[0]["id"]

        r2 = api_client.post(
            f"{BASE_URL}/api/trips/{trip_id}/remix",
            headers=auth_headers,
            json={"trip_id": trip_id, "note": "Make it more budget-friendly and add 2 hidden gems per day"},
            timeout=180,
        )
        assert r2.status_code == 200, r2.text
        new_trip = r2.json()
        assert new_trip["id"] != trip_id
        assert new_trip["bucket"] == "stolen"
        assert "itinerary" in new_trip and isinstance(new_trip["itinerary"], dict)
        assert "days" in new_trip["itinerary"]
