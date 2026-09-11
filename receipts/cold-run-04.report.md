# Unedited reply, cold run 04 (claude.ai Project, same Project as cold run 03, 2026-09-11)

Pasted exactly as returned. Formatting is the chat's rendering of the rules.md §6 layout.

---

Verifier63 audit — supplied artifact (password-validator.ts, policy.ts, session.ts)
Standard: NIST SP 800-63B-4 (final, 2025-07-31) — reference/PROVENANCE.md
Declared: aal=2 password_usage=part_of_mfa language=typescript
Files audited: password-validator.ts, policy.ts, session.ts (verifier63.yaml read for declared context; no `evidence/` folder supplied; no client, login, logout, TLS, or server-bootstrap files supplied)
Procedural checks: applied per procedures/deterministic-checks.md
Findings
PWD-LEN

```
REQ:        PWD-LEN-01
Status:     NOT APPLICABLE
Level:      SHALL
Severity:   HIGH
Detection:  PROCEDURAL
Location:   verifier63.yaml
Observed:   Declared password_usage=part_of_mfa; this minimum applies to the other usage mode.
Provision:  §3.1.1.2 "Verifiers and CSPs SHALL require passwords that are used as a single-factor authentication mechanism to be a minimum of 15 characters in length."

```

| PWD-LEN-02 | PASS | SHALL | HIGH | PROCEDURAL | password-validator.ts:5; policy.ts:10 | Minimum length enforced: 8 (`password.length < policy.minLength` with `policy.minLength = 8` from `DEFAULT_POLICY`); required >= 8 for password_usage=part_of_mfa. |
| PWD-LEN-03 | PASS | SHOULD | LOW | PROCEDURAL | password-validator.ts:5 | Password validator located; no maximum-length restriction applied in the supplied files. |
| PWD-LEN-04 | PASS | SHALL | HIGH | SEMANTIC | password-validator.ts:3,12 | `validate(password: string, ...)` and `signup(password: string)` both take and evaluate the whole password string; no partial-character or positional prompt exists in the supplied files. |
| PWD-LEN-05 | PASS | SHALL | HIGH | PROCEDURAL | session.ts:8-9 | No `.slice`/`.substring`/`.substr` applied to the password; `argon2.hash(password.normalize("NFC"), ...)` hashes the value unmodified. |
PWD-CHAR
| PWD-CHAR-01 | PASS | SHOULD | LOW | PROCEDURAL | password-validator.ts:3-9 | No anchored allowlist regex applied to the password; no whitespace stripping present in the supplied files. |
| PWD-CHAR-02 | PASS | SHOULD | LOW | PROCEDURAL | password-validator.ts:3-9 | No ASCII-only allowlist regex applied to the password in the supplied files (`unicode_passwords_accepted = true`). |

```
REQ:        PWD-CHAR-03
Status:     FAIL
Level:      SHALL
Severity:   HIGH
Detection:  SEMANTIC
Location:   password-validator.ts:5
Observed:   `password.length < policy.minLength` counts UTF-16 code units, not Unicode code points. Since Unicode is accepted (PWD-CHAR-02 PASS), a password containing an astral character (e.g. an emoji) has its length overcounted relative to code points.
Provision:  §3.1.1.2 "Each Unicode code point SHALL be counted as a single character when evaluating password length."

```

| PWD-CHAR-04 | PASS | SHOULD | LOW | PROCEDURAL | session.ts:9 | NFC normalization applied before hashing: `password.normalize("NFC")`. |

```
REQ:        PWD-CHAR-05
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   Unicode passwords are accepted, but no client/UI code is supplied that could show or omit advisory text to the subscriber.
Provision:  §3.1.1.2 "Subscribers choosing passwords that contain Unicode characters SHOULD be advised that some endpoints may represent some characters differently"

```

PWD-BLK

```
REQ:        PWD-BLK-01
Status:     FAIL
Level:      SHALL
Severity:   HIGH
Detection:  SEMANTIC
Location:   password-validator.ts:3-9,12-16
Observed:   `validate()` checks only length and character-class membership (uppercase, digit, symbol); `signup()` calls only `validate()` before accepting the password. No blocklist, breach-corpus, or common-password comparison exists anywhere in the supplied files.
Provision:  §3.1.1.2 "When processing a request to establish or change a password, verifiers SHALL compare the prospective secret against a blocklist that contains known commonly used, expected, or compromised passwords."

```

| PWD-BLK-02 | NOT APPLICABLE | SHALL | HIGH | NONE | password-validator.ts:3-9 | No blocklist check is present (blocklist_check_present = false). |
| PWD-BLK-03 | NOT APPLICABLE | SHALL | HIGH | NONE | password-validator.ts:3-9 | No blocklist check is present (blocklist_check_present = false). |
| PWD-BLK-04 | NOT APPLICABLE | SHALL | HIGH | NONE | password-validator.ts:3-9 | No blocklist check is present (blocklist_check_present = false). |
| PWD-BLK-05 | NOT APPLICABLE | SHOULD | LOW | NONE | password-validator.ts:3-9 | No blocklist check is present (blocklist_check_present = false). |

```
REQ:        PWD-BLK-06
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No client/UI code is supplied; whether guidance is shown to the subscriber at password creation cannot be established.
Provision:  §3.1.1.2 "Verifiers SHALL offer guidance to the subscriber to help the subscriber choose a strong password."

```

PWD-COMP

```
REQ:        PWD-COMP-01
Status:     FAIL
Level:      SHALL NOT
Severity:   HIGH
Detection:  PROCEDURAL
Location:   password-validator.ts:6-8
Observed:   Composition rule enforced: password-validator.ts:6 `!/[A-Z]/.test(password)` [/[A-Z]/] → `errors.push("uppercase required")`; password-validator.ts:7 `!/[0-9]/.test(password)` [/[0-9]/] → `errors.push("digit required")`; password-validator.ts:8 `!/[^A-Za-z0-9]/.test(password)` [/[^A-Za-z0-9]/] → `errors.push("symbol required")`. All three feed `errors`, which `signup()` throws on.
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
Observed:   No user store or compromise/must-reset flag is supplied; this behaviour cannot be established from the three files given.
Provision:  §3.1.1.2 "However, verifiers SHALL force a change if there is evidence that the authenticator has been compromised."

```


```
REQ:        PWD-COMP-04
Status:     EVIDENCE REQUIRED
Level:      SHALL NOT
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No user store is supplied; whether a password hint field exists or is exposed pre-authentication cannot be established.
Provision:  §3.1.1.2 "Verifiers and CSPs SHALL NOT permit the subscriber to store a hint (e.g., a reminder of how the password was created) that is accessible to an unauthenticated claimant."

```

| PWD-COMP-05 | PASS | SHALL NOT | HIGH | SEMANTIC | password-validator.ts:12-16 | `signup(password: string)` collects only a password; no security questions or KBA are collected anywhere in the supplied files. |
PWD-UX

```
REQ:        PWD-UX-01
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No client code supplied; autofill/password-manager behaviour is a client property.
Provision:  §3.1.1.2 "Verifiers SHALL allow the use of password managers and autofill functionality."

```


```
REQ:        PWD-UX-02
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   No client code supplied; paste behaviour is a client property.
Provision:  §3.1.1.2 "Verifiers SHOULD permit claimants to use the “paste” function when entering a password"

```


```
REQ:        PWD-UX-03
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   No client code supplied; display-password option is a client property.
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
Observed:   No server bootstrap or TLS configuration is supplied; transport cannot be established from password-validator.ts, policy.ts, or session.ts.
Provision:  §3.1.1.2 "Verifiers and CSPs SHALL use approved encryption and an authenticated protected channel when requesting passwords."

```

PWD-HASH
| PWD-HASH-01 | PASS | SHALL | HIGH | SEMANTIC | session.ts:8-9 | Passwords are hashed with argon2id (memory-hard, salted) via `hashPassword`, not stored in plaintext or reversible encryption. |
| PWD-HASH-02 | PASS | SHALL | HIGH | PROCEDURAL | session.ts:9 | Password hashing scheme in use: argon2 (`argon2.hash(password.normalize("NFC"), { type: argon2.argon2id, memoryCost: 65536, timeCost: 3 })`). Salt is generated by the scheme. |
| PWD-HASH-03 | PASS | SHOULD | LOW | SEMANTIC | session.ts:9 | `memoryCost: 65536` (64 MiB), `timeCost: 3` — at or above the RFC 9106 recommended argon2id parameters. |

```
REQ:        PWD-HASH-04
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   session.ts:9
Observed:   The cost parameters are hard-coded literals; no rehash-on-login or versioned cost factor is supplied to establish whether they are increased over time.
Provision:  §3.1.1.2 "It SHOULD be increased over time to account for increases in computing performance."

```


```
REQ:        PWD-HASH-05
Status:     FAIL
Level:      SHOULD
Severity:   LOW
Detection:  SEMANTIC
Location:   session.ts:9
Observed:   argon2 is not the SP 800-132 scheme (PBKDF2), and no updated NIST guideline qualifying argon2 is supplied in `evidence/`. This is a deviation from this NIST recommendation; it is not a finding that argon2 is insecure.
Provision:  §3.1.1.2 "An approved password hashing scheme published in the latest revision of [SP800-132] or updated NIST guidelines on password hashing schemes SHOULD be used."

```

| PWD-HASH-06 | PASS | SHOULD | LOW | SEMANTIC | session.ts:9 | The PHC-format string returned by `argon2.hash` is returned unmodified by `hashPassword`, not truncated. |

```
REQ:        PWD-HASH-07
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:9
Observed:   Salt generation is an argon2 library default; the library and version are not supplied and no `evidence/` folder documents the default salt length.
Provision:  §3.1.1.2 "The salt SHALL be at least 32 bits in length"

```


```
REQ:        PWD-HASH-08
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:9
Observed:   Salt generation is a library default; not supplied.
Provision:  §3.1.1.2 "and chosen to minimize salt value collisions among stored hashes (i.e., to prevent multiple subscriber accounts from having the same hashed password)."
Governing sentence: "The salt SHALL be at least 32 bits in length and chosen to minimize salt value collisions among stored hashes"

```

| PWD-HASH-09 | PASS | SHALL | HIGH | SEMANTIC | session.ts:9 | argon2's PHC-format output embeds both salt and hash by specification. |
| PWD-HASH-10 | PASS | SHOULD | LOW | SEMANTIC | session.ts:9 | PHC-format output embeds algorithm identifier, version, and parameters (memoryCost, timeCost) by specification. |

```
REQ:        PWD-HASH-11
Status:     FAIL
Level:      SHOULD
Severity:   LOW
Detection:  SEMANTIC
Location:   session.ts:8-9
Observed:   No keyed hashing or pepper step is performed after `argon2.hash`; the returned string is used as-is.
Provision:  §3.1.1.2 "In addition, verifiers SHOULD perform an additional iteration of a keyed hashing or encryption operation using a secret key known only to the verifier."

```

| PWD-HASH-12 | NOT APPLICABLE | SHALL | HIGH | NONE | session.ts:8-9 | No keyed step is implemented (keyed_hash_or_encryption_step_present = false). |
| PWD-HASH-13 | NOT APPLICABLE | SHALL | HIGH | NONE | session.ts:8-9 | No keyed step is implemented (keyed_hash_or_encryption_step_present = false). |
| PWD-HASH-14 | NOT APPLICABLE | SHOULD | LOW | NONE | session.ts:8-9 | No keyed step is implemented (keyed_hash_or_encryption_step_present = false). |
RATE
| RATE-01 | PASS | SHALL | HIGH | SEMANTIC | session.ts:20-26 | `recordFailedAttempt` counts failures per account (`account.failedAttempts`) and disables the authenticator (`account.disabled = true`) at a threshold, rather than limiting only by source address. |
| RATE-02 | PASS | SHALL | HIGH | PROCEDURAL | session.ts:6,22 | Consecutive failed attempts limited at 10 (`account.failedAttempts >= MAX_FAILED_ATTEMPTS`, `MAX_FAILED_ATTEMPTS = 10`); NIST cap is 100. |

```
REQ:        RATE-03
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   password_usage=part_of_mfa is declared but the second authenticator and any lockout path involving it are not in the supplied code.
Provision:  §3.2.2 "If more than one authenticator is involved with an excessive number of authentication attempts (e.g., single-factor cryptographic authenticator and centrally verified password), both authenticators SHALL be disabled."

```


```
REQ:        RATE-04
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:23
Observed:   `account.disabled = true` is set on lockout; the rebinding path that would re-enable the authenticator is not supplied.
Provision:  §3.2.2 "Authenticators that have been disabled SHALL be required to rebind to the subscriber account, as described in Sec. 4.1, to be usable in the future."

```


```
REQ:        RATE-05
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   No successful-login path is supplied; whether `account.failedAttempts` is reset on success cannot be established.
Provision:  §3.2.2 "When the subscriber successfully authenticates, the verifier SHOULD disregard any previous failed attempts for the authenticators used in the successful authentication."

```

| RATE-06 | NOT APPLICABLE | SHALL | HIGH | NONE | none supplied | No retry-count reset feature is present in the supplied code (retry_count_reset_feature_present = false). |
SESS
| SESS-01 | PASS | SHALL | HIGH | SEMANTIC | session.ts:12-14,16-18 | `newSessionId()` generates a session secret, shared with the subscriber via `setSessionCookie`. |
| SESS-02 | PASS | SHALL | HIGH | SEMANTIC | session.ts:16-18 | The secret is directly presented as a cookie value (`res.cookie("__Host-session", sessionId, ...)`). |

```
REQ:        SESS-03
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:12-18
Observed:   `newSessionId` and `setSessionCookie` exist as helpers, but no login call site, session-lookup, or continuity/validation logic is supplied.
Provision:  §5.1 "The continuity of authenticated sessions SHALL be based on the possession of a session secret that is issued by the session host at the time of authentication and optionally refreshed during the session."

```

| SESS-04 | PASS | SHOULD NOT | LOW | SEMANTIC | session.ts:17 | The session cookie options carry no `maxAge`/`expires`, so it is not retained across an application restart or device reboot. |
| SESS-05 | PASS | SHALL NOT | HIGH | SEMANTIC | session.ts:12-18 | No "remember me" or bearer-token-instead-of-authentication mechanism exists in the supplied files. |

```
REQ:        SESS-06
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:4-5
Observed:   `SESSION_ABSOLUTE_LIFETIME_MS` and `SESSION_IDLE_TIMEOUT_MS` are defined, but no code path enforcing them against a live session is supplied.
Provision:  §5.1 "However, RPs and CSPs SHALL ensure that the session lifetime limits described in Sec. 2.2.3 are enforced even when a knowledge of the session secret is demonstrated."

```


```
REQ:        SESS-07
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:12-14
Observed:   `newSessionId()` exists but no login/authentication call site invoking it is supplied.
Provision:  §5.1 "The secret used for session binding SHALL be generated by the session host in direct response to an authentication event."

```


```
REQ:        SESS-08
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   session.ts:12-18
Observed:   The session id and cookie carry no AAL property; no authentication-event context is supplied to determine inheritance.
Provision:  §5.1 "A session SHOULD inherit the AAL properties of the authentication event that triggered its creation."

```


```
REQ:        SESS-09
Status:     EVIDENCE REQUIRED
Level:      SHALL NOT
Severity:   HIGH
Detection:  NONE
Location:   session.ts:12-18
Observed:   No AAL claim structure exists on the session in the supplied files; cannot establish whether a session could be considered a higher AAL than its authentication event.
Provision:  §5.1 "A session MAY be considered at a lower AAL than the authentication event but SHALL NOT be considered at a higher AAL than the authentication event."

```


```
REQ:        SESS-10
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:12-14
Observed:   Same evidence as SESS-07: the helper exists but its call site at authentication is not supplied.
Provision:  §5.1 "Secrets are established during or immediately following authentication."
Governing sentence: "The secrets used for session binding SHALL meet all of the following requirements:"

```

| SESS-11 | PASS | SHALL | HIGH | PROCEDURAL | session.ts:13 | Session secret generated with a CSPRNG at 256 bits: `randomBytes(32)`. |

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
Observed:   No TLS/transport configuration is supplied.
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
Observed:   Timeout constants exist (see REAUTH-02/04/05), but the enforcement path that rejects a secret past those limits is not supplied.
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
Observed:   No client code supplied.
Provision:  §5.1 "the secrets used for session binding SHOULD be erased on the subscriber endpoint when they log out or when the secret is deemed to have expired."

```


```
REQ:        SESS-17
Status:     EVIDENCE REQUIRED
Level:      SHOULD NOT
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   No client code is supplied in which a `localStorage.setItem`/`sessionStorage.setItem` write could be located or ruled out.
Provision:  §5.1 "They SHOULD NOT be placed in insecure locations (e.g., HTML5 Local Storage) due to the potential exposure of local storage to cross-site scripting (XSS) attacks."

```


```
REQ:        SESS-18
Status:     EVIDENCE REQUIRED
Level:      SHALL NOT
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No TLS/HSTS or transport-fallback configuration is supplied.
Provision:  §5.1 "Following authentication, authenticated sessions SHALL NOT fall back to an insecure transport (e.g., from https to http)."

```


```
REQ:        SESS-19
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No POST/PUT request handlers are supplied.
Provision:  §5.1 "POST/PUT content SHALL contain a session identifier"

```


```
REQ:        SESS-20
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No POST/PUT request handlers are supplied.
Provision:  §5.1 "that the RP SHALL verify to protect against cross-site request forgery (CSRF)."

```


```
REQ:        SESS-21
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   No logout route/endpoint is supplied.
Provision:  §5.1 "Sessions SHOULD provide a readily accessible mechanism for subscribers to terminate (i.e., log off) their session when their interaction is complete."

```

COOK
| COOK-01 | PASS | SHALL | HIGH | PROCEDURAL | session.ts:17 | `secure: true`. |
| COOK-02 | PASS | SHALL | HIGH | SEMANTIC | session.ts:17 | `path: "/"` and no `domain` attribute set, so the cookie is scoped to the issuing host only. |
| COOK-03 | PASS | SHOULD | LOW | PROCEDURAL | session.ts:17 | `httpOnly: true`. |
| COOK-04 | PASS | SHOULD | LOW | PROCEDURAL | session.ts:17 | No `maxAge`/`expires`: session cookie, discarded when the browser session ends. |

```
REQ:        COOK-05
Status:     EVIDENCE REQUIRED
Level:      SHALL NOT
Severity:   HIGH
Detection:  NONE
Location:   session.ts:4-5
Observed:   Server-side lifetime constants exist, but the enforcement path independent of cookie expiry is not supplied.
Provision:  §5.1.1 "This requirement is intended to limit the accumulation of cookies but SHALL NOT be relied upon to enforce session timeouts."

```

| COOK-06 | PASS | SHOULD | LOW | PROCEDURAL | session.ts:17 | Cookie name: `__Host-session`; path: `"/"`. Requires the `__Host-` prefix and `Path=/`. |
| COOK-07 | PASS | SHOULD | LOW | PROCEDURAL | session.ts:17 | `sameSite: "strict"`. |
| COOK-08 | PASS | SHOULD | LOW | SEMANTIC | session.ts:13,17 | Cookie value is `randomBytes(32).toString("hex")` — an opaque random hex string, not structured data. |
| COOK-09 | PASS | SHALL NOT | HIGH | SEMANTIC | session.ts:13,17 | The cookie value is an opaque random hex identifier; it carries no personal information. |
REAUTH

```
REQ:        REAUTH-01
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:4-5
Observed:   Timeout constants exist, but the reauthentication-enforcement path (a forced re-login on expiry) is not supplied.
Provision:  §5.2 "The periodic reauthentication of sessions SHALL be performed to confirm the subscriber’s continued presence at an authenticated session"

```

| REAUTH-02 | PASS | SHALL | HIGH | PROCEDURAL | session.ts:4 | Absolute session lifetime configured: 43200000 ms (12.0 h) at `SESSION_ABSOLUTE_LIFETIME_MS = 12 * 60 * 60 * 1000`. |
| REAUTH-03 | NOT APPLICABLE | SHOULD | LOW | PROCEDURAL | verifier63.yaml | Declared aal=2; this limit is for AAL1. |
| REAUTH-04 | PASS | SHOULD | LOW | PROCEDURAL | session.ts:4 | Overall timeout 720 min vs AAL2 limit 1440 min (`SESSION_ABSOLUTE_LIFETIME_MS = 12 * 60 * 60 * 1000`). |
| REAUTH-05 | PASS | SHOULD | LOW | PROCEDURAL | session.ts:5 | Inactivity timeout 30 min vs AAL2 limit 60 min (`SESSION_IDLE_TIMEOUT_MS = 30 * 60 * 1000`). |
| REAUTH-06 | NOT APPLICABLE | SHALL | HIGH | PROCEDURAL | verifier63.yaml | Declared aal=2; this limit is for AAL3. |
| REAUTH-07 | NOT APPLICABLE | SHOULD | LOW | PROCEDURAL | verifier63.yaml | Declared aal=2; this limit is for AAL3. |

```
REQ:        REAUTH-08
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:4-5
Observed:   Timeout constants exist; the code that terminates a session on expiry is not supplied.
Provision:  §5.2 "When either timeout expires, the session SHALL be terminated."

```


```
REQ:        REAUTH-09
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:5
Observed:   `SESSION_IDLE_TIMEOUT_MS` is configured (inactivity_timeout_configured = true), but no activity-tracking/reset-on-activity code is supplied.
Provision:  §5.2 "Session activity SHALL reset the inactivity timeout"

```


```
REQ:        REAUTH-10
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No re-login/reauthentication path is supplied.
Provision:  §5.2 "successful reauthentication during a session SHALL reset both timeouts."

```

Summary

```
Mandatory conformance failures (SHALL / SHALL NOT):   3
Recommended-practice deviations (SHOULD / SHOULD NOT): 2
Evidence gaps:                                        35
Not applicable (condition false):                     12
Passed controls:                                      33
Total controls audited:                               85

```

Out of scope
Reported per reference/OUT-OF-SCOPE.md. Not audited, not passed.
Outside the standard
No password_usage=part_of_mfa companion factor (e.g. OTP, cryptographic authenticator) is present anywhere in the supplied files, which is why RATE-03 could not be evaluated. No control covers this observation directly; it is noted only to explain the evidence gap.
