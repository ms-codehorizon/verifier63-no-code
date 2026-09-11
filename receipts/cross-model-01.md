# Cross-model 01: fixtures/composition-config on ChatGPT

Date: 2026-09-11. Surface: ChatGPT in a browser, a fresh chat with the same eight folder files
attached that `TEST_METHOD.md` names for a claude.ai Project, the same instruction sentence,
the same three fixture files and `verifier63.yaml`, the same prompt. Operator: the folder's
author. Model as shown in the ChatGPT interface: MODEL_NAME. Full unedited reply:
`cross-model-01.report.md`.

## Why

Cold runs 01 to 04 were all on Claude. If the folder only works on the model it was written
against, the standard is not doing the work; the model is. This run repeats cold run 04 on a
different vendor's model so the two replies can be compared row by row.

## Expected

The same as cold run 04: `fixtures/composition-config/EXPECTED.md`, committed before any run.

## Actual, checked the same way as cold run 04

| Check | Result |
|---|---|
| All 85 rows present | yes |
| Provisions | all 40 quoted provisions verbatim, correct section, correct level, against `reference/CITATION-INDEX.md` |
| 24 expected procedural rows | all 24 match on status |
| PWD-COMP-01 | FAIL, PROCEDURAL, `password-validator.ts:6-8`, regexes quoted as written, with the sentence "`DEFAULT_POLICY` enables uppercase and digit requirements" |
| Summary | 3 mandatory failures, 2 recommended-practice deviations, 35 evidence gaps, 12 not applicable, 33 passed; total 85. Identical to cold run 04 |
| Observed fields | quote the supplied code as written |

## Differences from the Claude reply on the same fixture (cold run 04)

- Four NOT APPLICABLE rows (PWD-LEN-01, REAUTH-03, REAUTH-06, REAUTH-07) carry
  `Detection: NONE` here and `Detection: PROCEDURAL` in cold run 04 and in `EXPECTED.md`.
  `rules.md` §2 allows NONE for NOT APPLICABLE, so both labels are permitted; the rule is
  loose there, and this run found the looseness. Verdicts identical.
- On PWD-COMP-01 this reply says which two of the three policy flags are on. Cold run 04
  listed all three regex lines as enforced without that qualifier (see the imprecision noted
  in `cold-run-04.md`). Same verdict, same location; the ChatGPT wording is the more exact of
  the two.
- PWD-HASH-03 `Observed` says the argon2 parameters are "at the reference audit's accepted
  Argon2 benchmark", a phrase that points at `examples.md` rather than at the code or the
  standard. Same PASS verdict as cold run 04; weaker justification.
- No "Outside the standard" note. `rules.md` §7 makes that note optional.

No row differs in status. No provision differs in text.

## What this does and does not show

Two vendors' models, given the same folder, produced the same 85 verdicts and the same 40
verbatim citations on a fixture with the composition rule hidden behind a policy object. That
is evidence the procedures and the pinned text carry the result, not one model's habits. It is
one fixture on one second model; it does not show the same holds on the real-project example
or on every fixture.
