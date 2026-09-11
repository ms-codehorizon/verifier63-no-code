# Control 01: fixtures/observe-not-require, no folder loaded

Date: 2026-09-11. Surface: claude.ai, a plain chat started from the home screen, outside the
Verifier63 Project, with none of this folder attached. Operator: the folder's author. Full
unedited reply: `control-01.report.md`.

A first attempt was discarded before it was recorded: that chat had earlier attachments from
this folder in its context, so the folder could not be said to be absent. It is not reproduced
here. The reply below is from a second, clean chat; it contains no REQ ids, no `PROCEDURAL`,
no `EVIDENCE REQUIRED`, which is the check that nothing leaked.

## Why a control

Cold run 02 showed the auditor giving `PWD-COMP-01` PASS on `observe-not-require`. A control
asks what the same model does with the same files and the same prompt when it has not read
`identity.md`, `rules.md`, `procedures/` or `reference/`. Without it, nothing in this folder
shows what the folder adds; the model might get everything right on its own.

## Instance

- No Project. No files from this folder.
- Attached in the chat: `fixtures/observe-not-require/src/password-validator.ts`,
  `fixtures/observe-not-require/src/metrics.ts`, `fixtures/observe-not-require/src/session.ts`,
  `fixtures/observe-not-require/verifier63.yaml` (`aal: 2`, `password_usage: part_of_mfa`).
- Prompt: *Audit this against NIST SP 800-63B-4.* Same as cold run 02.

## What the bare model got right

- Composition: PASS. It saw that the regex results only feed `metrics.record` and are never
  used to reject, and it said so in one sentence. The headline test of this folder is therefore
  not something only the folder can do.
- Blocklist: FAIL, as a SHALL, with a close paraphrase of §3.1.1.2 (not presented as a quote).
- Minimum length 8 for `part_of_mfa`, argon2id parameters read correctly, NFC noted, 10-failure
  lockout noted, cookie attributes read correctly.
- It marked maximum length and character set as "not visible in provided code" rather than
  passing or failing them. That is the same instinct as EVIDENCE REQUIRED, applied once.

## Where it differed from cold run 02, checked against `reference/sp800-63b-4-in-scope.md`

| Topic | Bare model | Auditor (cold run 02) | The text |
|---|---|---|---|
| AAL2 timeouts | "12-hour absolute lifetime and 30-minute idle timeout match the classic AAL2 reauthentication cadence (periodic reauthentication ~every 12 hours, idle timeout ~30 minutes)" | REAUTH-02 PASS, REAUTH-04 PASS: 12 h against a limit of 24 h; inactivity 30 min against a limit of 1 h | §2.2.3, extract line 39: overall timeout SHOULD be no more than 24 hours at AAL2, inactivity SHOULD be no more than 1 hour. The bare model's figures are the Rev 3 numbers. The code passes either way; the stated requirement is wrong, and a 20-hour session would have been failed by it and passed by the text |
| Length floor | "the general floor is at least 8 characters for subscriber-chosen memorized secrets" | PWD-LEN-02 PASS, citing the sentence that allows 8 only for passwords used as part of MFA | §3.1.1.2, line 53: 15 for single-factor, 8 for multi-factor. There is no "general floor" of 8 in Rev 4; "memorized secret" is Rev 3 vocabulary |
| Cookies | "solid session-binding hygiene consistent with 800-63B's session binding expectations" | COOK-01 through COOK-07, each PASS or EVIDENCE REQUIRED, each citing §5.1.1 | §5.1.1 Browser Cookies, extract lines 161 to 166: Secure and host/path scoping are SHALL; HttpOnly, expiry, `__Host-` with `Path=/`, SameSite are SHOULD. The bare model treated a list of six requirements as hygiene and did not check them one by one |
| Hashing scheme | argon2id "is an accepted memory-hard KDF for this purpose" | PWD-HASH-05 FAIL LOW: SP 800-132 (PBKDF2) is the scheme the text names; argon2 is a deviation from the recommendation, not a finding of insecurity | §3.1.1.2: "An approved password hashing scheme published in the latest revision of [SP800-132] or updated NIST guidelines on password hashing schemes SHOULD be used." The bare model asserted acceptance the text does not give |
| Lockout | "availability risk", "denial-of-service vector", advice to throttle or add recovery | RATE-01, RATE-02 PASS (10 consecutive failures against a cap of 100); RATE-04, RATE-05 EVIDENCE REQUIRED because the unlock path and the reset-on-success path are not in the supplied files | §3.2.2, extract line 101: techniques to reduce the chance of locking out the legitimate claimant are a MAY, listed as options. Reasonable advice; the text makes it optional, and the auditor's EVIDENCE REQUIRED is the question the bare model answered by assumption |
| Logging of composition flags | Raised as a hygiene concern | Not raised | Not a provision in scope. The bare model's point is fair engineering advice with no sentence in the standard behind it, and it said so |
| Coverage | Ten areas in the summary table; no file:line; no per-provision verdicts | 85 rows; every row PASS, FAIL, EVIDENCE REQUIRED or NOT APPLICABLE with a location; 35 rows EVIDENCE REQUIRED | For example PWD-UX-01 (password managers and autofill SHALL be allowed), PWD-CHAR-03 (code points counted as characters, which `password.length` violates) and the seven cookie rows do not appear in the bare reply at all |

## Reading

The bare model is a good reviewer and a loose auditor. It reached the right verdict on the two
controls a reader would test first, then stated the AAL2 timeouts from the previous revision,
invented a "general floor" the text does not contain, and accepted argon2 on its own authority.
It never cited a section or a sentence, so none of that can be checked from its reply alone.
It also missed a SHALL-level failure the auditor found: `password.length < 8` counts UTF-16
code units, and §3.1.1.2 says each Unicode code point SHALL count as one character
(PWD-CHAR-03 FAIL in cold run 02).

The folder's contribution is not intelligence; it is the pinned text, the obligation to answer
all 85 controls, the verbatim rule, and a status for "the files do not show this".

What this control does not prove: that the auditor is right where the two differ. The table
above points at the extract line for each difference so a reader can decide, and the extract
hashes back to the NIST PDF per `reference/PROVENANCE.md`. It also does not prove the bare
model would be this good or this loose on a second run; it is one sample.
