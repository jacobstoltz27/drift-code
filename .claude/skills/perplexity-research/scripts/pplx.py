#!/usr/bin/env python3
"""Run one Perplexity query and print the answer with numbered sources.

Usage:
  pplx.py "prompt"                      # deep research (default)
  pplx.py --model sonar-pro "prompt"    # fast lookup
  echo "prompt" | pplx.py --out research/2026-10-22-wanderlog.md

Needs PERPLEXITY_API_KEY in the environment. Standard library only.
"""
import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request

API_URL = "https://api.perplexity.ai/chat/completions"
MODELS = ["sonar-deep-research", "sonar-reasoning-pro", "sonar-pro", "sonar"]

SYSTEM = (
    "You are a competitive and market research analyst. Cite a source for every "
    "factual claim. Prefer primary sources (company sites, app store listings, "
    "filings, press releases, founder interviews) over aggregators. Give dates "
    "for every number. Say plainly when data is missing, estimated, or conflicting."
)


def build_payload(args, prompt):
    payload = {
        "model": args.model,
        "messages": [
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": prompt},
        ],
    }
    if args.model == "sonar-deep-research":
        payload["reasoning_effort"] = args.effort
    if args.recency:
        payload["search_recency_filter"] = args.recency
    if args.domains:
        payload["search_domain_filter"] = [d.strip() for d in args.domains.split(",") if d.strip()]
    return payload


def format_result(data):
    content = data["choices"][0]["message"]["content"]
    # Reasoning models prepend their chain of thought in <think> tags.
    content = re.sub(r"<think>.*?</think>\s*", "", content, flags=re.S).strip()
    sources = data.get("citations") or [r.get("url") for r in data.get("search_results", [])]
    lines = [content, "", "## Sources", ""]
    lines += [f"[{i}] {url}" for i, url in enumerate(sources, 1) if url]
    usage = data.get("usage", {})
    if usage:
        lines += ["", f"<!-- model={data.get('model')} usage={json.dumps(usage)} -->"]
    return "\n".join(lines) + "\n"


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("prompt", nargs="?", help="query text; read from stdin if omitted")
    p.add_argument("--model", default="sonar-deep-research", choices=MODELS)
    p.add_argument("--effort", default="medium", choices=["low", "medium", "high"],
                   help="reasoning_effort for sonar-deep-research")
    p.add_argument("--recency", choices=["hour", "day", "week", "month", "year"])
    p.add_argument("--domains", help="comma-separated allowlist, or -domain.com to exclude")
    p.add_argument("--out", help="also write the result to this file")
    p.add_argument("--timeout", type=int, default=900, help="seconds; deep research can take minutes")
    args = p.parse_args()

    prompt = args.prompt or sys.stdin.read()
    if not prompt.strip():
        sys.exit("error: empty prompt")
    key = os.environ.get("PERPLEXITY_API_KEY")
    if not key:
        sys.exit("error: PERPLEXITY_API_KEY is not set")

    req = urllib.request.Request(
        API_URL,
        data=json.dumps(build_payload(args, prompt)).encode(),
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=args.timeout) as resp:
            data = json.load(resp)
    except urllib.error.HTTPError as e:
        sys.exit(f"error: HTTP {e.code}: {e.read().decode(errors='replace')[:500]}")
    except (urllib.error.URLError, TimeoutError, OSError) as e:
        sys.exit(f"error: could not reach Perplexity ({e}). Network may block api.perplexity.ai.")

    out = format_result(data)
    if args.out:
        os.makedirs(os.path.dirname(args.out) or ".", exist_ok=True)
        with open(args.out, "w") as f:
            f.write(out)
    sys.stdout.write(out)


if __name__ == "__main__":
    main()
