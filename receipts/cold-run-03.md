# Cold run 03: fixtures/composition-refactored

Date: 2026-09-11. Surface: claude.ai Project in a browser, per `TEST_METHOD.md`.
Operator: the folder's author. The Project used for runs 01 and 02 had been deleted; this one
was created from scratch for this run, with the committed `rules.md` (the version carrying the
verbatim-Observed rule added after run 01). Full unedited reply: `cold-run-03.report.md`.

## Instance

- Project knowledge: the eight files named in `TEST_METHOD.md`, nothing else.
- Attached in the chat: `fixtures/composition-refactored/src/checks.ts`,
  `fixtures/composition-refactored/src/password-validator.ts`,
  `fixtures/composition-refactored/src/session.ts`,
  `fixtures/composition-refactored/verifier63.yaml` (`aal: 2`, `password_usage: part_of_mfa`).
- Prompt: *Audit this against NIST SP 800-63B-4.*

## Expected (from `fixtures/composition-refactored/EXPECTED.md`, committed before the run)

PWD-COMP-01 FAIL, PROCEDURAL, at `checks.ts:5` and `checks.ts:9`, the two regexes behind
`charClassA` / `charClassB` on a parameter named `value`, collected into an errors array and
returned as `{ ok }`. Twenty-three further procedural rows as listed there.

## Actual

| Check | Result |
|---|---|
| PWD-COMP-01 | FAIL, PROCEDURAL, `checks.ts:5`, Observed `checks.ts:5 A.test(value) [/[A-Z]/]; checks.ts:9 B.test(value) [/\d/]` |
| 24 expected procedural rows | all 24 match on status, detection and location |
| All 85 rows present | yes, none missing, none invented |
| Provisions | all 51 quoted provisions checked against `reference/CITATION-INDEX.md`: verbatim, correct section, correct level (checked with a script over the pasted reply; the same check by eye is one lookup per row) |
| Summary | 3 mandatory failures, 2 recommended-practice deviations, 35 evidence gaps, 12 not applicable, 33 passed; total 85 |
| Observed fields | quote the supplied code as written (`candidate.length < 8`, `A.test(value)`, `collectProblems`, `registerUser`); no borrowed identifiers |

Verdict: **match**. No deviation.

## What this run adds over run 01

Run 01 failed the obvious shape (`/[A-Z]/.test(password)` inline, three sites). This run fails
the same rule with no identifier that mentions uppercase, digits, composition or complexity:
two one-line helpers, a `value` parameter, a problems array, a returned object. The procedure
in `procedures/deterministic-checks.md` resolves what a value is, not what it is called, and the
model followed it. `composition-config` (the policy-object shape) is the remaining shape not yet
recorded.

## Ordering

`EXPECTED.md` for this fixture is in the repository's first commit. This receipt and the reply
are committed after the run, in their own commit, so `git log` shows the order.
