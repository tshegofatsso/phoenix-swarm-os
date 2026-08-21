#!/usr/bin/env python3
"""Generate a UI/UX critique for a React source file with an OpenAI-compatible LLM.

| © Copyright 2026 • prepared by Tshegofatso Sepeng • All Rights Reserved |
"""

from __future__ import annotations

import argparse
from pathlib import Path

from openai import OpenAI

COPYRIGHT_NOTICE = "| © Copyright 2026 • prepared by Tshegofatso Sepeng • All Rights Reserved |"


def run_critique(source_code: str, model: str) -> str:
    """Return a professional Markdown UI/UX critique for the supplied source."""
    client = OpenAI()
    prompt = f"""You are a senior UI/UX design expert and systems architect.

Analyze the React source for the MGSN · FEWL · BBNC Phoenix-Swarm-OS workflow application. The review is for Tshegofatso Sepeng, MGSN Secretary and Board Director. It should be constructive, implementation-aware, and suitable for project documentation.

Required review areas:
1. Visual hierarchy and interaction design, especially Agent Hub and Task Card patterns.
2. The app's dark-teal visual system, including accessibility considerations and alignment with MGSN's formal brand palette: green #4CAF50, orange #FF9000, blue #2196F3, navy #18365D.
3. Phoenix-Command Language usability, including the `delegate`, `convene`, `status`, and `commit` command patterns.
4. Actionable implementation improvements. Prioritize a restrained, accessible interpretation of modern neumorphism rather than decorative effects that reduce legibility.
5. A concise, prioritized recommendations table containing: priority, recommendation, rationale, and implementation direction.

Use clear Markdown headings and complete professional prose. Do not claim that you have rendered or interacted with the application; assess the source code supplied below. End the report exactly with this notice:
{COPYRIGHT_NOTICE}

SOURCE CODE:
```tsx
{source_code}
```
"""

    response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "system",
                "content": "You produce precise, evidence-based UI/UX design critiques from supplied source code.",
            },
            {"role": "user", "content": prompt},
        ],
        max_completion_tokens=2200,
        extra_body={"reasoning": {"effort": "minimal"}},
    )

    if not response.choices or not response.choices[0].message.content:
        error = getattr(response, "error", "No content was returned by the model.")
        raise RuntimeError(f"Critique generation failed: {error}")

    return response.choices[0].message.content.strip() + "\n"


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate a Phoenix-Swarm-OS UI/UX critique.")
    parser.add_argument("source", type=Path, help="Path to the React/TypeScript source file to assess.")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("UI_UX_Critique.md"),
        help="Markdown report destination (default: UI_UX_Critique.md).",
    )
    parser.add_argument(
        "--model",
        default="gpt-5-mini",
        help="OpenAI-compatible model ID (default: gpt-5-mini).",
    )
    args = parser.parse_args()

    source_code = args.source.read_text(encoding="utf-8")
    report = run_critique(source_code, args.model)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(report, encoding="utf-8")
    print(f"Critique report written to {args.output}")


if __name__ == "__main__":
    main()

# | © Copyright 2026 • prepared by Tshegofatso Sepeng • All Rights Reserved |
