# Unedited reply, cold run 03 (claude.ai Project rebuilt from scratch, 2026-09-11)

Pasted exactly as returned. Formatting is the chat's rendering of the rules.md §6 layout.

---

Verifier63 audit - uploaded artifact (checks.ts, password-validator.ts, session.ts)
Standard: NIST SP 800-63B-4 (final, 2025-07-31) — reference/PROVENANCE.md
Declared: aal=2 password_usage=part_of_mfa language=typescript
Files audited: checks.ts, password-validator.ts, session.ts
Procedural checks: applied per procedures/deterministic-checks.md
Findings
PWD-LEN
| PWD-LEN-01 | NOT APPLICABLE | SHALL | HIGH | PROCEDURAL | verifier63.yaml | password_usage=part_of_mfa; this minimum applies to the other usage mode. |
| PWD-LEN-02 | PASS | SHALL | HIGH | PROCEDURAL | password-validator.ts:9 | Minimum length enforced: 8 (candidate.length < 8); required >= 8 for password_usage=part_of_mfa. |
| PWD-LEN-03 | PASS | SHOULD | LOW | PROCEDURAL | password-validator.ts:9 | Password validator located; no maximum-length restriction applied in the supplied files. |
| PWD-LEN-04 | PASS | SHALL | HIGH | SEMANTIC | password-validator.ts:16 | `evaluatePassword(password)` receives and evaluates the whole string. |
| PWD-LEN-05 | PASS | SHALL | HIGH | PROCEDURAL | see hashing call | No slice/substring applied to the password before hashing or comparison in the supplied files. |
PWD-CHAR
| PWD-CHAR-01 | PASS | SHOULD | LOW | PROCEDURAL | see validator | No allowlist regex or whitespace stripping applied to the password in the supplied files. |
| PWD-CHAR-02 | PASS | SHOULD | LOW | PROCEDURAL | see validator | No ASCII-only allowlist applied to the password in the supplied files. |

```
REQ:        PWD-CHAR-03
Status:     FAIL
Level:      SHALL
Severity:   HIGH
Detection:  SEMANTIC
Location:   password-validator.ts:9
Observed:   `candidate.length < 8` counts UTF-16 code units, not code points; an astral character counts as two.
Provision:  §3.1.1.2 "Each Unicode code point SHALL be counted as a single character when evaluating password length."

```

| PWD-CHAR-04 | PASS | SHOULD | LOW | PROCEDURAL | session.ts:9 | NFC normalization applied: password.normalize("NFC"). |

```
REQ:        PWD-CHAR-05
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   No client code supplied.
Provision:  §3.1.1.2 "Subscribers choosing passwords that contain Unicode characters SHOULD be advised that some endpoints may represent some characters differently"

```

PWD-BLK

```
REQ:        PWD-BLK-01
Status:     FAIL
Level:      SHALL
Severity:   HIGH
Detection:  SEMANTIC
Location:   password-validator.ts:7-12
Observed:   `collectProblems` checks length and two character classes only; no blocklist comparison exists on the registration path (`registerUser`).
Provision:  §3.1.1.2 "When processing a request to establish or change a password, verifiers SHALL compare the prospective secret against a blocklist that contains known commonly used, expected, or compromised passwords."

```

| PWD-BLK-02 | NOT APPLICABLE | SHALL | HIGH | NONE | password-validator.ts:7-12 | No blocklist check present. |
| PWD-BLK-03 | NOT APPLICABLE | SHALL | HIGH | NONE | password-validator.ts:7-12 | No blocklist check present. |
| PWD-BLK-04 | NOT APPLICABLE | SHALL | HIGH | NONE | password-validator.ts:7-12 | No blocklist check present. |
| PWD-BLK-05 | NOT APPLICABLE | SHOULD | LOW | NONE | password-validator.ts:7-12 | No blocklist check present. |

```
REQ:        PWD-BLK-06
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No client code supplied.
Provision:  §3.1.1.2 "Verifiers SHALL offer guidance to the subscriber to help the subscriber choose a strong password."

```

PWD-COMP

```
REQ:        PWD-COMP-01
Status:     FAIL
Level:      SHALL NOT
Severity:   HIGH
Detection:  PROCEDURAL
Location:   checks.ts:5
Observed:   Composition rule enforced: checks.ts:5 A.test(value) [/[A-Z]/]; checks.ts:9 B.test(value) [/\d/]
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
Observed:   Only the password validator and one session helper file are supplied; this behaviour is not in the supplied code.
Provision:  §3.1.1.2 "However, verifiers SHALL force a change if there is evidence that the authenticator has been compromised."

```


```
REQ:        PWD-COMP-04
Status:     EVIDENCE REQUIRED
Level:      SHALL NOT
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No user store supplied; cannot establish whether hints are stored.
Provision:  §3.1.1.2 "Verifiers and CSPs SHALL NOT permit the subscriber to store a hint (e.g., a reminder of how the password was created) that is accessible to an unauthenticated claimant."

```

| PWD-COMP-05 | PASS | SHALL NOT | HIGH | SEMANTIC | password-validator.ts:22-28 | `registerUser` takes only the password and a save callback; no security questions are collected. |
PWD-UX

```
REQ:        PWD-UX-01
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No client code supplied.
Provision:  §3.1.1.2 "Verifiers SHALL allow the use of password managers and autofill functionality."

```


```
REQ:        PWD-UX-02
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   No client code supplied.
Provision:  §3.1.1.2 "Verifiers SHOULD permit claimants to use the “paste” function when entering a password"

```


```
REQ:        PWD-UX-03
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   No client code supplied.
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
Observed:   No server/TLS configuration supplied.
Provision:  §3.1.1.2 "Verifiers and CSPs SHALL use approved encryption and an authenticated protected channel when requesting passwords."

```

PWD-HASH
| PWD-HASH-01 | PASS | SHALL | HIGH | SEMANTIC | session.ts:9-11 | argon2id with memoryCost 65536, timeCost 3. |
| PWD-HASH-02 | PASS | SHALL | HIGH | PROCEDURAL | session.ts:9 | Password hashing scheme in use: argon2 (argon2.hash(password.normalize("NFC"), { type: argon2.argon2id, memoryCost: 65536, timeCost: 3 })). Salt is generated by the scheme. |
| PWD-HASH-03 | PASS | SHOULD | LOW | SEMANTIC | session.ts:10 | memoryCost 65536 KiB, timeCost 3: at or above the argon2 RFC 9106 recommended parameters. |

```
REQ:        PWD-HASH-04
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   session.ts:10
Observed:   Parameters are literals; no rehash-on-login or version tag is in the supplied code.
Provision:  §3.1.1.2 "It SHOULD be increased over time to account for increases in computing performance."

```


```
REQ:        PWD-HASH-05
Status:     FAIL
Level:      SHOULD
Severity:   LOW
Detection:  SEMANTIC
Location:   session.ts:10
Observed:   argon2 is not the SP 800-132 scheme (PBKDF2); no qualifying guideline supplied. Deviation from this NIST recommendation; not a finding that argon2 is insecure.
Provision:  §3.1.1.2 "An approved password hashing scheme published in the latest revision of [SP800-132] or updated NIST guidelines on password hashing schemes SHOULD be used."

```

| PWD-HASH-06 | PASS | SHOULD | LOW | SEMANTIC | session.ts:10 | The PHC-format string returned by `argon2.hash` is returned unmodified. |

```
REQ:        PWD-HASH-07
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:10
Observed:   Salt length is an argon2 library default (16 bytes); the library is not supplied and no evidence/ folder is present.
Provision:  §3.1.1.2 "The salt SHALL be at least 32 bits in length"

```


```
REQ:        PWD-HASH-08
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:10
Observed:   Salt generation is a library default; not supplied.
Provision:  §3.1.1.2 "and chosen to minimize salt value collisions among stored hashes (i.e., to prevent multiple subscriber accounts from having the same hashed password)."
Governing sentence: "The salt SHALL be at least 32 bits in length and chosen to minimize salt value collisions among stored hashes"

```

| PWD-HASH-09 | PASS | SHALL | HIGH | SEMANTIC | session.ts:10 | PHC-format output embeds salt and hash by specification. |
| PWD-HASH-10 | PASS | SHOULD | LOW | SEMANTIC | session.ts:10 | PHC-format output embeds algorithm, version and parameters by specification. |

```
REQ:        PWD-HASH-11
Status:     FAIL
Level:      SHOULD
Severity:   LOW
Detection:  SEMANTIC
Location:   session.ts:9-11
Observed:   No keyed hashing / pepper step after argon2.
Provision:  §3.1.1.2 "In addition, verifiers SHOULD perform an additional iteration of a keyed hashing or encryption operation using a secret key known only to the verifier."

```

| PWD-HASH-12 | NOT APPLICABLE | SHALL | HIGH | NONE | session.ts:9-11 | No keyed step implemented. |
| PWD-HASH-13 | NOT APPLICABLE | SHALL | HIGH | NONE | session.ts:9-11 | No keyed step implemented. |
| PWD-HASH-14 | NOT APPLICABLE | SHOULD | LOW | NONE | session.ts:9-11 | No keyed step implemented. |
RATE
| RATE-01 | PASS | SHALL | HIGH | SEMANTIC | session.ts:21-27 | `recordFailedAttempt` counts failures per account and disables the password at 10. |
| RATE-02 | PASS | SHALL | HIGH | PROCEDURAL | session.ts:22 | Consecutive failed attempts limited at 10 (account.failedAttempts >= MAX_FAILED_ATTEMPTS); NIST cap is 100. |

```
REQ:        RATE-03
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   password_usage=part_of_mfa is declared but the second authenticator and its lockout path are not in the supplied code.
Provision:  §3.2.2 "If more than one authenticator is involved with an excessive number of authentication attempts (e.g., single-factor cryptographic authenticator and centrally verified password), both authenticators SHALL be disabled."

```


```
REQ:        RATE-04
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:24
Observed:   `account.disabled = true` is set; the rebinding path that re-enables it is not supplied.
Provision:  §3.2.2 "Authenticators that have been disabled SHALL be required to rebind to the subscriber account, as described in Sec. 4.1, to be usable in the future."

```


```
REQ:        RATE-05
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   No success path is supplied; cannot establish whether the counter is reset.
Provision:  §3.2.2 "When the subscriber successfully authenticates, the verifier SHOULD disregard any previous failed attempts for the authenticators used in the successful authentication."

```

| RATE-06 | NOT APPLICABLE | SHALL | HIGH | NONE | none supplied | No retry-count reset feature is present in the supplied code. |
SESS
| SESS-01 | PASS | SHALL | HIGH | SEMANTIC | session.ts:13-19 | A session id is generated and set as a cookie. |
| SESS-02 | PASS | SHALL | HIGH | SEMANTIC | session.ts:17-19 | Presented directly as a cookie. |

```
REQ:        SESS-03
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:13-19
Observed:   Session creation helper exists; the resolve/lookup path that establishes continuity is not supplied.
Provision:  §5.1 "The continuity of authenticated sessions SHALL be based on the possession of a session secret that is issued by the session host at the time of authentication and optionally refreshed during the session."

```

| SESS-04 | PASS | SHOULD NOT | LOW | SEMANTIC | session.ts:18 | Session cookie has no maxAge/expires: not persistent across browser restart. |
| SESS-05 | PASS | SHALL NOT | HIGH | SEMANTIC | session.ts:13-19 | No remember-me mechanism in the supplied code. |

```
REQ:        SESS-06
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:4-5
Observed:   Lifetime constants are defined; the enforcement path is not supplied.
Provision:  §5.1 "However, RPs and CSPs SHALL ensure that the session lifetime limits described in Sec. 2.2.3 are enforced even when a knowledge of the session secret is demonstrated."

```


```
REQ:        SESS-07
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:13-15
Observed:   `newSessionId` exists; the login call site that invokes it is not supplied.
Provision:  §5.1 "The secret used for session binding SHALL be generated by the session host in direct response to an authentication event."

```


```
REQ:        SESS-08
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   Only the password validator and one session helper file are supplied; this behaviour is not in the supplied code.
Provision:  §5.1 "A session SHOULD inherit the AAL properties of the authentication event that triggered its creation."

```


```
REQ:        SESS-09
Status:     EVIDENCE REQUIRED
Level:      SHALL NOT
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   Only the password validator and one session helper file are supplied; this behaviour is not in the supplied code.
Provision:  §5.1 "A session MAY be considered at a lower AAL than the authentication event but SHALL NOT be considered at a higher AAL than the authentication event."

```


```
REQ:        SESS-10
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:13-15
Observed:   Same as SESS-07.
Provision:  §5.1 "Secrets are established during or immediately following authentication."
Governing sentence: "The secrets used for session binding SHALL meet all of the following requirements:"

```

| SESS-11 | PASS | SHALL | HIGH | PROCEDURAL | session.ts:13 | Session secret generated with a CSPRNG at 256 bits: randomBytes(32). |

```
REQ:        SESS-12
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No logout path supplied.
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
Observed:   No TLS configuration supplied.
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
Observed:   Constants defined; expiry enforcement not supplied.
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
Observed:   No proxy configuration supplied.
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
Observed:   No client code supplied.
Provision:  §5.1 "They SHOULD NOT be placed in insecure locations (e.g., HTML5 Local Storage) due to the potential exposure of local storage to cross-site scripting (XSS) attacks."

```


```
REQ:        SESS-18
Status:     EVIDENCE REQUIRED
Level:      SHALL NOT
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No TLS/HSTS configuration supplied.
Provision:  §5.1 "Following authentication, authenticated sessions SHALL NOT fall back to an insecure transport (e.g., from https to http)."

```


```
REQ:        SESS-19
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No request handlers supplied.
Provision:  §5.1 "POST/PUT content SHALL contain a session identifier"

```


```
REQ:        SESS-20
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No request handlers supplied.
Provision:  §5.1 "that the RP SHALL verify to protect against cross-site request forgery (CSRF)."

```


```
REQ:        SESS-21
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   No logout route supplied.
Provision:  §5.1 "Sessions SHOULD provide a readily accessible mechanism for subscribers to terminate (i.e., log off) their session when their interaction is complete."

```

COOK
| COOK-01 | PASS | SHALL | HIGH | PROCEDURAL | session.ts:17 | secure: true. |
| COOK-02 | PASS | SHALL | HIGH | SEMANTIC | session.ts:18 | Path is `/` and no Domain attribute is set, so the cookie is scoped to the issuing host only. |
| COOK-03 | PASS | SHOULD | LOW | PROCEDURAL | session.ts:17 | httpOnly: true. |
| COOK-04 | PASS | SHOULD | LOW | PROCEDURAL | session.ts:17 | No maxAge/expires: session cookie, discarded when the browser session ends. |

```
REQ:        COOK-05
Status:     EVIDENCE REQUIRED
Level:      SHALL NOT
Severity:   HIGH
Detection:  NONE
Location:   session.ts:4-5
Observed:   Server-side expiry constants exist; enforcement not supplied.
Provision:  §5.1.1 "This requirement is intended to limit the accumulation of cookies but SHALL NOT be relied upon to enforce session timeouts."

```

| COOK-06 | PASS | SHOULD | LOW | PROCEDURAL | session.ts:17 | Cookie name: __Host-session; path: "/". Requires the __Host- prefix and Path=/. |
| COOK-07 | PASS | SHOULD | LOW | PROCEDURAL | session.ts:17 | sameSite: strict. |
| COOK-08 | PASS | SHOULD | LOW | SEMANTIC | session.ts:14 | Cookie value is a 32-byte random hex string; opaque. |
| COOK-09 | PASS | SHALL NOT | HIGH | SEMANTIC | session.ts:14 | Cookie value carries no personal information. |
REAUTH

```
REQ:        REAUTH-01
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:4-5
Observed:   Timeout constants exist; the reauthentication enforcement path is not supplied.
Provision:  §5.2 "The periodic reauthentication of sessions SHALL be performed to confirm the subscriber’s continued presence at an authenticated session"

```

| REAUTH-02 | PASS | SHALL | HIGH | PROCEDURAL | session.ts:4 | Absolute session lifetime configured: 43200000 ms (12.0 h) at SESSION_ABSOLUTE_LIFETIME_MS = 12 * 60 * 60 * 1000. |
| REAUTH-03 | NOT APPLICABLE | SHOULD | LOW | PROCEDURAL | verifier63.yaml | Declared aal=2; this limit is for AAL1. |
| REAUTH-04 | PASS | SHOULD | LOW | PROCEDURAL | session.ts:4 | Overall timeout 720 min vs AAL2 limit 1440 min (SESSION_ABSOLUTE_LIFETIME_MS = 12 * 60 * 60 * 1000). |
| REAUTH-05 | PASS | SHOULD | LOW | PROCEDURAL | session.ts:5 | Inactivity timeout 30 min vs AAL2 limit 60 min (SESSION_IDLE_TIMEOUT_MS = 30 * 60 * 1000). |
| REAUTH-06 | NOT APPLICABLE | SHALL | HIGH | PROCEDURAL | verifier63.yaml | Declared aal=2; this limit is for AAL3. |
| REAUTH-07 | NOT APPLICABLE | SHOULD | LOW | PROCEDURAL | verifier63.yaml | Declared aal=2; this limit is for AAL3. |

```
REQ:        REAUTH-08
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:4-5
Observed:   Enforcement path not supplied.
Provision:  §5.2 "When either timeout expires, the session SHALL be terminated."

```


```
REQ:        REAUTH-09
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   session.ts:5
Observed:   Inactivity constant exists; the reset-on-activity code is not supplied.
Provision:  §5.2 "Session activity SHALL reset the inactivity timeout"

```


```
REQ:        REAUTH-10
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No re-login path supplied.
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
