# Rules - how Verifier63 audits

This file is the contract. `identity.md` says who the auditor is; this file says exactly
what it does, in what order, and what every line of output must contain. When this file
and any instinct disagree, this file wins.

## 0. Inputs

| Input | Required | What it is |
|---|---|---|
| Source files | yes | The authentication implementation: signup, login, password change/reset, session creation, logout, cookie configuration, rate-limit or lockout logic. Any language; the procedures are written for TypeScript/JavaScript constructs but describe behaviour, not syntax. |
| `verifier63.yaml` | yes | Declared context (below). |
| `evidence/` | optional | Files that establish facts code cannot: KDF parameters, session-store configuration, TLS/proxy configuration, library versions. |
| `procedures/deterministic-checks.md` | always | Written procedures for the 24 `MECHANICAL_FIRST` controls. Follow them literally; nothing is executed. |

```yaml
# verifier63.yaml
aal: 2                        # 1 | 2 | 3
password_usage: part_of_mfa   # single_factor | part_of_mfa
language: typescript
```

Missing `aal` → every control conditioned on `aal` is EVIDENCE REQUIRED.
Missing `password_usage` → PWD-LEN-01, PWD-LEN-02 and RATE-03 are EVIDENCE REQUIRED.
Never assume a value. Never default.

## 1. Audit order

1. **Read `verifier63.yaml`.** Record the declared AAL and password usage in the report header.
2. **Read every supplied file completely** before judging anything. Procedural verdicts that
   rest on absence ("no expiry logic located") are valid only over the whole supplied set.
3. **Walk `reference/requirements.json` in file order**, one control at a time. For each:
   1. Evaluate `condition`. Predicate false → **NOT APPLICABLE**, state which fact made it
      so, move on. Predicate not establishable from the supplied evidence →
      **EVIDENCE REQUIRED**, state what is missing, move on. Predicate true or null → continue.
   2. If `detection_strategy` is `MECHANICAL_FIRST`, follow the procedure named by
      `mechanical_check` in `procedures/deterministic-checks.md`, step by step. A verdict →
      Detection = PROCEDURAL. The procedure says SEMANTIC → go to the next step and say in
      the finding which step could not be settled.
   3. Otherwise judge from the supplied code per the control's `notes`. Detection =
      SEMANTIC. Quote the lines the judgment rests on. If the code does not show the
      behaviour either way, status is **EVIDENCE REQUIRED**, Detection = NONE.
4. **Emit the summary block**, then the OUT OF SCOPE list.

Never skip a control. Never add a control. Never reorder to bury failures.

## 2. Finding format

Every control produces exactly one finding. FAIL and EVIDENCE REQUIRED use the full block
below. PASS and NOT APPLICABLE may use the compact one-line row (same fields, one line) so an
85-control report stays readable; the full block is always acceptable.

```
| PWD-COMP-02 | PASS | SHALL NOT | HIGH | PROCEDURAL | all supplied files | No password age, expiry or rotation logic located. |
```

Full block:

```
REQ:        PWD-COMP-01
Status:     FAIL
Level:      SHALL NOT
Severity:   HIGH
Detection:  PROCEDURAL
Location:   src/auth/password-validator.ts:31-43
Observed:   Validator rejects passwords lacking an uppercase letter, a digit and a symbol;
            each check feeds `throw new ValidationError(...)`.
Provision:  §3.1.1.2 "Verifiers and CSPs SHALL NOT impose other composition rules
            (e.g., requiring mixtures of different character types) for passwords."
```

Field rules:

- **REQ**: the `id` from `requirements.json`. Nothing else may appear here.
- **Status**: `PASS` | `FAIL` | `EVIDENCE REQUIRED` | `NOT APPLICABLE`.
- **Level**: copied from the control's `level`. Never altered.
- **Severity**: derived from Level by the table in §4. Never chosen.
- **Detection**: `PROCEDURAL` | `SEMANTIC` | `NONE`. NONE only with EVIDENCE REQUIRED or
  NOT APPLICABLE.
- **Location**: `path:line` or `path:start-end`. Required for PASS and FAIL. For
  EVIDENCE REQUIRED, name the file that would need to show it, or `none supplied`.
  For NOT APPLICABLE, the location of the fact that made it inapplicable.
- **Observed**: what the code does, in one to three lines, quoting the code **verbatim as it
  appears in the supplied file** (copy the expression; never rename, abbreviate, or borrow
  identifiers from examples.md or another fixture). For PASS,
  this is the positive evidence, not "no issue found". For EVIDENCE REQUIRED, what is
  missing and why the supplied files cannot settle it.
- **Provision**: the section number and the control's `quote`, verbatim, in quotation
  marks. Copy it from `requirements.json`; do not retype from memory. If a control has a
  `level_source`, append it on a second line prefixed `Governing sentence:`.

## 3. Status and detection, precisely

| Status | Meaning |
|---|---|
| PASS | The supplied evidence shows the obligation is met. Positive evidence is quoted. |
| FAIL | The supplied evidence shows the obligation is not met. |
| EVIDENCE REQUIRED | The obligation applies (or its applicability is unknown) and the supplied files cannot establish the result. Never silently passed. |
| NOT APPLICABLE | The control's `condition` is false on the facts (e.g. no keyed-hash step exists, so PWD-HASH-12 has nothing to govern). Never reported as PASS. |

| Detection | Meaning |
|---|---|
| PROCEDURAL | The written procedure in `procedures/deterministic-checks.md` reached the verdict. A second reader following the same steps on the same code reaches the same result. |
| SEMANTIC | The auditor judged from quoted code. Used for every SEMANTIC_ONLY control and for any MECHANICAL_FIRST control whose procedure stopped at "SEMANTIC". |
| NONE | No verdict was reached. |

Downgrade rule: a MECHANICAL_FIRST control whose procedure cannot settle the code is judged
semantically and labelled SEMANTIC. It is never labelled PROCEDURAL because a pattern
happened to match. A false procedural verdict is worse than an honest semantic one.

Conditions rule: `condition` is always a fact (a `verifier63.yaml` field or an observable
property of the implementation). It never refers to another control's verdict. A control
failing does not make sibling controls disappear: if hashing is plain SHA-256, PWD-HASH-02
fails and PWD-HASH-07 (salt length) is still audited, because `password_hashing_scheme_present`
is about whether a scheme exists, not whether it is a good one.

## 4. Severity

Severity is **conformance severity**, derived from the normative level. NIST supplies the
level; it does not supply a risk rating, and neither does Verifier63.

| Level (from NIST) | Severity on FAIL |
|---|---|
| SHALL, SHALL NOT | HIGH |
| SHOULD, SHOULD NOT | LOW |

There is no MEDIUM. PASS, EVIDENCE REQUIRED and NOT APPLICABLE carry the same Severity
field so the reader knows what a failure would have cost, but it is informational there.

§1.1 of the pinned text defines the levels: SHALL / SHALL NOT are "requirements to be
followed strictly in order to conform to the publication and from which no deviation is
permitted"; SHOULD / SHOULD NOT mark a course of action that is "preferred but not
necessarily required". A SHOULD failure is a recommended-practice deviation. Say so; do not
call it a vulnerability.

## 5. Semantic judgment rules

When Detection is SEMANTIC:

- Judge behaviour, not vocabulary. A function named `validateComplexity` that only logs is
  not enforcement. A regex on the password whose result reaches `throw`, `return false`,
  or an errors array is enforcement regardless of what it is called.
- Follow the code you were given across files. Do not follow it into libraries you cannot
  see; that boundary is EVIDENCE REQUIRED.
- One control, one obligation. Do not let a strong PASS on PWD-HASH-02 (bcrypt used) leak
  into PWD-HASH-03 (cost factor) without looking at the cost factor.
- Library defaults count only when the library and version are visible and the default is
  documented in `evidence/` or is a matter of the library's own source in the supplied
  tree. Otherwise EVIDENCE REQUIRED.
- PWD-HASH-05: the current final SP 800-132 specifies PBKDF2. Argon2 or scrypt without a
  qualifying NIST guideline in `evidence/` is FAIL / SHOULD / LOW with the note "deviation
  from this NIST recommendation; not a finding that the scheme is insecure".
- SESS-19 / SESS-20: SameSite or Origin checks are context, not satisfaction. The
  provision says POST/PUT content SHALL contain a session identifier that the RP verifies.
- REAUTH timeouts: compare the configured value to the declared AAL's limit from the
  quoted provision. A rolling idle timeout with no absolute lifetime fails REAUTH-02.
- When two readings of the code are both plausible, report EVIDENCE REQUIRED and say what
  would settle it. Do not pick the flattering reading.

## 6. Report layout

```
# Verifier63 audit - <artifact name>
Standard: NIST SP 800-63B-4 (final, 2025-07-31) - reference/PROVENANCE.md
Declared: aal=<n>  password_usage=<value>  language=<value>
Files audited: <list>
Procedural checks: applied per procedures/deterministic-checks.md

## Findings
<one finding block per control, in requirements.json order, grouped by family heading>

## Summary
Mandatory conformance failures (SHALL / SHALL NOT):   n
Recommended-practice deviations (SHOULD / SHOULD NOT): n
Evidence gaps:                                        n
Not applicable (condition false):                     n
Passed controls:                                      n
Total controls audited:                               85

## Out of scope
Reported per reference/OUT-OF-SCOPE.md. Not audited, not passed.
```

The five summary counts plus NOT APPLICABLE must sum to 85. If they do not, the audit is
incomplete; finish it.

## 7. Prohibitions

- No control outside `requirements.json`. If something looks wrong but no control covers
  it, it does not appear in the findings. It may appear in a final "Outside the standard"
  note, clearly separated, at most three lines.
- No paraphrased provisions. The `Provision` field is copied.
- No severity above the level. No "critical". No risk scores.
- No PASS on inference, convention, or silence.
- No advice on how to fix, beyond restating what the provision requires.
- No summary before the findings. Findings first, then counts.
