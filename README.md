# Verifier63 (no-code edition)

**Audits password-based authentication code against NIST SP 800-63B-4, and proves every finding
without asking you to run anything.**

This folder contains markdown, JSON, the standard itself, and sample code to audit. No scripts,
no binaries, no `npm install`, nothing to execute on your machine. The `.ts` and `.js` files
in `fixtures/` and `examples/` are inputs the auditor reads, not tools you run. Load eight
files into a Claude project and Claude becomes the auditor. Every claim it makes can be
checked by opening a file.

Verifier63 reports each of 85 normative requirements from NIST's *Digital Identity Guidelines:
Authentication and Authenticator Management* (final, July 31, 2025) as PASS, FAIL,
EVIDENCE REQUIRED or NOT APPLICABLE, with the file and line, the normative level (SHALL or
SHOULD), and the provision quoted verbatim from a pinned, hashed copy of the standard in
`reference/`.

It is not a security opinion. It is a conformance audit against a rulebook you can open.

```
REQ:        PWD-COMP-01
Status:     FAIL
Level:      SHALL NOT
Severity:   HIGH
Detection:  PROCEDURAL
Location:   src/models/user.model.js:32
Observed:   Composition rule enforced: src/models/user.model.js:32 value.match(/\d/) [/\d/];
            src/validations/custom.validation.js:12 value.match(/\d/) [/\d/]
Provision:  §3.1.1.2 "Verifiers and CSPs SHALL NOT impose other composition rules
            (e.g., requiring mixtures of different character types) for passwords."
```

That finding is from a real audit of [hagopj13/node-express-boilerplate](https://github.com/hagopj13/node-express-boilerplate)
(7k+ stars), reproduced in full in [`examples.md`](examples.md): 15 mandatory conformance
failures, including a letter+digit composition rule enforced in two places, bcrypt cost 8,
no blocklist, no per-account lockout, and a refresh-token loop that never asks the user to
authenticate again.

## Use it (no install)

First write `verifier63.yaml` for the code you want audited. Required; the auditor never
guesses it:

```yaml
aal: 2                        # 1 | 2 | 3   assurance level you are claiming
password_usage: part_of_mfa   # single_factor | part_of_mfa
language: typescript
```

15 characters minimum applies to single-factor passwords, 8 only when the password is one
factor of MFA; session timeouts depend on the AAL. Missing values make the dependent controls
EVIDENCE REQUIRED, never PASS.

Then pick the Claude you use:

**claude.ai in the browser, or the Claude desktop app in a Project**

1. Create a project and add these eight files to its knowledge, one at a time (project
   knowledge takes files, not folders): `identity.md`, `rules.md`, `examples.md`,
   `procedures/deterministic-checks.md`, `reference/requirements.json`,
   `reference/sp800-63b-4-in-scope.md`, `reference/OUT-OF-SCOPE.md`,
   `reference/PROVENANCE.md`. The PDF and HTML editions are for you to read, not for Claude.
2. Set the project instructions to: *You are the auditor described in identity.md. Follow
   rules.md exactly.*
3. Start a chat in the project, attach the code (the files that validate, hash and compare
   passwords, create and expire sessions, set cookies, count failed logins) plus the yaml, and
   ask: *Audit this against NIST SP 800-63B-4.*

**Claude desktop app in Cowork**

1. Start a Cowork session and add this folder as a connected folder (the folder button in
   the composer). Claude reads it in place; nothing is uploaded one file at a time.
2. Put the code to be audited and its `verifier63.yaml` in a folder and connect that too, or
   drop them into a subfolder of this one.
3. Ask: *Read identity.md and rules.md in verifier63-no-code and audit `<folder>` against
   NIST SP 800-63B-4.*

**Claude Code**

Open a terminal in this folder, run `claude`, and ask the same question with the path to the
code. It sees the whole tree.

Whichever way, you get the report in `rules.md` §6 format: 85 rows, each PASS / FAIL /
EVIDENCE REQUIRED / NOT APPLICABLE, with file:line and the verbatim provision, then a summary
block and the out-of-scope list.

### First run: try a fixture before your own code

Give the auditor `fixtures/composition-obvious/` (attach its two `src/` files and its
`verifier63.yaml` in a Project chat, or name the folder in Cowork or Claude Code). The result
should match `fixtures/composition-obvious/EXPECTED.md`:
`PWD-COMP-01` FAIL, PROCEDURAL, at the three regex lines, and a summary of 3 mandatory
failures, 2 recommended-practice deviations, 35 evidence gaps, 12 not applicable, 33 passed.
Then do the same with `fixtures/observe-not-require/`: identical regexes, results only logged,
and `PWD-COMP-01` must be PASS.

## For reviewers: verify it by reading

Nothing here needs to run. Three checks, each a file you open:

**1. The standard is really in `reference/`, and really NIST's.** `reference/NIST.SP.800-63B-4.pdf`
is the publication of record (DOI 10.6028/NIST.SP.800-63B-4, a US government work, not subject to
copyright). `reference/sp800-63b-4-in-scope.md` is the audited sections, verbatim. Open both at
§3.1.1.2 Password Verifiers and read them side by side. `reference/PROVENANCE.md` has the SHA-256
of each file; recompute with the hashing tool already on your OS if you want to.

**2. Every citation is real.** `reference/CITATION-INDEX.md` lists all 85 controls with the line
number in the extract where the quoted words appear. Pick any REQ from a finding, open the
extract at that line. Then find the same sentence in the PDF.

**3. The auditor is consistent, not just persuasive.** `procedures/deterministic-checks.md` is
the written procedure for the 24 controls that can be decided mechanically (composition rules,
lengths, hashing scheme, lockout threshold, cookie attributes, timeouts). Each `fixtures/*/`
folder is a small codebase with an `EXPECTED.md` saying what those procedures must produce.
Give any fixture to the auditor, ask for the audit, compare. The four that matter:

| Fixture | Expected | What it proves |
|---|---|---|
| `composition-obvious` | PWD-COMP-01 FAIL | The plain case |
| `composition-refactored` | PWD-COMP-01 FAIL | Same violation behind two helpers, a parameter named `value`, an errors array and a returned `{ok}` object. The procedure resolves what a value *is*, not what it is called |
| `composition-config` | PWD-COMP-01 FAIL | Same violation driven by a policy object |
| `observe-not-require` | PWD-COMP-01 PASS | The identical regexes, results only sent to a metrics helper. Same syntax, different meaning |

Plus `weak-session` (thirteen procedural failures), `missing-evidence` (no context declared,
hashing in an external service: EVIDENCE REQUIRED, never an invented PASS) and `compliant`
(positive evidence reported, not just the absence of complaints).

Then try to break it: add a composition rule anywhere in `fixtures/compliant/src/`, rename
things, split it into helpers, drive it from a policy object, and audit it again. Or keep the
regex and only log its result, and watch it pass.

## What is in the folder

| Path | What it is |
|---|---|
| `identity.md` | Who the auditor is, what it enforces, what it refuses to guess |
| `rules.md` | The contract: inputs, audit order, finding format, status and detection semantics, severity mapping, prohibitions |
| `examples.md` | Three complete audits: a real open-source repo and two fixtures |
| `procedures/deterministic-checks.md` | Step-by-step procedures for the 24 mechanically decidable controls |
| `reference/sp800-63b-4-in-scope.md` | The audited sections of NIST SP 800-63B-4, verbatim |
| `reference/requirements.json` | 85 atomic controls: id, section, verbatim quote, SHALL/SHOULD level, applicability condition, detection strategy |
| `reference/CITATION-INDEX.md` | Every control with the line number of its quote in the extract |
| `reference/OUT-OF-SCOPE.md` | Every section not audited, by number, with the reason; plus in-scope sentences that are deliberately not controls |
| `reference/PROVENANCE.md` | Publication identity, DOI, retrieval date, SHA-256 of the PDF, the HTML and the extract |
| `reference/NIST.SP.800-63B-4.pdf`, `sp800-63b-4.html` | The publication of record and the HTML edition it was extracted from |
| `receipts/` | Frozen test method and two recorded cold runs in a fresh claude.ai project: `composition-obvious` (FAIL) and `observe-not-require` (PASS), each with the unedited reply, the expected values written beforehand, and every deviation found with the fix it caused |
| `fixtures/*/` | Seven small codebases to audit, each with `EXPECTED.md` |
| `examples/node-express-boilerplate/` | The eleven files from the real repo that findings in `examples.md` cite, pinned at commit `179ae84` (MIT, license included; `SOURCE.md` says how to get the rest) |

## What it audits, and what it does not

**In scope** (85 controls): §3.1.1.2 Password Verifiers (length, character handling,
blocklists, composition rules, expiry, hints, hashing and salt, verifier UX), §3.2.2 Rate
Limiting, §5.1 Session Bindings, §5.1.1 Browser Cookies, §5.2 Reauthentication with the
AAL-specific timeout limits from §2.1.3, §2.2.3 and §2.3.3.

**Out of scope**, reported as such and never passed: every other section, listed by number in
[`reference/OUT-OF-SCOPE.md`](reference/OUT-OF-SCOPE.md). That includes OTP, passkeys and
hardware authenticators, biometrics, account recovery, federation, access tokens, and the
organizational, privacy and threat sections. Exclusion does not mean those sections are
non-normative; it means a code audit cannot establish them.

Verifier63 does not claim full SP 800-63B-4 conformance. It audits the normative requirements
within the declared control set and reports everything else as OUT OF SCOPE rather than
silently passing it.

## How a finding is built

- **Status**: PASS, FAIL, EVIDENCE REQUIRED (the obligation applies but the supplied files
  cannot settle it), NOT APPLICABLE (the control's factual condition is false, e.g. no
  keyed-hash step exists so the key-handling rules have nothing to govern).
- **Level**: SHALL / SHALL NOT / SHOULD / SHOULD NOT, copied from NIST. Never altered.
- **Severity**: conformance severity derived from Level (SHALL → HIGH, SHOULD → LOW). NIST
  supplies the level, not a risk rating, and neither does Verifier63. There is no MEDIUM.
- **Detection**: PROCEDURAL (the written procedure reached the verdict; a second reader
  following the same steps gets the same result), SEMANTIC (Claude judged from quoted code),
  NONE (no verdict reached).

Conditions on controls are always facts (`password_usage == single_factor`,
`keyed_hash_or_encryption_step_present == true`), never another control's verdict, so one
failure cannot make its siblings disappear.

## Known limits

- The procedures are written for TypeScript and JavaScript constructs. Other languages are
  audited semantically.
- A procedure that cannot resolve a value (runtime dispatch, dynamic property names, values
  from env, files or a database) downgrades to SEMANTIC and says so.
- `secure: process.env.NODE_ENV === "production"` and similar environment-dependent cookie
  flags are reported EVIDENCE REQUIRED, not guessed.
- The auditor evaluates what NIST wrote. Where practice and the text diverge (argon2 versus the
  PBKDF2 of SP 800-132), it reports the deviation at the SHOULD level and says plainly that
  this is not a finding of insecurity.
- A written procedure followed by a language model is consistent, not infallible. Every
  procedural finding quotes the lines it rests on, verbatim, so a reader can check it against
  the procedure in a minute. A companion edition, **verifier63**, implements the same 24
  procedures as a program (one `node verify.cjs` self-test, nothing to install) for anyone who
  prefers a machine to run them; this edition ships none of that code on purpose.
  https://github.com/ms-codehorizon/verifier63

## Standard and licence

NIST SP 800-63B-4, *Digital Identity Guidelines: Authentication and Authenticator Management*,
final, published July 31, 2025, DOI 10.6028/NIST.SP.800-63B-4. A work of the US government,
"not subject to copyright in the United States"; reproduced in `reference/` on that basis.
Full provenance and hashes in [`reference/PROVENANCE.md`](reference/PROVENANCE.md).

Verifier63 itself is MIT. The example repository under `examples/node-express-boilerplate/`
is MIT, copyright its authors; its licence file is included.

Built for Cliefnotes Weekly Comp #12, *The Auditor*, using
[Interpretable Context Methodology](https://github.com/RinDig/Interpreted-Context-Methdology):
folder structure as agent architecture.
