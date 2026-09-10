# Unedited reply, cold run 02 (claude.ai Project, 2026-09-10)

Pasted exactly as returned. Formatting is the chat's rendering of the rules.md §6 layout.

---

Verifier63 audit - uploaded auth module (password-validator.ts, metrics.ts, session.ts)
Standard: NIST SP 800-63B-4 (final, 2025-07-31) — reference/PROVENANCE.md
Declared: aal=2 password_usage=part_of_mfa language=typescript
Files audited: password-validator.ts, metrics.ts, session.ts, verifier63.yaml
Procedural checks: applied per procedures/deterministic-checks.md
Findings
PWD-LEN
| PWD-LEN-01 | NOT APPLICABLE | SHALL | HIGH | PROCEDURAL | verifier63.yaml | password_usage=part_of_mfa; this minimum applies to the other usage mode. |
| PWD-LEN-02 | PASS | SHALL | HIGH | PROCEDURAL | password-validator.ts:8 | Minimum length enforced: 8 (`password.length < 8`); required ≥ 8 for password_usage=part_of_mfa. |
| PWD-LEN-03 | PASS | SHOULD | LOW | PROCEDURAL | password-validator.ts:7-17 | Password validator located; no maximum-length restriction applied in the supplied files. |
| PWD-LEN-04 | PASS | SHALL | HIGH | SEMANTIC | password-validator.ts:7 | `validatePassword(password: string): void` receives and evaluates the whole string, not a subset. |
| PWD-LEN-05 | PASS | SHALL | HIGH | PROCEDURAL | password-validator.ts, session.ts:9 | No `.slice`/`.substring`/`.substr` applied to the password before hashing or comparison in the supplied files; hashing is via `argon2.hash`, not bcrypt, so the 72-byte truncation caveat does not apply. |
PWD-CHAR
| PWD-CHAR-01 | PASS | SHOULD | LOW | PROCEDURAL | password-validator.ts | No anchored allowlist regex or whitespace stripping applied to the password in the supplied files. `unicode_passwords_accepted = true`. |
| PWD-CHAR-02 | PASS | SHOULD | LOW | PROCEDURAL | password-validator.ts | No ASCII-only allowlist applied to the password in the supplied files. |

```
REQ:        PWD-CHAR-03
Status:     FAIL
Level:      SHALL
Severity:   HIGH
Detection:  SEMANTIC
Location:   password-validator.ts:8
Observed:   `password.length < 8` counts UTF-16 code units, not Unicode code points. Since Unicode is
            accepted (no ASCII allowlist is present) and `session.ts:9` normalizes with NFC before
            hashing, a password containing an astral character (e.g. an emoji) is undercounted by
            `.length`; use `[...password].length` instead.
Provision:  §3.1.1.2 "Each Unicode code point SHALL be counted as a single character when evaluating password length."
```

```
REQ:        PWD-CHAR-04
Status:     PASS
Level:      SHOULD
Severity:   LOW
Detection:  PROCEDURAL
Location:   session.ts:9
Observed:   `argon2.hash(password.normalize("NFC"), { type: argon2.argon2id, memoryCost: 65536, timeCost: 3 })` — NFC normalization is applied before hashing.
Provision:  §3.1.1.2 "If Unicode characters are accepted in passwords, the verifier SHOULD apply the normalization process for stabilized strings using the Normalization Form Canonical Composition (NFC) normalization"
```

```
REQ:        PWD-CHAR-05
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   No client-facing UI code is supplied, so no advisory text to subscribers about
            cross-endpoint Unicode representation differences can be located.
Provision:  §3.1.1.2 "Subscribers choosing passwords that contain Unicode characters SHOULD be advised that some endpoints may represent some characters differently"
```

PWD-BLK

```
REQ:        PWD-BLK-01
Status:     FAIL
Level:      SHALL
Severity:   HIGH
Detection:  SEMANTIC
Location:   password-validator.ts:7-17
Observed:   `validatePassword` checks only length (`password.length < 8`) and records three
            character-class observations to `metrics`. No comparison against a blocklist of
            common, expected, or previously breached passwords exists anywhere in the supplied
            files.
Provision:  §3.1.1.2 "When processing a request to establish or change a password, verifiers SHALL compare the prospective secret against a blocklist that contains known commonly used, expected, or compromised passwords."
```

| PWD-BLK-02 | NOT APPLICABLE | SHALL | HIGH | NONE | password-validator.ts | No blocklist check is present (blocklist_check_present = false). |
| PWD-BLK-03 | NOT APPLICABLE | SHALL | HIGH | NONE | password-validator.ts | No blocklist check is present (blocklist_check_present = false). |
| PWD-BLK-04 | NOT APPLICABLE | SHALL | HIGH | NONE | password-validator.ts | No blocklist check is present (blocklist_check_present = false). |
| PWD-BLK-05 | NOT APPLICABLE | SHOULD | LOW | NONE | password-validator.ts | No blocklist check is present (blocklist_check_present = false). |

```
REQ:        PWD-BLK-06
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   password-validator.ts:19-22
Observed:   `strengthHint` returns "strong" or "consider a longer passphrase" based on character
            classes present, but nothing in the supplied files shows this string is ever surfaced
            to the subscriber during password creation (it is exported but never called elsewhere
            in the supplied files).
Provision:  §3.1.1.2 "Verifiers SHALL offer guidance to the subscriber to help the subscriber choose a strong password."
```

PWD-COMP

```
REQ:        PWD-COMP-01
Status:     PASS
Level:      SHALL NOT
Severity:   HIGH
Detection:  PROCEDURAL
Location:   password-validator.ts:11-16, 19-21
Observed:   Character-class checks exist but none reach a rejection path. In `validatePassword`,
            `hasUppercase`/`hasDigit`/`hasSymbol` (lines 11-13) are passed only to
            `metrics.record(...)` (lines 14-16), an observation sink. In `strengthHint` (lines
            19-21), the same class of regex tests feeds only a returned advisory string
            ("strong" / "consider a longer passphrase") — a strength meter, not a gate — and
            `strengthHint` is never invoked elsewhere in the supplied files, so no rejection
            path exists for its result either. No character-class check anywhere in the supplied
            files reaches a `throw`, `return false`, or error-collecting sink.
Provision:  §3.1.1.2 "Verifiers and CSPs SHALL NOT impose other composition rules (e.g., requiring mixtures of different character types) for passwords."
```

| PWD-COMP-02 | PASS | SHALL NOT | HIGH | PROCEDURAL | all supplied files | No password age, expiry, or rotation-interval logic located in the supplied files. |

```
REQ:        PWD-COMP-03
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   Only a password validator and a session/hashing helper are supplied; no compromised-flag
            or forced-reset logic is present or absent from a fuller view of the account model.
Provision:  §3.1.1.2 "However, verifiers SHALL force a change if there is evidence that the authenticator has been compromised."
```

```
REQ:        PWD-COMP-04
Status:     EVIDENCE REQUIRED
Level:      SHALL NOT
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No user/account storage schema is supplied; whether a password hint field exists and is
            exposed pre-authentication cannot be established.
Provision:  §3.1.1.2 "Verifiers and CSPs SHALL NOT permit the subscriber to store a hint (e.g., a reminder of how the password was created) that is accessible to an unauthenticated claimant."
```

| PWD-COMP-05 | PASS | SHALL NOT | HIGH | SEMANTIC | password-validator.ts:7,19 | `validatePassword` and `strengthHint` take only a password string; no security-question or KBA collection appears anywhere in the supplied files. |
PWD-UX

```
REQ:        PWD-UX-01
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No client-side form/markup is supplied; autofill and password-manager compatibility are client properties.
Provision:  §3.1.1.2 "Verifiers SHALL allow the use of password managers and autofill functionality."
```

```
REQ:        PWD-UX-02
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   No client-side form/markup is supplied; paste behavior is a client property.
Provision:  §3.1.1.2 "Verifiers SHOULD permit claimants to use the “paste” function when entering a password"
```

```
REQ:        PWD-UX-03
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   No client-side form/markup is supplied; a show/hide password toggle is a client property.
Provision:  §3.1.1.2 "the verifier SHOULD offer an option to display the password — rather than a series of dots or asterisks — while it is entered and until it is submitted to the verifier."
```

PWD-CHAN

```
REQ:        PWD-CHAN-01
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No server or TLS listener configuration is supplied in any of the uploaded files.
Provision:  §3.1.1.2 "Verifiers and CSPs SHALL use approved encryption and an authenticated protected channel when requesting passwords."
```

PWD-HASH
| PWD-HASH-01 | PASS | SHALL | HIGH | SEMANTIC | session.ts:8-10 | Passwords are hashed with `argon2.hash(...)`, a computationally expensive scheme resistant to offline attack, rather than stored plaintext or reversibly encrypted. |
| PWD-HASH-02 | PASS | SHALL | HIGH | PROCEDURAL | session.ts:9 | Password hashing scheme in use: argon2 (`argon2.hash(password.normalize("NFC"), { type: argon2.argon2id, memoryCost: 65536, timeCost: 3 })`). Salt is generated by the scheme. |
| PWD-HASH-03 | PASS | SHOULD | LOW | SEMANTIC | session.ts:9 | `memoryCost: 65536` (64 MiB), `timeCost: 3` — at or above the RFC 9106-recommended argon2id parameters. |

```
REQ:        PWD-HASH-04
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   session.ts:9
Observed:   `memoryCost`/`timeCost` are hard-coded literals with no version tag or rehash-on-login logic in the supplied files.
Provision:  §3.1.1.2 "It SHOULD be increased over time to account for increases in computing performance."
```

```
REQ:        PWD-HASH-05
Status:     FAIL
Level:      SHOULD
Severity:   LOW
Detection:  SEMANTIC
Location:   session.ts:9
Observed:   argon2id is used, not the SP 800-132 scheme (PBKDF2), and no updated NIST guideline
            qualifying argon2 is supplied in evidence. This is a deviation from this NIST
            recommendation; it is not a finding that argon2 is insecure.
Provision:  §3.1.1.2 "An approved password hashing scheme published in the latest revision of [SP800-132] or updated NIST guidelines on password hashing schemes SHOULD be used."
```

| PWD-HASH-06 | PASS | SHOULD | LOW | SEMANTIC | session.ts:9 | The PHC-format string returned by `argon2.hash` is returned unmodified — no truncation before storage is shown. |

```
REQ:        PWD-HASH-07
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:9
Observed:   Salt length rests on the argon2 library's default (16 bytes/128 bits); the library
            implementation/version is not supplied and no `evidence/` folder is present to confirm it.
Provision:  §3.1.1.2 "The salt SHALL be at least 32 bits in length"
```

```
REQ:        PWD-HASH-08
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:9
Observed:   Salt generation and collision-avoidance are library defaults; the library implementation is not supplied.
Provision:  §3.1.1.2 "and chosen to minimize salt value collisions among stored hashes (i.e., to prevent multiple subscriber accounts from having the same hashed password)."
Governing sentence: "The salt SHALL be at least 32 bits in length and chosen to minimize salt value collisions among stored hashes"
```

| PWD-HASH-09 | PASS | SHALL | HIGH | SEMANTIC | session.ts:9 | argon2's PHC-format output embeds both the salt and the hash by specification. |
| PWD-HASH-10 | PASS | SHOULD | LOW | SEMANTIC | session.ts:9 | The PHC-format output embeds the algorithm identifier, version, and parameters (memoryCost, timeCost) by specification. |

```
REQ:        PWD-HASH-11
Status:     FAIL
Level:      SHOULD
Severity:   LOW
Detection:  SEMANTIC
Location:   session.ts:8-10
Observed:   `hashPassword` returns the raw `argon2.hash(...)` output directly; no additional keyed
            hashing or encryption iteration using a verifier-only secret key is performed.
Provision:  §3.1.1.2 "In addition, verifiers SHOULD perform an additional iteration of a keyed hashing or encryption operation using a secret key known only to the verifier."
```

| PWD-HASH-12 | NOT APPLICABLE | SHALL | HIGH | NONE | session.ts:8-10 | No keyed hashing/encryption step is implemented (keyed_hash_or_encryption_step_present = false). |
| PWD-HASH-13 | NOT APPLICABLE | SHALL | HIGH | NONE | session.ts:8-10 | No keyed step is implemented (keyed_hash_or_encryption_step_present = false). |
| PWD-HASH-14 | NOT APPLICABLE | SHOULD | LOW | NONE | session.ts:8-10 | No keyed step is implemented (keyed_hash_or_encryption_step_present = false). |
RATE
| RATE-01 | PASS | SHALL | HIGH | SEMANTIC | session.ts:20-25 | `recordFailedAttempt` counts failures per account object and disables the authenticator at 10 consecutive failures. |
| RATE-02 | PASS | SHALL | HIGH | PROCEDURAL | session.ts:22 | Consecutive failed attempts limited at 10 (`account.failedAttempts >= MAX_FAILED_ATTEMPTS`, `MAX_FAILED_ATTEMPTS = 10`); NIST cap is 100. |

```
REQ:        RATE-03
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   password_usage=part_of_mfa is declared, implying a second authenticator exists, but that
            authenticator and its lockout path are not present in the supplied files.
Provision:  §3.2.2 "If more than one authenticator is involved with an excessive number of authentication attempts (e.g., single-factor cryptographic authenticator and centrally verified password), both authenticators SHALL be disabled."
```

```
REQ:        RATE-04
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:23
Observed:   `account.disabled = true` is set on lockout, but no rebinding path that re-enables the account is supplied.
Provision:  §3.2.2 "Authenticators that have been disabled SHALL be required to rebind to the subscriber account, as described in Sec. 4.1, to be usable in the future."
```

```
REQ:        RATE-05
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   No successful-authentication path is supplied; whether `failedAttempts` is reset on success cannot be established.
Provision:  §3.2.2 "When the subscriber successfully authenticates, the verifier SHOULD disregard any previous failed attempts for the authenticators used in the successful authentication."
```

| RATE-06 | NOT APPLICABLE | SHALL | HIGH | NONE | none supplied | No retry-count reset feature is present in the supplied code. |
SESS
| SESS-01 | PASS | SHALL | HIGH | SEMANTIC | session.ts:12-17 | A session id (`newSessionId`) is generated and set as a cookie (`setSessionCookie`). |
| SESS-02 | PASS | SHALL | HIGH | SEMANTIC | session.ts:16-17 | The session secret is presented directly as a cookie value. |

```
REQ:        SESS-03
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:12-17
Observed:   Session-creation and cookie-setting helpers exist; the lookup/resolve path that
            establishes continuity for subsequent requests is not supplied.
Provision:  §5.1 "The continuity of authenticated sessions SHALL be based on the possession of a session secret that is issued by the session host at the time of authentication and optionally refreshed during the session."
```

| SESS-04 | PASS | SHOULD NOT | LOW | SEMANTIC | session.ts:17 | The cookie set by `setSessionCookie` has no `maxAge`/`expires`: not persistent across an application restart or device reboot. |
| SESS-05 | PASS | SHALL NOT | HIGH | SEMANTIC | session.ts:12-18 | No "remember my browser" mechanism appears anywhere in the supplied code. |

```
REQ:        SESS-06
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:4-5
Observed:   `SESSION_ABSOLUTE_LIFETIME_MS` and `SESSION_IDLE_TIMEOUT_MS` are defined, but no code path enforcing them is supplied.
Provision:  §5.1 "However, RPs and CSPs SHALL ensure that the session lifetime limits described in Sec. 2.2.3 are enforced even when a knowledge of the session secret is demonstrated."
```

```
REQ:        SESS-07
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:12-14
Observed:   `newSessionId()` exists as a standalone helper; the login/authentication call site that
            invokes it is not supplied, so it cannot be confirmed the secret is generated in direct
            response to an authentication event.
Provision:  §5.1 "The secret used for session binding SHALL be generated by the session host in direct response to an authentication event."
```

```
REQ:        SESS-08
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   Only a password validator and session helper file are supplied; whether the session
            inherits AAL properties of the authentication event cannot be established.
Provision:  §5.1 "A session SHOULD inherit the AAL properties of the authentication event that triggered its creation."
```

```
REQ:        SESS-09
Status:     EVIDENCE REQUIRED
Level:      SHALL NOT
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No AAL-tagging logic on sessions is supplied or absent from a fuller view of the application.
Provision:  §5.1 "A session MAY be considered at a lower AAL than the authentication event but SHALL NOT be considered at a higher AAL than the authentication event."
```

```
REQ:        SESS-10
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:12-14
Observed:   Same evidence gap as SESS-07: the call site establishing the secret at/after authentication is not supplied.
Provision:  §5.1 "Secrets are established during or immediately following authentication."
Governing sentence: "The secrets used for session binding SHALL meet all of the following requirements:"
```

| SESS-11 | PASS | SHALL | HIGH | PROCEDURAL | session.ts:13 | Session secret generated with a CSPRNG at 256 bits: `randomBytes(32)` ≥ the 64-bit minimum. |

```
REQ:        SESS-12
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No logout path is supplied; whether the session secret is erased/invalidated on logout cannot be established.
Provision:  §5.1 "Secrets are erased or invalidated by the session subject when the subscriber logs out."
Governing sentence: "The secrets used for session binding SHALL meet all of the following requirements:"
```

```
REQ:        SESS-13
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No TLS/server configuration is supplied (same gap as PWD-CHAN-01).
Provision:  §5.1 "Secrets are either transferred from the session host to the RP or CSP via an authenticated protected channel or derived from keys that are established as part of establishing a valid, mutually authenticated protected channel."
Governing sentence: "The secrets used for session binding SHALL meet all of the following requirements:"
```

```
REQ:        SESS-14
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:4-5
Observed:   Timeout constants exist (`SESSION_ABSOLUTE_LIFETIME_MS`, `SESSION_IDLE_TIMEOUT_MS`) but the enforcement path that rejects secrets past those limits is not supplied.
Provision:  §5.1 "Secrets will time out and are not accepted after the times specified in Sec. 2.1.3, Sec. 2.2.3, and Sec. 2.3.3, as appropriate for the AAL."
Governing sentence: "The secrets used for session binding SHALL meet all of the following requirements:"
```

```
REQ:        SESS-15
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No proxy/CDN/load-balancer configuration is supplied.
Provision:  §5.1 "Secrets are unavailable to intermediaries between the host and the subscriber’s endpoint."
Governing sentence: "The secrets used for session binding SHALL meet all of the following requirements:"
```

```
REQ:        SESS-16
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   No client-side code is supplied; endpoint-side erasure on logout/expiry is a client property.
Provision:  §5.1 "the secrets used for session binding SHOULD be erased on the subscriber endpoint when they log out or when the secret is deemed to have expired."
```

```
REQ:        SESS-17
Status:     EVIDENCE REQUIRED
Level:      SHOULD NOT
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   No client-side code is supplied; whether the token is ever written to `localStorage`/`sessionStorage` cannot be established.
Provision:  §5.1 "They SHOULD NOT be placed in insecure locations (e.g., HTML5 Local Storage) due to the potential exposure of local storage to cross-site scripting (XSS) attacks."
```

```
REQ:        SESS-18
Status:     EVIDENCE REQUIRED
Level:      SHALL NOT
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No TLS/HSTS/redirect configuration is supplied.
Provision:  §5.1 "Following authentication, authenticated sessions SHALL NOT fall back to an insecure transport (e.g., from https to http)."
```

```
REQ:        SESS-19
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No request-handler code is supplied; whether POST/PUT bodies carry a session-bound identifier cannot be established.
Provision:  §5.1 "POST/PUT content SHALL contain a session identifier"
```

```
REQ:        SESS-20
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   Same evidence gap as SESS-19; no server-side verification of a CSRF/session token is supplied.
Provision:  §5.1 "that the RP SHALL verify to protect against cross-site request forgery (CSRF)."
```

```
REQ:        SESS-21
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   No logout route or handler is supplied.
Provision:  §5.1 "Sessions SHOULD provide a readily accessible mechanism for subscribers to terminate (i.e., log off) their session when their interaction is complete."
```

COOK
| COOK-01 | PASS | SHALL | HIGH | PROCEDURAL | session.ts:17 | `secure: true`. |
| COOK-02 | PASS | SHALL | HIGH | SEMANTIC | session.ts:17 | `path: "/"` and no `Domain` attribute set, so the cookie is scoped to the issuing host only. |
| COOK-03 | PASS | SHOULD | LOW | PROCEDURAL | session.ts:17 | `httpOnly: true`. |
| COOK-04 | PASS | SHOULD | LOW | PROCEDURAL | session.ts:17 | No `maxAge`/`expires` set: a session cookie, discarded at browser-session end. |

```
REQ:        COOK-05
Status:     EVIDENCE REQUIRED
Level:      SHALL NOT
Severity:   HIGH
Detection:  NONE
Location:   session.ts:4-5
Observed:   Server-side lifetime constants exist (`SESSION_ABSOLUTE_LIFETIME_MS`,
            `SESSION_IDLE_TIMEOUT_MS`), but their independent enforcement is not supplied — see SESS-06/REAUTH-08.
Provision:  §5.1.1 "This requirement is intended to limit the accumulation of cookies but SHALL NOT be relied upon to enforce session timeouts."
```

| COOK-06 | PASS | SHOULD | LOW | PROCEDURAL | session.ts:17 | Cookie name `__Host-session`; path `"/"`. Satisfies the `__Host-` prefix + `Path=/` requirement. |
| COOK-07 | PASS | SHOULD | LOW | PROCEDURAL | session.ts:17 | `sameSite: "strict"`. |
| COOK-08 | PASS | SHOULD | LOW | SEMANTIC | session.ts:13,17 | Cookie value is a 32-byte random hex string (`randomBytes(32).toString("hex")`) — an opaque identifier, not structured data. |
| COOK-09 | PASS | SHALL NOT | HIGH | SEMANTIC | session.ts:13,17 | The hex session id carries no personal information. |
REAUTH

```
REQ:        REAUTH-01
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:4-5
Observed:   Timeout constants exist; the reauthentication enforcement path that acts on them is not supplied.
Provision:  §5.2 "The periodic reauthentication of sessions SHALL be performed to confirm the subscriber’s continued presence at an authenticated session"
```

| REAUTH-02 | PASS | SHALL | HIGH | PROCEDURAL | session.ts:4 | Absolute session lifetime configured: 43,200,000 ms (12.0 h) — `SESSION_ABSOLUTE_LIFETIME_MS = 12 * 60 * 60 * 1000`. |
| REAUTH-03 | NOT APPLICABLE | SHOULD | LOW | PROCEDURAL | verifier63.yaml | Declared aal=2; this limit is for AAL1. |
| REAUTH-04 | PASS | SHOULD | LOW | PROCEDURAL | session.ts:4 | Overall timeout 12 h vs. the AAL2 limit of 24 h. |
| REAUTH-05 | PASS | SHOULD | LOW | PROCEDURAL | session.ts:5 | Inactivity timeout 30 min vs. the AAL2 limit of 1 h — `SESSION_IDLE_TIMEOUT_MS = 30 * 60 * 1000`. |
| REAUTH-06 | NOT APPLICABLE | SHALL | HIGH | PROCEDURAL | verifier63.yaml | Declared aal=2; this limit is for AAL3. |
| REAUTH-07 | NOT APPLICABLE | SHOULD | LOW | PROCEDURAL | verifier63.yaml | Declared aal=2; this limit is for AAL3. |

```
REQ:        REAUTH-08
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:4-5
Observed:   Enforcement path (terminating the session when either timeout elapses) is not supplied.
Provision:  §5.2 "When either timeout expires, the session SHALL be terminated."
```

```
REQ:        REAUTH-09
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:5
Observed:   `SESSION_IDLE_TIMEOUT_MS` exists (inactivity_timeout_configured = true), but the reset-on-activity code is not supplied.
Provision:  §5.2 "Session activity SHALL reset the inactivity timeout"
```

```
REQ:        REAUTH-10
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No re-login/reauthentication code path is supplied.
Provision:  §5.2 "successful reauthentication during a session SHALL reset both timeouts."
```

Summary

```
Mandatory conformance failures (SHALL / SHALL NOT):   2
Recommended-practice deviations (SHOULD / SHOULD NOT): 2
Evidence gaps:                                        35
Not applicable (condition false):                     12
Passed controls:                                      34
Total controls audited:                               85
```

Out of scope
Reported per reference/OUT-OF-SCOPE.md. Not audited, not passed.
Outside the standard (not a control, noted per rules.md §7 limit of three lines): `metrics.ts` writes password character-class flags (`password_has_uppercase`, etc.) to `console.log` via `metrics.record`. This is not itself a normative violation (PWD-COMP-01 passes because it is observation, not enforcement), but logging derived password characteristics is worth a second look outside this audit's scope.
