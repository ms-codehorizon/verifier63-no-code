# Cold run 04: fixtures/composition-config

Date: 2026-09-11. Surface: claude.ai Project in a browser, per `TEST_METHOD.md`; the same
rebuilt Project as cold run 03, a new chat. Operator: the folder's author. Full unedited reply:
`cold-run-04.report.md`.

## Instance

- Project knowledge: the eight files named in `TEST_METHOD.md`, nothing else.
- Attached in the chat: `fixtures/composition-config/src/password-validator.ts`,
  `fixtures/composition-config/src/policy.ts`, `fixtures/composition-config/src/session.ts`,
  `fixtures/composition-config/verifier63.yaml` (`aal: 2`, `password_usage: part_of_mfa`).
- Prompt: *Audit this against NIST SP 800-63B-4.*

## Expected (from `fixtures/composition-config/EXPECTED.md`, committed before the run)

PWD-COMP-01 FAIL, PROCEDURAL, at `password-validator.ts:6`: the regexes are gated by a
`DEFAULT_POLICY` object (`requireUppercase: true`, `requireDigit: true`, `requireSymbol: false`)
passed into `validate(password, policy)`. Twenty-three further procedural rows as listed there.

## Actual

| Check | Result |
|---|---|
| PWD-COMP-01 | FAIL, PROCEDURAL, `password-validator.ts:6-8`, each regex quoted as written with the `errors.push(...)` it feeds and the `signup()` throw that makes it a rejection |
| 24 expected procedural rows | all 24 match on status and detection. Four locations are more specific than the placeholder in `EXPECTED.md` (`see validator` became `password-validator.ts:3-9`; `see hashing call` became `session.ts:8-9`; RATE-02 adds the line where `MAX_FAILED_ATTEMPTS` is defined). Same rows, better addresses |
| All 85 rows present | yes |
| Provisions | all 41 quoted provisions checked against `reference/CITATION-INDEX.md`: verbatim, correct section, correct level |
| Summary | 3 mandatory failures, 2 recommended-practice deviations, 35 evidence gaps, 12 not applicable, 33 passed; total 85 |
| Observed fields | quote the supplied code as written; no borrowed identifiers |
| Extra section | a closing "Outside the standard" note explaining why RATE-03 is an evidence gap. `rules.md` §7 permits this note, at most three lines, for observations no control covers; this one is two |

Verdict: **match**. No deviation from `EXPECTED.md`.

## An imprecision shared by the expected answer and the run

`DEFAULT_POLICY.requireSymbol` is `false`, so the symbol regex on `password-validator.ts:8` is
never reached; only the uppercase and digit rules on lines 6 and 7 actually reject. Both
`EXPECTED.md` and the reply list all three lines as enforced. The verdict does not change (two
enforced rules are a composition rule), and nothing is misquoted, but line 8 is cited as
enforcing when it is only present. `EXPECTED.md` was written by running the procedure by hand
and made the same over-count, so the run reproduced the procedure faithfully, including its
gap: `procedures/deterministic-checks.md` resolves whether a regex result reaches a rejection,
not whether the branch guarding it can be taken. `EXPECTED.md` is left as committed so the
ordering claim stays true; this note is the correction.

## Where this leaves the four-run test in `TEST_METHOD.md`

| Fixture | Must produce | Recorded |
|---|---|---|
| `composition-obvious` | PWD-COMP-01 FAIL | `cold-run-01.md`, match, one deviation fixed |
| `composition-refactored` | PWD-COMP-01 FAIL | `cold-run-03.md`, match |
| `composition-config` | PWD-COMP-01 FAIL | this file, match, one shared imprecision noted |
| `observe-not-require` | PWD-COMP-01 PASS | `cold-run-02.md`, match |

All four shapes are on record. `control-01.md` shows what the same model does on
`observe-not-require` with nothing loaded.
