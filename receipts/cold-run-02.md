# Cold run 02: fixtures/observe-not-require

Date: 2026-09-10. Surface: claude.ai Project in a browser, per `TEST_METHOD.md`, same project
as run 01 with one change: `rules.md` replaced by the version carrying the verbatim-quoting
rule that run 01's deviation produced. New chat. Full unedited reply: `cold-run-02.report.md`.

## Why this run matters

This is the same-syntax-different-meaning half of Leo Saraiva's test. The fixture contains the
same three regexes as `composition-obvious` (`/[A-Z]/`, `/[0-9]/`, `/[^A-Za-z0-9]/`) applied to
the same password, but their results go only to a metrics logger and a strength hint. Nothing
is rejected on them. A string matcher fails it; a provision reader passes it.

## Instance

- Attached: `fixtures/observe-not-require/src/password-validator.ts`, `src/metrics.ts`,
  `src/session.ts`, `verifier63.yaml` (`aal: 2`, `password_usage: part_of_mfa`).
- Prompt: *Audit this against NIST SP 800-63B-4.*

## Expected (from `fixtures/observe-not-require/EXPECTED.md`, written before the run)

PWD-COMP-01 PASS, PROCEDURAL. All other procedural rows identical to run 01 (same `session.ts`).

## Actual

| Check | Result |
|---|---|
| PWD-COMP-01 | **PASS**, PROCEDURAL, `password-validator.ts:11-16, 19-21`. Observed: the three booleans `hasUppercase`/`hasDigit`/`hasSymbol` are passed only to `metrics.record(...)`, an observation sink; `strengthHint`'s regexes feed only a returned advisory string and the function is never called; "no character-class check anywhere in the supplied files reaches a `throw`, `return false`, or error-collecting sink" |
| 19 expected procedural PASS rows | all PASS, all PROCEDURAL |
| 4 expected NOT APPLICABLE rows | all NOT APPLICABLE |
| SESS-17 | EVIDENCE REQUIRED |
| Summary | 2 mandatory failures, 2 recommended-practice deviations, 35 evidence gaps, 12 not applicable, 34 passed; total 85. One fewer mandatory failure and one more pass than run 01: exactly PWD-COMP-01 |
| Verbatim quoting | identifiers in `Observed` match the file (`hasUppercase`, `metrics.record`, `strengthHint`); the run-01 deviation did not recur |
| PWD-BLK-06 | EVIDENCE REQUIRED, and it noticed `strengthHint` exists but is never surfaced to the subscriber: a correct, careful reading |

Verdict: **match**. Runs 01 and 02 together show the auditor fires on enforcement and stays
silent on observation of the identical expression.

## Deviations

None. One judgment call worth noting for a reader: the closing "Outside the standard" note
flags that `metrics.ts` logs derived password characteristics. That is outside the 85
controls and correctly kept out of the findings, within the three-line limit rules.md §7 sets.

## Still not run

`composition-refactored` and `composition-config` (the other two shapes of the violation).
Their expected outcomes are in `EXPECTED.md`; a receipt is added when each is run.
