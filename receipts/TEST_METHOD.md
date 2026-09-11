# Test method (frozen before the runs)

How Verifier63 is tested, written down so a result cannot be shaped after the fact.

## Cold run

1. A fresh claude.ai Project with no prior chats. Project knowledge is exactly the eight files
   the README names: `identity.md`, `rules.md`, `examples.md`,
   `procedures/deterministic-checks.md`, `reference/requirements.json`,
   `reference/sp800-63b-4-in-scope.md`, `reference/OUT-OF-SCOPE.md`, `reference/PROVENANCE.md`.
   Project instruction: *You are the auditor described in identity.md. Follow rules.md exactly.*
2. In a new chat, attach one fixture's `src/` files and its `verifier63.yaml`. Ask:
   *Audit this against NIST SP 800-63B-4.* No hints, no follow-up prompts.
3. Compare the reply to that fixture's `EXPECTED.md`, which was written before the run.

## What counts

- **Match**: every row `EXPECTED.md` marks PROCEDURAL has the expected status; the summary
  counts sum to 85; every `Provision` is verbatim per `reference/CITATION-INDEX.md`.
- **Deviation**: any procedural row with a different status, any invented citation, any
  invented code identifier in `Observed`. Deviations are recorded, not hidden, with the fix
  they caused.

## The four runs that matter (Leo Saraiva's test)

| Fixture | Must produce |
|---|---|
| `composition-obvious` | PWD-COMP-01 FAIL |
| `composition-refactored` | PWD-COMP-01 FAIL (same violation, helpers + returned object) |
| `composition-config` | PWD-COMP-01 FAIL (same violation, policy object) |
| `observe-not-require` | PWD-COMP-01 PASS (same regexes, only logged) |

Three shapes of one violation fail and the same syntax with a different meaning passes.
If any run misses, the auditor is reading phrasing, not the provision, and that is reported here.

## Control

One run per tested fixture with nothing loaded: a plain chat, no Project, the same files and
the same prompt. It answers "what does the model do without this folder", so the folder's
contribution is measured, not assumed. Recorded as `receipts/control-NN.md` with the unedited
reply in `control-NN.report.md`, and compared row by row against the cold run on the same
fixture, each difference pointing at the line of the extract that settles it.

## Ordering

`fixtures/*/EXPECTED.md` were committed with the folder before any run. Cold runs 01 and 02
landed in that same first commit, so git cannot show their order; the receipts say so. Every
run from `cold-run-03` on is committed in its own commit after the run, so `git log` shows the
expected answer preceding the reply.

## Receipts

Each run is recorded as `receipts/cold-run-NN.md` (method instance, expected, actual,
deviations) with the full unedited reply in `receipts/cold-run-NN.report.md`.
