# Verifier63 audit - fixtures/missing-evidence
Standard: NIST SP 800-63B-4 (final, 2025-07-31) - reference/PROVENANCE.md
Declared: aal=not declared  password_usage=not declared  language=not declared  (verifier63.yaml missing)
Files audited: src/auth.ts, src/identity-client.ts
Procedural checks: applied per procedures/deterministic-checks.md

## Findings

### PWD-LEN

```
REQ:        PWD-LEN-01
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  PROCEDURAL
Location:   src/auth.ts:14
Observed:   password_usage not declared in verifier63.yaml; cannot determine whether the 15-character (single factor) or 8-character (part of MFA) minimum applies. Enforced minimum observed: 15.
Provision:  §3.1.1.2 "Verifiers and CSPs SHALL require passwords that are used as a single-factor authentication mechanism to be a minimum of 15 characters in length."
```
```
REQ:        PWD-LEN-02
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  PROCEDURAL
Location:   src/auth.ts:14
Observed:   password_usage not declared in verifier63.yaml; cannot determine whether the 15-character (single factor) or 8-character (part of MFA) minimum applies. Enforced minimum observed: 15.
Provision:  §3.1.1.2 "Verifiers and CSPs MAY allow passwords that are only used as part of multi-factor authentication processes to be shorter but SHALL require them to be a minimum of eight characters in length."
```
| PWD-LEN-03 | PASS | SHOULD | LOW | PROCEDURAL | src/auth.ts:14 | Password validator located; no maximum-length restriction applied in the supplied files. |
| PWD-LEN-04 | PASS | SHALL | HIGH | SEMANTIC | src/auth.ts:13-15 | Whole password is validated. |
```
REQ:        PWD-LEN-05
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:17-20
Observed:   Hashing is delegated to `identityService.setCredential` (`identity-client.ts`); the implementation is not supplied.
Provision:  §3.1.1.2 "SHALL verify the entire submitted password (e.g., not truncate it)."
```

### PWD-CHAR

| PWD-CHAR-01 | PASS | SHOULD | LOW | PROCEDURAL | see validator | No allowlist regex or whitespace stripping applied to the password in the supplied files. |
| PWD-CHAR-02 | PASS | SHOULD | LOW | PROCEDURAL | see validator | No ASCII-only allowlist applied to the password in the supplied files. |
```
REQ:        PWD-CHAR-03
Status:     FAIL
Level:      SHALL
Severity:   HIGH
Detection:  SEMANTIC
Location:   src/auth.ts:14
Observed:   `password.length < 15` counts UTF-16 code units.
Provision:  §3.1.1.2 "Each Unicode code point SHALL be counted as a single character when evaluating password length."
```
```
REQ:        PWD-CHAR-04
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   src/auth.ts:17-20
Observed:   Hashing is delegated to `identityService.setCredential` (`identity-client.ts`); the implementation is not supplied.
Provision:  §3.1.1.2 "If Unicode characters are accepted in passwords, the verifier SHOULD apply the normalization process for stabilized strings using the Normalization Form Canonical Composition (NFC) normalization"
```
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

### PWD-BLK

```
REQ:        PWD-BLK-01
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:17-20
Observed:   Delegated to `identityService` (`identity-client.ts`), whose implementation is not supplied. A blocklist may be applied there.
Provision:  §3.1.1.2 "When processing a request to establish or change a password, verifiers SHALL compare the prospective secret against a blocklist that contains known commonly used, expected, or compromised passwords."
```
```
REQ:        PWD-BLK-02
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:17-20
Observed:   Whether a blocklist check exists is itself unknown (see PWD-BLK-01); condition cannot be evaluated.
Provision:  §3.1.1.2 "The entire password SHALL be subject to comparison, not substrings or words that might be contained therein."
```
```
REQ:        PWD-BLK-03
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:17-20
Observed:   Whether a blocklist check exists is itself unknown (see PWD-BLK-01); condition cannot be evaluated.
Provision:  §3.1.1.2 "If the chosen password is found on the blocklist, the CSP SHALL require the subscriber to select a different secret"
```
```
REQ:        PWD-BLK-04
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:17-20
Observed:   Whether a blocklist check exists is itself unknown (see PWD-BLK-01); condition cannot be evaluated.
Provision:  §3.1.1.2 "and SHALL provide the reason for rejection."
```
```
REQ:        PWD-BLK-05
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   src/auth.ts:17-20
Observed:   Whether a blocklist check exists is itself unknown (see PWD-BLK-01); condition cannot be evaluated.
Provision:  §3.1.1.2 "the blocklist SHOULD be of sufficient size to prevent subscribers from choosing passwords that attackers are likely to guess before reaching the attempt limit."
```
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

### PWD-COMP

| PWD-COMP-01 | PASS | SHALL NOT | HIGH | PROCEDURAL | see password validator | No character-class regex exists anywhere in the supplied files. |
| PWD-COMP-02 | PASS | SHALL NOT | HIGH | PROCEDURAL | all supplied files | No password age, expiry, or rotation-interval logic located in the supplied files. |
```
REQ:        PWD-COMP-03
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:17-20
Observed:   Delegated to `identityService` (`identity-client.ts`), whose implementation is not supplied.
Provision:  §3.1.1.2 "However, verifiers SHALL force a change if there is evidence that the authenticator has been compromised."
```
```
REQ:        PWD-COMP-04
Status:     EVIDENCE REQUIRED
Level:      SHALL NOT
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:17-20
Observed:   Delegated to `identityService` (`identity-client.ts`), whose implementation is not supplied.
Provision:  §3.1.1.2 "Verifiers and CSPs SHALL NOT permit the subscriber to store a hint (e.g., a reminder of how the password was created) that is accessible to an unauthenticated claimant."
```
| PWD-COMP-05 | PASS | SHALL NOT | HIGH | SEMANTIC | src/auth.ts:13-15 | Only the password is collected; no security questions. |

### PWD-UX

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

### PWD-CHAN

```
REQ:        PWD-CHAN-01
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   No TLS configuration supplied.
Provision:  §3.1.1.2 "Verifiers and CSPs SHALL use approved encryption and an authenticated protected channel when requesting passwords."
```

### PWD-HASH

```
REQ:        PWD-HASH-01
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:17-20
Observed:   Delegated to `identityService` (`identity-client.ts`), whose implementation is not supplied.
Provision:  §3.1.1.2 "Verifiers SHALL store passwords in a form that is resistant to offline attacks."
```
```
REQ:        PWD-HASH-02
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:17-20
Observed:   Hashing is delegated to `identityService.setCredential` (`identity-client.ts`); the implementation is not supplied.
Provision:  §3.1.1.2 "Passwords SHALL be salted and hashed using a suitable password hashing scheme."
```
```
REQ:        PWD-HASH-03
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   src/auth.ts:17-20
Observed:   Delegated to `identityService` (`identity-client.ts`), whose implementation is not supplied.
Provision:  §3.1.1.2 "The chosen cost factor SHOULD be as high as practical without negatively impacting verifier performance."
```
```
REQ:        PWD-HASH-04
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   src/auth.ts:17-20
Observed:   Delegated to `identityService` (`identity-client.ts`), whose implementation is not supplied.
Provision:  §3.1.1.2 "It SHOULD be increased over time to account for increases in computing performance."
```
```
REQ:        PWD-HASH-05
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   src/auth.ts:17-20
Observed:   Delegated to `identityService` (`identity-client.ts`), whose implementation is not supplied.
Provision:  §3.1.1.2 "An approved password hashing scheme published in the latest revision of [SP800-132] or updated NIST guidelines on password hashing schemes SHOULD be used."
```
```
REQ:        PWD-HASH-06
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   src/auth.ts:17-20
Observed:   Delegated to `identityService` (`identity-client.ts`), whose implementation is not supplied.
Provision:  §3.1.1.2 "The chosen output length of the password verifier, excluding the salt and versioning information, SHOULD be the same as the length of the underlying password hashing scheme output."
```
```
REQ:        PWD-HASH-07
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:17-20
Observed:   Delegated to `identityService` (`identity-client.ts`), whose implementation is not supplied.
Provision:  §3.1.1.2 "The salt SHALL be at least 32 bits in length"
```
```
REQ:        PWD-HASH-08
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:17-20
Observed:   Delegated to `identityService` (`identity-client.ts`), whose implementation is not supplied.
Provision:  §3.1.1.2 "and chosen to minimize salt value collisions among stored hashes (i.e., to prevent multiple subscriber accounts from having the same hashed password)."
Governing sentence: "The salt SHALL be at least 32 bits in length and chosen to minimize salt value collisions among stored hashes"
```
```
REQ:        PWD-HASH-09
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:17-20
Observed:   Delegated to `identityService` (`identity-client.ts`), whose implementation is not supplied.
Provision:  §3.1.1.2 "Both the salt value and the resulting hash SHALL be stored for each password."
```
```
REQ:        PWD-HASH-10
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   src/auth.ts:17-20
Observed:   Delegated to `identityService` (`identity-client.ts`), whose implementation is not supplied.
Provision:  §3.1.1.2 "A reference to the password hashing scheme used, including the cost factor, SHOULD be stored for each password to allow migration to new algorithms and work factors."
```
```
REQ:        PWD-HASH-11
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   src/auth.ts:17-20
Observed:   Delegated to `identityService` (`identity-client.ts`), whose implementation is not supplied.
Provision:  §3.1.1.2 "In addition, verifiers SHOULD perform an additional iteration of a keyed hashing or encryption operation using a secret key known only to the verifier."
```
```
REQ:        PWD-HASH-12
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:17-20
Observed:   Whether a keyed step exists is unknown (hashing is external); condition cannot be evaluated.
Provision:  §3.1.1.2 "If used, this key value SHALL be generated by an approved random bit generator, as described in Sec. 3.2.12."
```
```
REQ:        PWD-HASH-13
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:17-20
Observed:   Whether a keyed step exists is unknown (hashing is external); condition cannot be evaluated.
Provision:  §3.1.1.2 "The secret key value SHALL be stored separately from the hashed passwords."
```
```
REQ:        PWD-HASH-14
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   src/auth.ts:17-20
Observed:   Whether a keyed step exists is unknown (hashing is external); condition cannot be evaluated.
Provision:  §3.1.1.2 "It SHOULD be stored and used within a hardware-protected area, such as a hardware security module or trusted execution environment (TEE)"
```

### RATE

```
REQ:        RATE-01
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:22-24
Observed:   `loginFailed` calls `identityService.recordFailure`; the lockout policy is not supplied.
Provision:  §3.1.1.2 "Verifiers SHALL implement a rate-limiting mechanism that effectively limits the number of failed authentication attempts that can be made on the subscriber account, as described in Sec. 3.2.2."
```
```
REQ:        RATE-02
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:22-24
Observed:   `identityService.recordFailure` holds the lockout policy; threshold not supplied.
Provision:  §3.2.2 "the verifier SHALL limit consecutive failed authentication attempts using a specific authenticator on a single subscriber account to no more than 100 by disabling that authenticator."
```
```
REQ:        RATE-03
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   verifier63.yaml
Observed:   password_usage not declared; cannot evaluate whether a second authenticator is in use.
Provision:  §3.2.2 "If more than one authenticator is involved with an excessive number of authentication attempts (e.g., single-factor cryptographic authenticator and centrally verified password), both authenticators SHALL be disabled."
```
```
REQ:        RATE-04
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:22-24
Observed:   `loginFailed` calls `identityService.recordFailure`; the lockout policy is not supplied.
Provision:  §3.2.2 "Authenticators that have been disabled SHALL be required to rebind to the subscriber account, as described in Sec. 4.1, to be usable in the future."
```
```
REQ:        RATE-05
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   src/auth.ts:22-24
Observed:   `loginFailed` calls `identityService.recordFailure`; the lockout policy is not supplied.
Provision:  §3.2.2 "When the subscriber successfully authenticates, the verifier SHOULD disregard any previous failed attempts for the authenticators used in the successful authentication."
```
```
REQ:        RATE-06
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:22-24
Observed:   Reset behaviour lives in the external service; condition cannot be evaluated.
Provision:  §3.2.2 "If this is provided, the maximum AAL of the authenticator being reset SHALL not exceed the AAL of the session from which it is being reset."
```

### SESS

| SESS-01 | PASS | SHALL | HIGH | SEMANTIC | src/auth.ts:5-11 | express-session issues a cookie-borne session id. |
| SESS-02 | PASS | SHALL | HIGH | SEMANTIC | src/auth.ts:5-11 | express-session issues a cookie-borne session id. |
```
REQ:        SESS-03
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:5-11
Observed:   express-session is configured but no login, logout or request handlers are supplied.
Provision:  §5.1 "The continuity of authenticated sessions SHALL be based on the possession of a session secret that is issued by the session host at the time of authentication and optionally refreshed during the session."
```
| SESS-04 | PASS | SHOULD NOT | LOW | SEMANTIC | src/auth.ts:10 | Cookie has no maxAge: not persistent across restart. |
| SESS-05 | PASS | SHALL NOT | HIGH | SEMANTIC | src/auth.ts:5-11 | No remember-me mechanism in the supplied code. |
```
REQ:        SESS-06
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:5-11
Observed:   Not establishable from a session middleware configuration alone.
Provision:  §5.1 "However, RPs and CSPs SHALL ensure that the session lifetime limits described in Sec. 2.2.3 are enforced even when a knowledge of the session secret is demonstrated."
```
```
REQ:        SESS-07
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:5-11
Observed:   express-session is configured but no login, logout or request handlers are supplied.
Provision:  §5.1 "The secret used for session binding SHALL be generated by the session host in direct response to an authentication event."
```
```
REQ:        SESS-08
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   src/auth.ts:5-11
Observed:   Not establishable from a session middleware configuration alone.
Provision:  §5.1 "A session SHOULD inherit the AAL properties of the authentication event that triggered its creation."
```
```
REQ:        SESS-09
Status:     EVIDENCE REQUIRED
Level:      SHALL NOT
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:5-11
Observed:   Not establishable from a session middleware configuration alone.
Provision:  §5.1 "A session MAY be considered at a lower AAL than the authentication event but SHALL NOT be considered at a higher AAL than the authentication event."
```
```
REQ:        SESS-10
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:5-11
Observed:   express-session is configured but no login, logout or request handlers are supplied.
Provision:  §5.1 "Secrets are established during or immediately following authentication."
Governing sentence: "The secrets used for session binding SHALL meet all of the following requirements:"
```
```
REQ:        SESS-11
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:5-11
Observed:   express-session default `genid` (uid-safe, 24 bytes) is a library fact; the library and version are not supplied.
Provision:  §5.1 "Secrets are established using input from an approved random bit generator, as described in Sec. 3.2.12, and are at least 64 bits in length."
Governing sentence: "The secrets used for session binding SHALL meet all of the following requirements:"
```
```
REQ:        SESS-12
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:5-11
Observed:   express-session is configured but no login, logout or request handlers are supplied.
Provision:  §5.1 "Secrets are erased or invalidated by the session subject when the subscriber logs out."
Governing sentence: "The secrets used for session binding SHALL meet all of the following requirements:"
```
```
REQ:        SESS-13
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:5-11
Observed:   Not establishable from a session middleware configuration alone.
Provision:  §5.1 "Secrets are either transferred from the session host to the RP or CSP via an authenticated protected channel or derived from keys that are established as part of establishing a valid, mutually authenticated protected channel."
Governing sentence: "The secrets used for session binding SHALL meet all of the following requirements:"
```
```
REQ:        SESS-14
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:5-11
Observed:   express-session is configured but no login, logout or request handlers are supplied.
Provision:  §5.1 "Secrets will time out and are not accepted after the times specified in Sec. 2.1.3, Sec. 2.2.3, and Sec. 2.3.3, as appropriate for the AAL."
Governing sentence: "The secrets used for session binding SHALL meet all of the following requirements:"
```
```
REQ:        SESS-15
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:5-11
Observed:   Not establishable from a session middleware configuration alone.
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
Location:   src/auth.ts:5-11
Observed:   Not establishable from a session middleware configuration alone.
Provision:  §5.1 "Following authentication, authenticated sessions SHALL NOT fall back to an insecure transport (e.g., from https to http)."
```
```
REQ:        SESS-19
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:5-11
Observed:   express-session is configured but no login, logout or request handlers are supplied.
Provision:  §5.1 "POST/PUT content SHALL contain a session identifier"
```
```
REQ:        SESS-20
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:5-11
Observed:   express-session is configured but no login, logout or request handlers are supplied.
Provision:  §5.1 "that the RP SHALL verify to protect against cross-site request forgery (CSRF)."
```
```
REQ:        SESS-21
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   src/auth.ts:5-11
Observed:   express-session is configured but no login, logout or request handlers are supplied.
Provision:  §5.1 "Sessions SHOULD provide a readily accessible mechanism for subscribers to terminate (i.e., log off) their session when their interaction is complete."
```

### COOK

| COOK-01 | PASS | SHALL | HIGH | PROCEDURAL | src/auth.ts:5-11 | secure: true. |
| COOK-02 | PASS | SHALL | HIGH | SEMANTIC | src/auth.ts:10 | Path `/`, no Domain attribute. |
| COOK-03 | PASS | SHOULD | LOW | PROCEDURAL | src/auth.ts:5-11 | httpOnly: true. |
| COOK-04 | PASS | SHOULD | LOW | PROCEDURAL | src/auth.ts:5-11 | No maxAge/expires: session cookie, discarded when the browser session ends. |
```
REQ:        COOK-05
Status:     EVIDENCE REQUIRED
Level:      SHALL NOT
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:5-11
Observed:   Not establishable from a session middleware configuration alone.
Provision:  §5.1.1 "This requirement is intended to limit the accumulation of cookies but SHALL NOT be relied upon to enforce session timeouts."
```
| COOK-06 | PASS | SHOULD | LOW | PROCEDURAL | src/auth.ts:5-11 | Cookie name: __Host-sid; path: "/". Requires the __Host- prefix and Path=/. |
| COOK-07 | PASS | SHOULD | LOW | PROCEDURAL | src/auth.ts:5-11 | sameSite: lax. |
```
REQ:        COOK-08
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   src/auth.ts:5-11
Observed:   express-session's default id format is a library fact; library not supplied.
Provision:  §5.1.1 "SHOULD contain only an opaque string (e.g., a session identifier)"
```
| COOK-09 | PASS | SHALL NOT | HIGH | SEMANTIC | src/auth.ts:5-11 | express-session stores data server-side; the cookie carries only the signed session id. |

### REAUTH

```
REQ:        REAUTH-01
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:5-11
Observed:   express-session is configured but no login, logout or request handlers are supplied.
Provision:  §5.2 "The periodic reauthentication of sessions SHALL be performed to confirm the subscriber’s continued presence at an authenticated session"
```
```
REQ:        REAUTH-02
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:5-11
Observed:   No `cookie.maxAge`, store TTL or absolute lifetime is configured in the supplied code; the store's default expiry is not supplied.
Provision:  §2.2.3 "A definite reauthentication overall timeout SHALL be established"
```
```
REQ:        REAUTH-03
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  PROCEDURAL
Location:   verifier63.yaml
Observed:   aal not declared; cannot select the applicable limit.
Provision:  §2.1.3 "which SHOULD be no more than 30 days at AAL1."
```
```
REQ:        REAUTH-04
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  PROCEDURAL
Location:   verifier63.yaml
Observed:   aal not declared; cannot select the applicable limit.
Provision:  §2.2.3 "which SHOULD be no more than 24 hours at AAL2."
```
```
REQ:        REAUTH-05
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  PROCEDURAL
Location:   verifier63.yaml
Observed:   aal not declared; cannot select the applicable limit.
Provision:  §2.2.3 "The inactivity timeout SHOULD be no more than 1 hour."
```
```
REQ:        REAUTH-06
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  PROCEDURAL
Location:   verifier63.yaml
Observed:   aal not declared; cannot select the applicable limit.
Provision:  §2.3.3 "At AAL3, the overall timeout for reauthentication SHALL be no more than 12 hours."
```
```
REQ:        REAUTH-07
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  PROCEDURAL
Location:   verifier63.yaml
Observed:   aal not declared; cannot select the applicable limit.
Provision:  §2.3.3 "The inactivity timeout SHOULD be no more than 15 minutes."
```
```
REQ:        REAUTH-08
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:5-11
Observed:   express-session is configured but no login, logout or request handlers are supplied.
Provision:  §5.2 "When either timeout expires, the session SHALL be terminated."
```
```
REQ:        REAUTH-09
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:5-11
Observed:   No timeouts are configured in the supplied code; condition cannot be evaluated.
Provision:  §5.2 "Session activity SHALL reset the inactivity timeout"
```
```
REQ:        REAUTH-10
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/auth.ts:5-11
Observed:   express-session is configured but no login, logout or request handlers are supplied.
Provision:  §5.2 "successful reauthentication during a session SHALL reset both timeouts."
```

## Summary
```
Mandatory conformance failures (SHALL / SHALL NOT):   1
Recommended-practice deviations (SHOULD / SHOULD NOT): 0
Evidence gaps:                                        66
Not applicable (condition false):                     0
Passed controls:                                      18
Total controls audited:                               85
```

## Out of scope
Reported per reference/OUT-OF-SCOPE.md. Not audited, not passed.
