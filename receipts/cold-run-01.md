# Cold run 01: fixtures/composition-obvious

Date: 2026-09-10. Surface: claude.ai Project in a browser, per `TEST_METHOD.md`.
Operator: the folder's author, running it for the first time as a user; no edits to the folder
between loading it and reading the reply. Full unedited reply: `cold-run-01.report.md`.

## Instance

- Project knowledge: the eight files named in `TEST_METHOD.md`, nothing else.
- Attached in the chat: `fixtures/composition-obvious/src/password-validator.ts`,
  `fixtures/composition-obvious/src/session.ts`, `fixtures/composition-obvious/verifier63.yaml`
  (`aal: 2`, `password_usage: part_of_mfa`).
- Prompt: *Audit this against NIST SP 800-63B-4.*

## Expected (from `fixtures/composition-obvious/EXPECTED.md`, written before the run)

PWD-COMP-01 FAIL, PROCEDURAL, at the three regex tests in `password-validator.ts`.
Procedural PASS rows: PWD-LEN-02 (min 8), PWD-LEN-03, PWD-LEN-05, PWD-CHAR-01, PWD-CHAR-02,
PWD-CHAR-04, PWD-COMP-02, PWD-HASH-02 (argon2), RATE-02 (threshold 10), SESS-11 (256 bits),
COOK-01, COOK-03, COOK-04, COOK-06, COOK-07, REAUTH-02, REAUTH-04, REAUTH-05.
NOT APPLICABLE: PWD-LEN-01, REAUTH-03, REAUTH-06, REAUTH-07. EVIDENCE REQUIRED: SESS-17.

## Actual

| Check | Result |
|---|---|
| PWD-COMP-01 | FAIL, PROCEDURAL, `password-validator.ts:8-13`, three regex sites each feeding `throw` |
| 18 expected procedural PASS rows | all PASS, all labelled PROCEDURAL |
| 4 expected NOT APPLICABLE rows | all NOT APPLICABLE |
| SESS-17 | EVIDENCE REQUIRED (no client code) |
| Summary | 3 mandatory failures, 2 recommended-practice deviations, 35 evidence gaps, 12 not applicable, 33 passed; total 85 |
| Provisions | spot-checked six against `reference/CITATION-INDEX.md`: verbatim |
| Rows the fixture did not script | PWD-CHAR-03 FAIL (UTF-16 `.length`), PWD-BLK-01 FAIL (no blocklist), PWD-HASH-05 FAIL LOW (argon2 vs SP 800-132) with the required "not a finding of insecurity" wording, PWD-HASH-11 FAIL LOW. All correct readings of the code |

Verdict: **match** on every procedural row and on the summary.

## Deviation found

In the PWD-COMP-01 `Observed` field the reply wrote `A.test(password)`, `B.test(password)`,
`C.test(password)`. The fixture uses inline literals (`/[A-Z]/.test(password)`); the names
`A` and `B` come from `fixtures/composition-refactored`, quoted in `examples.md`. The verdict,
lines and regex sources were correct; the identifiers were borrowed.

Fix applied after this run: `rules.md` §2 now requires `Observed` to quote code verbatim as it
appears in the supplied file and never to borrow identifiers from examples or other fixtures.
The change is in the committed `rules.md`; this receipt records the version that produced the
deviation.

## Follow-up

`observe-not-require` was run next with the fixed `rules.md`: see `cold-run-02.md`.
`composition-refactored` was run in a rebuilt Project: see `cold-run-03.md`. `composition-config`: see `cold-run-04.md`.
