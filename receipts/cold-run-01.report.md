# Unedited reply, cold run 01 (claude.ai Project, 2026-09-10)

Pasted exactly as returned. Formatting is the chat's rendering of the rules.md §6 layout.

---

Verifier63 audit - password-validator.ts + session.ts
Standard: NIST SP 800-63B-4 (final, 2025-07-31) - reference/PROVENANCE.md
Declared: aal=2 password_usage=part_of_mfa language=typescript
Files audited: password-validator.ts, session.ts
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
Observed:   password_usage=part_of_mfa; this minimum applies to the other usage mode.
Provision:  §3.1.1.2 "Verifiers and CSPs SHALL require passwords that are used as a single-factor authentication mechanism to be a minimum of 15 characters in length."
```

| PWD-LEN-02 | PASS | SHALL | HIGH | PROCEDURAL | password-validator.ts:5 | Minimum length enforced: 8 (password.length < 8); required >= 8 for password_usage=part_of_mfa. |
| PWD-LEN-03 | PASS | SHOULD | LOW | PROCEDURAL | password-validator.ts:5-15 | Password validator located; no maximum-length restriction applied in the supplied files. |
| PWD-LEN-04 | PASS | SHALL | HIGH | SEMANTIC | password-validator.ts:4 | `validatePassword(password: string)` takes and evaluates the whole string; no partial-character prompt exists. |
| PWD-LEN-05 | PASS | SHALL | HIGH | PROCEDURAL | session.ts:7-8 | No slice/substring applied to the password before hashing in the supplied files; `hashPassword` normalizes then hashes the full value with argon2. |
PWD-CHAR
| PWD-CHAR-01 | PASS | SHOULD | LOW | PROCEDURAL | password-validator.ts:5-15 | No anchored allowlist regex or whitespace stripping applied to the password; the character-class tests present (`/[A-Z]/`, `/[0-9]/`, `/[^A-Za-z0-9]/`) are composition checks, not charset restrictions. |
| PWD-CHAR-02 | PASS | SHOULD | LOW | PROCEDURAL | password-validator.ts:5-15 | No ASCII-only allowlist applied to the password in the supplied files (unicode_passwords_accepted = true). |

```
REQ:        PWD-CHAR-03
Status:     FAIL
Level:      SHALL
Severity:   HIGH
Detection:  SEMANTIC
Location:   password-validator.ts:5
Observed:   `password.length < 8` counts UTF-16 code units, not code points. A password containing an astral-plane character (e.g. certain emoji) has its length inflated relative to its code-point count, so code points are not counted as single characters. `[...password].length` would be required.
Provision:  §3.1.1.2 "Each Unicode code point SHALL be counted as a single character when evaluating password length."
```

```
REQ:        PWD-CHAR-04
Status:     PASS
Level:      SHOULD
Severity:   LOW
Detection:  PROCEDURAL
Location:   session.ts:7-8
Observed:   NFC normalization applied before hashing: `argon2.hash(password.normalize("NFC"), ...)`.
Provision:  §3.1.1.2 "If Unicode characters are accepted in passwords, the verifier SHOULD apply the normalization process for stabilized strings using the Normalization Form Canonical Composition (NFC) normalization"
```

```
REQ:        PWD-CHAR-05
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   No client-facing UI code is supplied, so no advisory text to subscribers about cross-endpoint Unicode representation can be established.
Provision:  §3.1.1.2 "Subscribers choosing passwords that contain Unicode characters SHOULD be advised that some endpoints may represent some characters differently"
```

PWD-BLK

```
REQ:        PWD-BLK-01
Status:     FAIL
Level:      SHALL
Severity:   HIGH
Detection:  SEMANTIC
Location:   password-validator.ts:4-15
Observed:   `validatePassword` checks only length and three character-class rules. No blocklist, breach-corpus, or common-password comparison exists anywhere in the supplied files.
Provision:  §3.1.1.2 "When processing a request to establish or change a password, verifiers SHALL compare the prospective secret against a blocklist that contains known commonly used, expected, or compromised passwords."
```

| PWD-BLK-02 | NOT APPLICABLE | SHALL | HIGH | NONE | password-validator.ts:4-15 | No blocklist check is present (blocklist_check_present = false). |
| PWD-BLK-03 | NOT APPLICABLE | SHALL | HIGH | NONE | password-validator.ts:4-15 | No blocklist check is present (blocklist_check_present = false). |
| PWD-BLK-04 | NOT APPLICABLE | SHALL | HIGH | NONE | password-validator.ts:4-15 | No blocklist check is present (blocklist_check_present = false). |
| PWD-BLK-05 | NOT APPLICABLE | SHOULD | LOW | NONE | password-validator.ts:4-15 | No blocklist check is present (blocklist_check_present = false). |

```
REQ:        PWD-BLK-06
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   The only feedback shown is the thrown composition/length messages; no client code is supplied to establish whether creation-time guidance on choosing a strong password exists.
Provision:  §3.1.1.2 "Verifiers SHALL offer guidance to the subscriber to help the subscriber choose a strong password."
```

PWD-COMP

```
REQ:        PWD-COMP-01
Status:     FAIL
Level:      SHALL NOT
Severity:   HIGH
Detection:  PROCEDURAL
Location:   password-validator.ts:8-13
Observed:   Composition rule enforced: password-validator.ts:8 A.test(password) [/[A-Z]/]; password-validator.ts:11 B.test(password) [/[0-9]/]; password-validator.ts:14 C.test(password) [/[^A-Za-z0-9]/]. Each feeds a `throw new ValidationError(...)`.
Provision:  §3.1.1.2 "Verifiers and CSPs SHALL NOT impose other composition rules (e.g., requiring mixtures of different character types) for passwords."
```

| PWD-COMP-02 | PASS | SHALL NOT | HIGH | PROCEDURAL | password-validator.ts, session.ts | No password age, expiry, or rotation-interval logic located in the supplied files. |

```
REQ:        PWD-COMP-03
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   Only a password validator and session helper are supplied; no compromised/must-reset flag or forced-change path exists in these files.
Provision:  §3.1.1.2 "However, verifiers SHALL force a change if there is evidence that the authenticator has been compromised."
```

```
REQ:        PWD-COMP-04
Status:     EVIDENCE REQUIRED
Level:      SHALL NOT
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No user store or registration/reset flow is supplied, so whether a password hint is stored cannot be established.
Provision:  §3.1.1.2 "Verifiers and CSPs SHALL NOT permit the subscriber to store a hint (e.g., a reminder of how the password was created) that is accessible to an unauthenticated claimant."
```

| PWD-COMP-05 | PASS | SHALL NOT | HIGH | SEMANTIC | password-validator.ts:4 | `validatePassword(password: string)` takes only the password; no security-question or KBA collection appears in the supplied files. |
PWD-UX

```
REQ:        PWD-UX-01
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No client-side form code is supplied; autofill/password-manager behavior is a client property.
Provision:  §3.1.1.2 "Verifiers SHALL allow the use of password managers and autofill functionality."
```

```
REQ:        PWD-UX-02
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   No client-side form code is supplied; paste behavior is a client property.
Provision:  §3.1.1.2 "Verifiers SHOULD permit claimants to use the “paste” function when entering a password"
```

```
REQ:        PWD-UX-03
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   No client-side form code is supplied; a show/hide password toggle is a client property.
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
Observed:   No server or TLS listener configuration is supplied in either file.
Provision:  §3.1.1.2 "Verifiers and CSPs SHALL use approved encryption and an authenticated protected channel when requesting passwords."
```

PWD-HASH
| PWD-HASH-01 | PASS | SHALL | HIGH | SEMANTIC | session.ts:7-8 | Passwords are hashed with argon2id via `hashPassword`, not stored or compared in plaintext. |
| PWD-HASH-02 | PASS | SHALL | HIGH | PROCEDURAL | session.ts:7-8 | Password hashing scheme in use: argon2 (`argon2.hash(password.normalize("NFC"), { type: argon2.argon2id, memoryCost: 65536, timeCost: 3 })`). Salt is generated by the scheme. |

```
REQ:        PWD-HASH-03
Status:     PASS
Level:      SHOULD
Severity:   LOW
Detection:  SEMANTIC
Location:   session.ts:8
Observed:   `memoryCost: 65536` (64 MiB), `timeCost: 3` for argon2id — at or above the commonly cited RFC 9106 low-memory recommended parameters, and not a negligible cost factor.
Provision:  §3.1.1.2 "The chosen cost factor SHOULD be as high as practical without negatively impacting verifier performance."
```

```
REQ:        PWD-HASH-04
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   session.ts:7-8
Observed:   The cost parameters are hard-coded literals; no rehash-on-login logic or versioned cost factor is present in the supplied files to show the cost is increased over time.
Provision:  §3.1.1.2 "It SHOULD be increased over time to account for increases in computing performance."
```

```
REQ:        PWD-HASH-05
Status:     FAIL
Level:      SHOULD
Severity:   LOW
Detection:  SEMANTIC
Location:   session.ts:7-8
Observed:   argon2 is not the SP 800-132 scheme (PBKDF2), and no updated NIST guideline qualifying argon2 is supplied. This is a deviation from this NIST recommendation; it is not a finding that argon2 is insecure.
Provision:  §3.1.1.2 "An approved password hashing scheme published in the latest revision of [SP800-132] or updated NIST guidelines on password hashing schemes SHOULD be used."
```

| PWD-HASH-06 | PASS | SHOULD | LOW | SEMANTIC | session.ts:8 | `hashPassword` returns the PHC-format string produced by `argon2.hash` unmodified. |

```
REQ:        PWD-HASH-07
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:7-8
Observed:   Salt length is a library default of the `argon2` package; the library and version are not supplied, so the default cannot be confirmed from the supplied tree or an evidence/ folder.
Provision:  §3.1.1.2 "The salt SHALL be at least 32 bits in length"
```

```
REQ:        PWD-HASH-08
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:7-8
Observed:   Salt generation and uniqueness are handled by the `argon2` library default; the library's own source is not supplied.
Provision:  §3.1.1.2 "and chosen to minimize salt value collisions among stored hashes (i.e., to prevent multiple subscriber accounts from having the same hashed password)."
Governing sentence: "The salt SHALL be at least 32 bits in length and chosen to minimize salt value collisions among stored hashes"
```

| PWD-HASH-09 | PASS | SHALL | HIGH | SEMANTIC | session.ts:7-8 | The PHC-format string returned by `argon2.hash` embeds both the salt and the resulting hash by specification. |
| PWD-HASH-10 | PASS | SHOULD | LOW | SEMANTIC | session.ts:7-8 | The PHC-format output carries the algorithm identifier, version, and cost parameters (`$argon2id$v=...$m=65536,t=3,...`). |

```
REQ:        PWD-HASH-11
Status:     FAIL
Level:      SHOULD
Severity:   LOW
Detection:  SEMANTIC
Location:   session.ts:7-8
Observed:   `hashPassword` returns the argon2 output directly; no additional keyed hashing or encryption iteration using a verifier-only secret is performed.
Provision:  §3.1.1.2 "In addition, verifiers SHOULD perform an additional iteration of a keyed hashing or encryption operation using a secret key known only to the verifier."
```

| PWD-HASH-12 | NOT APPLICABLE | SHALL | HIGH | NONE | session.ts:7-8 | No keyed hashing/encryption step is implemented (keyed_hash_or_encryption_step_present = false). |
| PWD-HASH-13 | NOT APPLICABLE | SHALL | HIGH | NONE | session.ts:7-8 | No keyed hashing/encryption step is implemented (keyed_hash_or_encryption_step_present = false). |
| PWD-HASH-14 | NOT APPLICABLE | SHOULD | LOW | NONE | session.ts:7-8 | No keyed hashing/encryption step is implemented (keyed_hash_or_encryption_step_present = false). |
RATE
| RATE-01 | PASS | SHALL | HIGH | SEMANTIC | session.ts:17-23 | `recordFailedAttempt` counts failures per account (`account.failedAttempts`) and disables the authenticator once a threshold is reached. |
| RATE-02 | PASS | SHALL | HIGH | PROCEDURAL | session.ts:18-19 | Consecutive failed attempts limited at 10 (`account.failedAttempts >= MAX_FAILED_ATTEMPTS`, `MAX_FAILED_ATTEMPTS = 10`); NIST cap is 100. |

```
REQ:        RATE-03
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   verifier63.yaml
Observed:   password_usage=part_of_mfa implies a second authenticator is in play, but that authenticator's implementation and its lockout path are not in the supplied files.
Provision:  §3.2.2 "If more than one authenticator is involved with an excessive number of authentication attempts (e.g., single-factor cryptographic authenticator and centrally verified password), both authenticators SHALL be disabled."
```

```
REQ:        RATE-04
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:20
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
Observed:   No successful-authentication path is supplied, so whether the failure counter is disregarded on success cannot be established.
Provision:  §3.2.2 "When the subscriber successfully authenticates, the verifier SHOULD disregard any previous failed attempts for the authenticators used in the successful authentication."
```

| RATE-06 | NOT APPLICABLE | SHALL | HIGH | NONE | none supplied | No retry-count reset feature is present in the supplied code (retry_count_reset_feature_present = false). |
SESS
| SESS-01 | PASS | SHALL | HIGH | SEMANTIC | session.ts:11-15 | `newSessionId()` generates a session secret that `setSessionCookie` shares with the client via a cookie. |
| SESS-02 | PASS | SHALL | HIGH | SEMANTIC | session.ts:14-15 | The secret is presented directly as a cookie value. |

```
REQ:        SESS-03
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:11-15
Observed:   Session-creation helpers exist, but no login handler or session-lookup path that establishes continuity of an authenticated session is supplied.
Provision:  §5.1 "The continuity of authenticated sessions SHALL be based on the possession of a session secret that is issued by the session host at the time of authentication and optionally refreshed during the session."
```

| SESS-04 | PASS | SHOULD NOT | LOW | SEMANTIC | session.ts:14-15 | The cookie options passed to `res.cookie` carry no `maxAge`/`expires`, so the secret is not configured as persistent across restarts. |
| SESS-05 | PASS | SHALL NOT | HIGH | SEMANTIC | session.ts:1-23 | No "remember my browser" mechanism exists in the supplied files. |

```
REQ:        SESS-06
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:4-5
Observed:   `SESSION_ABSOLUTE_LIFETIME_MS` is defined, but no enforcement code applying it to a live session is supplied.
Provision:  §5.1 "However, RPs and CSPs SHALL ensure that the session lifetime limits described in Sec. 2.2.3 are enforced even when a knowledge of the session secret is demonstrated."
```

```
REQ:        SESS-07
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:11-13
Observed:   `newSessionId()` exists as a helper, but the login call site that would invoke it in direct response to an authentication event is not supplied.
Provision:  §5.1 "The secret used for session binding SHALL be generated by the session host in direct response to an authentication event."
```

```
REQ:        SESS-08
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   Only the validator and session helper files are supplied; no code establishing or reading a session AAL property exists.
Provision:  §5.1 "A session SHOULD inherit the AAL properties of the authentication event that triggered its creation."
```

```
REQ:        SESS-09
Status:     EVIDENCE REQUIRED
Level:      SHALL NOT
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   Same evidence gap as SESS-08: no AAL-tagging logic is supplied.
Provision:  §5.1 "A session MAY be considered at a lower AAL than the authentication event but SHALL NOT be considered at a higher AAL than the authentication event."
```

```
REQ:        SESS-10
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:11-13
Observed:   Same evidence as SESS-07: the call site invoking `newSessionId()` at authentication time is not supplied.
Provision:  §5.1 "Secrets are established during or immediately following authentication."
Governing sentence: "The secrets used for session binding SHALL meet all of the following requirements:"
```

```
REQ:        SESS-11
Status:     PASS
Level:      SHALL
Severity:   HIGH
Detection:  PROCEDURAL
Location:   session.ts:12
Observed:   Session secret generated with a CSPRNG at 256 bits: `randomBytes(32)`.
Provision:  §5.1 "Secrets are established using input from an approved random bit generator, as described in Sec. 3.2.12, and are at least 64 bits in length."
Governing sentence: "The secrets used for session binding SHALL meet all of the following requirements:"
```

```
REQ:        SESS-12
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No logout path is supplied.
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
Observed:   Timeout constants are defined, but the code path that rejects a secret past those limits is not supplied.
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
Observed:   No proxy/CDN configuration is supplied.
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
Observed:   No client-side code is supplied to establish endpoint-side erasure on logout or expiry.
Provision:  §5.1 "the secrets used for session binding SHOULD be erased on the subscriber endpoint when they log out or when the secret is deemed to have expired."
```

```
REQ:        SESS-17
Status:     EVIDENCE REQUIRED
Level:      SHOULD NOT
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   No client-side code is supplied; no `localStorage`/`sessionStorage` writes can be found or ruled out.
Provision:  §5.1 "They SHOULD NOT be placed in insecure locations (e.g., HTML5 Local Storage) due to the potential exposure of local storage to cross-site scripting (XSS) attacks."
```

```
REQ:        SESS-18
Status:     EVIDENCE REQUIRED
Level:      SHALL NOT
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No TLS/HSTS or route configuration is supplied.
Provision:  §5.1 "Following authentication, authenticated sessions SHALL NOT fall back to an insecure transport (e.g., from https to http)."
```

```
REQ:        SESS-19
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No request handlers (POST/PUT routes) are supplied.
Provision:  §5.1 "POST/PUT content SHALL contain a session identifier"
```

```
REQ:        SESS-20
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   Same evidence gap as SESS-19: no request handlers are supplied to show a CSRF identifier is verified.
Provision:  §5.1 "that the RP SHALL verify to protect against cross-site request forgery (CSRF)."
```

```
REQ:        SESS-21
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   No logout route is supplied in the supplied files.
Provision:  §5.1 "Sessions SHOULD provide a readily accessible mechanism for subscribers to terminate (i.e., log off) their session when their interaction is complete."
```

COOK
| COOK-01 | PASS | SHALL | HIGH | PROCEDURAL | session.ts:14-15 | `secure: true` on the `__Host-session` cookie. |
| COOK-02 | PASS | SHALL | HIGH | SEMANTIC | session.ts:14-15 | `path: "/"` with no `domain` attribute set, so the cookie is scoped to the issuing host only. |
| COOK-03 | PASS | SHOULD | LOW | PROCEDURAL | session.ts:14-15 | `httpOnly: true`. |
| COOK-04 | PASS | SHOULD | LOW | PROCEDURAL | session.ts:14-15 | No `maxAge`/`expires` set: a session cookie, discarded when the browser session ends. |

```
REQ:        COOK-05
Status:     EVIDENCE REQUIRED
Level:      SHALL NOT
Severity:   HIGH
Detection:  NONE
Location:   session.ts:4-5
Observed:   Server-side lifetime constants exist (`SESSION_ABSOLUTE_LIFETIME_MS`), but no code showing the timeout is enforced independently of cookie expiry is supplied.
Provision:  §5.1.1 "This requirement is intended to limit the accumulation of cookies but SHALL NOT be relied upon to enforce session timeouts."
```

| COOK-06 | PASS | SHOULD | LOW | PROCEDURAL | session.ts:14 | Cookie name `__Host-session`; path `"/"`. Satisfies the `__Host-` prefix and `Path=/` requirement. |
| COOK-07 | PASS | SHOULD | LOW | PROCEDURAL | session.ts:14-15 | `sameSite: "strict"`. |
| COOK-08 | PASS | SHOULD | LOW | SEMANTIC | session.ts:11-13 | Cookie value is `randomBytes(32).toString("hex")`, an opaque random string. |
| COOK-09 | PASS | SHALL NOT | HIGH | SEMANTIC | session.ts:11-15 | The cookie value carries no personal information — only a random session identifier. |
REAUTH

```
REQ:        REAUTH-01
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:4-5
Observed:   Timeout constants exist, but the reauthentication-enforcement path that acts on them is not supplied.
Provision:  §5.2 "The periodic reauthentication of sessions SHALL be performed to confirm the subscriber’s continued presence at an authenticated session"
```

| REAUTH-02 | PASS | SHALL | HIGH | PROCEDURAL | session.ts:4 | Absolute session lifetime configured: 43200000 ms (12.0 h) at `SESSION_ABSOLUTE_LIFETIME_MS = 12 * 60 * 60 * 1000`. |
| REAUTH-03 | NOT APPLICABLE | SHOULD | LOW | PROCEDURAL | verifier63.yaml | Declared aal=2; this limit is for AAL1. |
| REAUTH-04 | PASS | SHOULD | LOW | PROCEDURAL | session.ts:4 | Overall timeout 12 h vs AAL2 limit 24 h (`SESSION_ABSOLUTE_LIFETIME_MS = 12 * 60 * 60 * 1000`). |
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
Observed:   Timeout constants exist; the termination logic that acts on expiry is not supplied.
Provision:  §5.2 "When either timeout expires, the session SHALL be terminated."
```

```
REQ:        REAUTH-09
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:5
Observed:   An inactivity timeout is configured (`SESSION_IDLE_TIMEOUT_MS`), but the reset-on-activity code is not supplied.
Provision:  §5.2 "Session activity SHALL reset the inactivity timeout"
```

```
REQ:        REAUTH-10
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No re-login path is supplied to show both timeouts are reset on reauthentication.
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
No control in `requirements.json` covers it, but for context: `password-validator.ts` throws plain `ValidationError` messages describing which rule was violated (length vs. each character class), which is itself the composition-rule feedback found in violation of PWD-COMP-01.
