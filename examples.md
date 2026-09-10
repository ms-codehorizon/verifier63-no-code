# Examples

Three real audits produced by this folder, in the format `rules.md` §2 specifies. The 24
procedural controls were decided by following `procedures/deterministic-checks.md` step by
step; the rest are the auditor's recorded judgments from the quoted code. Every row can be
re-derived by a reader with the code and the procedure open side by side.

Reading a finding: `REQ` is the control id in `reference/requirements.json`; `Provision` is the
verbatim NIST sentence that control rests on; `reference/CITATION-INDEX.md` gives the line in
`reference/sp800-63b-4-in-scope.md` where it appears under the cited section. `Detection: PROCEDURAL` means the
written procedure settled it; `SEMANTIC` means the auditor judged from the quoted lines.

| Example | What it shows |
|---|---|
| 1. hagopj13/node-express-boilerplate | A real, widely used open-source auth codebase (7k+ stars). 15 mandatory failures, including a composition rule found in two places by tracing control flow, bcrypt cost 8, no blocklist, no per-account lockout, and a refresh-token loop that never requires reauthentication. |
| 2. fixtures/composition-refactored | The same composition violation as the obvious fixture, hidden behind two helper calls on a parameter named `value`, collected into an array and returned as `{ok}`. The procedure still traces it to the `throw`. |
| 3. fixtures/missing-evidence | Correct-looking code whose critical facts live in an external service, with no `verifier63.yaml`. 66 EVIDENCE REQUIRED rows and zero invented PASSes. |

---

## Example 1

### Verifier63 audit - hagopj13/node-express-boilerplate @ 179ae84 (aal=1, single_factor)
Standard: NIST SP 800-63B-4 (final, 2025-07-31) - reference/PROVENANCE.md
Declared: aal=1  password_usage=single_factor  language=javascript
Files audited: all 38 files under src/ at commit 179ae84 (the 11 cited by findings are reproduced in examples/node-express-boilerplate/; see its SOURCE.md)
Procedural checks: applied per procedures/deterministic-checks.md

## Findings

### PWD-LEN

```
REQ:        PWD-LEN-01
Status:     FAIL
Level:      SHALL
Severity:   HIGH
Detection:  PROCEDURAL
Location:   src/validations/custom.validation.js:9
Observed:   Minimum length enforced: 8 (value.length < 8); required >= 15 for password_usage=single_factor.
Provision:  §3.1.1.2 "Verifiers and CSPs SHALL require passwords that are used as a single-factor authentication mechanism to be a minimum of 15 characters in length."
```
| PWD-LEN-02 | NOT APPLICABLE | SHALL | HIGH | PROCEDURAL | verifier63.yaml | password_usage=single_factor; this minimum applies to the other usage mode. |
| PWD-LEN-03 | PASS | SHOULD | LOW | PROCEDURAL | src/validations/custom.validation.js:9 | Password validator located; no maximum-length restriction applied in the supplied files. |
| PWD-LEN-04 | PASS | SHALL | HIGH | SEMANTIC | src/validations/auth.validation.js:15 | Login schema takes the whole password: `password: Joi.string().required()`; no partial-character prompt exists. |
```
REQ:        PWD-LEN-05
Status:     FAIL
Level:      SHALL
Severity:   HIGH
Detection:  SEMANTIC
Location:   src/models/user.model.js:81
Observed:   `bcrypt.hash(user.password, 8)` (bcryptjs) truncates its input at 72 bytes by algorithm definition, and no maximum length <= 72 is enforced, so bytes beyond 72 of a long passphrase are never verified. Fix by enforcing a maximum of 72 bytes or pre-hashing.
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
Location:   src/validations/custom.validation.js:9
Observed:   `value.length < 8` counts UTF-16 code units. A 7-code-point password containing one astral character (emoji) has `.length` 8 and passes the minimum; code points are not counted as single characters. Use `[...value].length`.
Provision:  §3.1.1.2 "Each Unicode code point SHALL be counted as a single character when evaluating password length."
```
```
REQ:        PWD-CHAR-04
Status:     FAIL
Level:      SHOULD
Severity:   LOW
Detection:  PROCEDURAL
Location:   see hashing call
Observed:   Unicode accepted (no ASCII allowlist) but no normalize('NFC') applied to the password before hashing in the supplied files.
Provision:  §3.1.1.2 "If Unicode characters are accepted in passwords, the verifier SHOULD apply the normalization process for stabilized strings using the Normalization Form Canonical Composition (NFC) normalization"
```
```
REQ:        PWD-CHAR-05
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   API-only repository; no client UI supplied, so no advisory text can be established.
Provision:  §3.1.1.2 "Subscribers choosing passwords that contain Unicode characters SHOULD be advised that some endpoints may represent some characters differently"
```

### PWD-BLK

```
REQ:        PWD-BLK-01
Status:     FAIL
Level:      SHALL
Severity:   HIGH
Detection:  SEMANTIC
Location:   src/validations/custom.validation.js:8-16
Observed:   The only checks on a new password are length and a letter+digit composition rule (`custom.validation.js`, and again in `user.model.js:26-35`). No blocklist, breach-corpus or common-password comparison exists on the register (`auth.validation.js:7`) or reset (`:42`) paths.
Provision:  §3.1.1.2 "When processing a request to establish or change a password, verifiers SHALL compare the prospective secret against a blocklist that contains known commonly used, expected, or compromised passwords."
```
| PWD-BLK-02 | NOT APPLICABLE | SHALL | HIGH | NONE | src/validations/custom.validation.js:8-16 | No blocklist check is present (blocklist_check_present = false). |
| PWD-BLK-03 | NOT APPLICABLE | SHALL | HIGH | NONE | src/validations/custom.validation.js:8-16 | No blocklist check is present (blocklist_check_present = false). |
| PWD-BLK-04 | NOT APPLICABLE | SHALL | HIGH | NONE | src/validations/custom.validation.js:8-16 | No blocklist check is present (blocklist_check_present = false). |
| PWD-BLK-05 | NOT APPLICABLE | SHOULD | LOW | NONE | src/validations/custom.validation.js:8-16 | No blocklist check is present (blocklist_check_present = false). |
```
REQ:        PWD-BLK-06
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   The API returns `password must be at least 8 characters` on rejection; whether any guidance on choosing a strong password is shown at creation time lives in a client that is not supplied.
Provision:  §3.1.1.2 "Verifiers SHALL offer guidance to the subscriber to help the subscriber choose a strong password."
```

### PWD-COMP

```
REQ:        PWD-COMP-01
Status:     FAIL
Level:      SHALL NOT
Severity:   HIGH
Detection:  PROCEDURAL
Location:   src/models/user.model.js:32
Observed:   Composition rule enforced: src/models/user.model.js:32 value.match(/\d/) [/\d/]; src/validations/custom.validation.js:12 value.match(/\d/) [/\d/]
Provision:  §3.1.1.2 "Verifiers and CSPs SHALL NOT impose other composition rules (e.g., requiring mixtures of different character types) for passwords."
```
| PWD-COMP-02 | PASS | SHALL NOT | HIGH | PROCEDURAL | all supplied files | No password age, expiry, or rotation-interval logic located in the supplied files. |
```
REQ:        PWD-COMP-03
Status:     FAIL
Level:      SHALL
Severity:   HIGH
Detection:  SEMANTIC
Location:   src/models/user.model.js:20-35
Observed:   The user model has no compromised / must-reset flag and no code path forces a password change; the only reset is user-initiated via `forgotPassword` -> email token (`auth.service.js`).
Provision:  §3.1.1.2 "However, verifiers SHALL force a change if there is evidence that the authenticator has been compromised."
```
| PWD-COMP-04 | PASS | SHALL NOT | HIGH | SEMANTIC | src/models/user.model.js:8-45 | User schema stores name, email, password, role, isEmailVerified. No hint field exists. |
| PWD-COMP-05 | PASS | SHALL NOT | HIGH | SEMANTIC | src/validations/auth.validation.js:4-9 | Registration collects email, password and name only. No security questions or KBA prompts. |

### PWD-UX

```
REQ:        PWD-UX-01
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   API-only repository; autofill/password-manager behaviour is a client property.
Provision:  §3.1.1.2 "Verifiers SHALL allow the use of password managers and autofill functionality."
```
```
REQ:        PWD-UX-02
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   API-only repository; paste behaviour is a client property.
Provision:  §3.1.1.2 "Verifiers SHOULD permit claimants to use the “paste” function when entering a password"
```
```
REQ:        PWD-UX-03
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   API-only repository; display-password option is a client property.
Provision:  §3.1.1.2 "the verifier SHOULD offer an option to display the password — rather than a series of dots or asterisks — while it is entered and until it is submitted to the verifier."
```

### PWD-CHAN

```
REQ:        PWD-CHAN-01
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/app.js:1-60
Observed:   `app.js` creates a plain Express app; TLS termination is not in the supplied code (no https server, no proxy config). `helmet()` at line 25 sets HSTS by library default, which is not evidence of the listener's transport.
Provision:  §3.1.1.2 "Verifiers and CSPs SHALL use approved encryption and an authenticated protected channel when requesting passwords."
```

### PWD-HASH

| PWD-HASH-01 | PASS | SHALL | HIGH | SEMANTIC | src/models/user.model.js:81 | Passwords are stored as bcrypt hashes (`bcrypt.hash(user.password, 8)`) set in a pre-save hook; `isPasswordMatch` compares with `bcrypt.compare`. |
| PWD-HASH-02 | PASS | SHALL | HIGH | PROCEDURAL | src/models/user.model.js:81 | Password hashing scheme in use: bcrypt (bcrypt.hash(user.password, 8)). Salt is generated by the scheme. |
```
REQ:        PWD-HASH-03
Status:     FAIL
Level:      SHOULD
Severity:   LOW
Detection:  SEMANTIC
Location:   src/models/user.model.js:81
Observed:   bcrypt cost factor is 8 (256 iterations). bcryptjs' own default is 10 and current guidance is 10 or higher; 8 is below what is practical without impacting performance.
Provision:  §3.1.1.2 "The chosen cost factor SHOULD be as high as practical without negatively impacting verifier performance."
```
```
REQ:        PWD-HASH-04
Status:     FAIL
Level:      SHOULD
Severity:   LOW
Detection:  SEMANTIC
Location:   src/models/user.model.js:78-84
Observed:   The cost factor is a hard-coded literal with no version tag, no rehash-on-login and no migration path, so it cannot be increased over time without a data migration.
Provision:  §3.1.1.2 "It SHOULD be increased over time to account for increases in computing performance."
```
```
REQ:        PWD-HASH-05
Status:     FAIL
Level:      SHOULD
Severity:   LOW
Detection:  SEMANTIC
Location:   src/models/user.model.js:81
Observed:   bcrypt is not the SP 800-132 scheme (PBKDF2) and no updated NIST guideline qualifying it is supplied. Deviation from this NIST recommendation; not a finding that bcrypt is insecure.
Provision:  §3.1.1.2 "An approved password hashing scheme published in the latest revision of [SP800-132] or updated NIST guidelines on password hashing schemes SHOULD be used."
```
| PWD-HASH-06 | PASS | SHOULD | LOW | SEMANTIC | src/models/user.model.js:81 | The full 60-character bcrypt string returned by `bcrypt.hash` is stored unmodified in `user.password`. |
| PWD-HASH-07 | PASS | SHALL | HIGH | SEMANTIC | src/models/user.model.js:81 | bcrypt's modular-crypt output embeds a 128-bit salt by algorithm definition; `bcrypt.hash` with a numeric cost generates it per call. (bcryptjs itself is not supplied; this rests on the bcrypt format specification, not on a library default.) |
| PWD-HASH-08 | PASS | SHALL | HIGH | SEMANTIC | src/models/user.model.js:81 | Salt is generated per hash by `bcrypt.hash`, not fixed or shared across accounts. |
| PWD-HASH-09 | PASS | SHALL | HIGH | SEMANTIC | src/models/user.model.js:81 | The stored bcrypt string carries both salt and hash. |
| PWD-HASH-10 | PASS | SHOULD | LOW | SEMANTIC | src/models/user.model.js:81 | The stored bcrypt string carries the scheme identifier (`$2a$`) and cost (`08`). |
```
REQ:        PWD-HASH-11
Status:     FAIL
Level:      SHOULD
Severity:   LOW
Detection:  SEMANTIC
Location:   src/models/user.model.js:78-84
Observed:   No keyed hashing / pepper step is performed after bcrypt; the hash is stored as returned.
Provision:  §3.1.1.2 "In addition, verifiers SHOULD perform an additional iteration of a keyed hashing or encryption operation using a secret key known only to the verifier."
```
| PWD-HASH-12 | NOT APPLICABLE | SHALL | HIGH | NONE | src/models/user.model.js:78-84 | No keyed step is implemented (keyed_hash_or_encryption_step_present = false). |
| PWD-HASH-13 | NOT APPLICABLE | SHALL | HIGH | NONE | src/models/user.model.js:78-84 | No keyed step is implemented (keyed_hash_or_encryption_step_present = false). |
| PWD-HASH-14 | NOT APPLICABLE | SHOULD | LOW | NONE | src/models/user.model.js:78-84 | No keyed step is implemented (keyed_hash_or_encryption_step_present = false). |

### RATE

```
REQ:        RATE-01
Status:     FAIL
Level:      SHALL
Severity:   HIGH
Detection:  SEMANTIC
Location:   src/middlewares/rateLimiter.js:3-7 and src/app.js:49-51
Observed:   The only throttle is `express-rate-limit` keyed on request source (20 requests / 15 min, `skipSuccessfulRequests`), applied to `/v1/auth` and only when `NODE_ENV === 'production'`. It does not limit failed attempts on a subscriber account: an attacker rotating source addresses is unlimited, and in non-production there is no limit at all.
Provision:  §3.1.1.2 "Verifiers SHALL implement a rate-limiting mechanism that effectively limits the number of failed authentication attempts that can be made on the subscriber account, as described in Sec. 3.2.2."
```
```
REQ:        RATE-02
Status:     FAIL
Level:      SHALL
Severity:   HIGH
Detection:  SEMANTIC
Location:   src/services/auth.service.js:13-19 and src/middlewares/rateLimiter.js:3-7
Observed:   No per-account failed-attempt counter exists and the password authenticator is never disabled. The only limiter is per source address (20 requests / 15 min, production only), so consecutive failures on one account are unbounded across addresses.
Provision:  §3.2.2 "the verifier SHALL limit consecutive failed authentication attempts using a specific authenticator on a single subscriber account to no more than 100 by disabling that authenticator."
```
| RATE-03 | NOT APPLICABLE | SHALL | HIGH | NONE | src/config/passport.js:1-25 | Only a password authenticator exists (second_authenticator_present = false). |
```
REQ:        RATE-04
Status:     FAIL
Level:      SHALL
Severity:   HIGH
Detection:  SEMANTIC
Location:   src/services/auth.service.js:13-19
Observed:   No authenticator is ever disabled (see RATE-02), so no rebinding path exists; login with the correct password succeeds regardless of prior failures.
Provision:  §3.2.2 "Authenticators that have been disabled SHALL be required to rebind to the subscriber account, as described in Sec. 4.1, to be usable in the future."
```
```
REQ:        RATE-05
Status:     FAIL
Level:      SHOULD
Severity:   LOW
Detection:  SEMANTIC
Location:   src/services/auth.service.js:13-19
Observed:   There is no per-account failed-attempt counter to disregard; the IP limiter's `skipSuccessfulRequests` only stops counting successes toward the window.
Provision:  §3.2.2 "When the subscriber successfully authenticates, the verifier SHOULD disregard any previous failed attempts for the authenticators used in the successful authentication."
```
| RATE-06 | NOT APPLICABLE | SHALL | HIGH | NONE | src/services/auth.service.js:13-19 | No retry-count reset feature exists (retry_count_reset_feature_present = false). |

### SESS

| SESS-01 | PASS | SHALL | HIGH | SEMANTIC | src/services/token.service.js:68-86 | Sessions are bearer JWTs: an access token (30 min) and a refresh token (30 days) are issued at login and presented by the client on each request. |
| SESS-02 | PASS | SHALL | HIGH | SEMANTIC | src/config/passport.js:6-9 | The access token is presented directly as an `Authorization: Bearer` header (`ExtractJwt.fromAuthHeaderAsBearerToken`). |
| SESS-03 | PASS | SHALL | HIGH | SEMANTIC | src/services/token.service.js:68-86 and src/services/auth.service.js:13-19 | Continuity rests on possession of tokens issued by `generateAuthTokens` immediately after `loginUserWithEmailAndPassword` succeeds. |
```
REQ:        SESS-04
Status:     FAIL
Level:      SHOULD NOT
Severity:   LOW
Detection:  SEMANTIC
Location:   src/services/token.service.js:72-74
Observed:   The refresh token is a bearer secret valid for 30 days (`refreshExpirationDays`, default 30) and is intended to be retained by the client across restarts.
Provision:  §5.1 "Session secrets that are used as bearer tokens for session management SHOULD NOT be persistent (i.e., retained across a restart of the associated application or a reboot of the host device)"
```
```
REQ:        SESS-05
Status:     FAIL
Level:      SHALL NOT
Severity:   HIGH
Detection:  SEMANTIC
Location:   src/services/auth.service.js:38-50
Observed:   `refreshAuth` accepts a refresh token, deletes it and issues a brand-new 30-day refresh token with no reference to when the subscriber last authenticated. A stored bearer token therefore substitutes for authentication indefinitely, beyond any overall timeout.
Provision:  §5.1 "Cookies and similar “remember my browser” features SHALL NOT be used instead of authentication except as provided for reauthentication at AAL2 in Sec. 2.2.3 when the inactivity limit has been exceeded but the time limit has not."
```
```
REQ:        SESS-06
Status:     FAIL
Level:      SHALL
Severity:   HIGH
Detection:  SEMANTIC
Location:   src/services/auth.service.js:38-50
Observed:   No overall session lifetime is enforced (see REAUTH-02); rolling refresh extends the session without bound.
Provision:  §5.1 "However, RPs and CSPs SHALL ensure that the session lifetime limits described in Sec. 2.2.3 are enforced even when a knowledge of the session secret is demonstrated."
```
| SESS-07 | PASS | SHALL | HIGH | SEMANTIC | src/services/auth.service.js:13-19 and src/controllers/auth.controller.js | Tokens are generated by `tokenService.generateAuthTokens(user)` only after a successful password check (login) or registration; no pre-authentication token is reused. |
```
REQ:        SESS-08
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   src/services/token.service.js:18-26
Observed:   The application has a single AAL and the token payload carries `sub`, `iat`, `exp`, `type` only; no AAL property exists to inherit.
Provision:  §5.1 "A session SHOULD inherit the AAL properties of the authentication event that triggered its creation."
```
| SESS-09 | PASS | SHALL NOT | HIGH | SEMANTIC | src/services/token.service.js:18-26 | Single-AAL application; tokens carry no claim of a higher assurance level than the password authentication that produced them. |
| SESS-10 | PASS | SHALL | HIGH | SEMANTIC | src/services/auth.service.js:13-19 | Same evidence as SESS-07: tokens are established immediately following authentication. |
```
REQ:        SESS-11
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/services/token.service.js:18-26 and src/config/config.js
Observed:   The session secret is a JWT whose unforgeability rests on `config.jwt.secret` (HS256), loaded from the environment. Its generation is outside the supplied code; `.env.example` ships `JWT_SECRET=thisisasamplesecret`. Whether the deployed key came from an approved RBG with >= 64 bits cannot be established.
Provision:  §5.1 "Secrets are established using input from an approved random bit generator, as described in Sec. 3.2.12, and are at least 64 bits in length."
Governing sentence: "The secrets used for session binding SHALL meet all of the following requirements:"
```
```
REQ:        SESS-12
Status:     FAIL
Level:      SHALL
Severity:   HIGH
Detection:  SEMANTIC
Location:   src/services/auth.service.js:25-32 and src/config/passport.js:11-23
Observed:   `logout` deletes the refresh-token document only. The access token remains valid until its 30-minute `exp`: `jwtVerify` checks signature, type and user existence, never revocation. The session secret is not invalidated at logout.
Provision:  §5.1 "Secrets are erased or invalidated by the session subject when the subscriber logs out."
Governing sentence: "The secrets used for session binding SHALL meet all of the following requirements:"
```
```
REQ:        SESS-13
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/app.js:1-60
Observed:   TLS is not in the supplied code (see PWD-CHAN-01).
Provision:  §5.1 "Secrets are either transferred from the session host to the RP or CSP via an authenticated protected channel or derived from keys that are established as part of establishing a valid, mutually authenticated protected channel."
Governing sentence: "The secrets used for session binding SHALL meet all of the following requirements:"
```
```
REQ:        SESS-14
Status:     FAIL
Level:      SHALL
Severity:   HIGH
Detection:  SEMANTIC
Location:   src/services/auth.service.js:38-50
Observed:   Access tokens expire at 30 minutes and refresh tokens at 30 days, but each refresh issues a new 30-day token, so secrets remain accepted past any AAL1 overall limit (see REAUTH-02).
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
Observed:   Proxy / CDN / load-balancer configuration not supplied.
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
Observed:   API-only repository; endpoint-side erasure is a client property.
Provision:  §5.1 "the secrets used for session binding SHOULD be erased on the subscriber endpoint when they log out or when the secret is deemed to have expired."
```
```
REQ:        SESS-17
Status:     EVIDENCE REQUIRED
Level:      SHOULD NOT
Severity:   LOW
Detection:  NONE
Location:   none supplied
Observed:   API-only repository; where the client stores the bearer tokens (localStorage, memory, secure storage) is not in the supplied code.
Provision:  §5.1 "They SHOULD NOT be placed in insecure locations (e.g., HTML5 Local Storage) due to the potential exposure of local storage to cross-site scripting (XSS) attacks."
```
```
REQ:        SESS-18
Status:     EVIDENCE REQUIRED
Level:      SHALL NOT
Severity:   HIGH
Detection:  NONE
Location:   src/app.js:25
Observed:   `helmet()` is applied, which sets `Strict-Transport-Security` by library default; the library and its version are not supplied and no https listener or redirect is in the code.
Provision:  §5.1 "Following authentication, authenticated sessions SHALL NOT fall back to an insecure transport (e.g., from https to http)."
```
```
REQ:        SESS-19
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/config/passport.js:6-9
Observed:   State-changing routes are protected by `auth()`, which requires the bearer token in the Authorization header on every request. The token is not attached automatically by browsers, so CSRF via cookie replay does not arise, but the provision as written requires an identifier in the POST/PUT content that the RP verifies. Whether a header-borne bearer token satisfies 'content' is a reading this auditor does not decide; supply a written interpretation or add a body/header CSRF token to settle it.
Provision:  §5.1 "POST/PUT content SHALL contain a session identifier"
```
```
REQ:        SESS-20
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/config/passport.js:11-23
Observed:   Same evidence and same open reading as SESS-19.
Provision:  §5.1 "that the RP SHALL verify to protect against cross-site request forgery (CSRF)."
```
| SESS-21 | PASS | SHOULD | LOW | SEMANTIC | src/routes/v1/auth.route.js:11 | `POST /v1/auth/logout` exists and is validated (`authValidation.logout`). |

### COOK

| COOK-01 | NOT APPLICABLE | SHALL | HIGH | NONE | src/config/passport.js:6-9 | No session cookies are used; sessions are header-borne bearer tokens (session_cookies_used = false). |
| COOK-02 | NOT APPLICABLE | SHALL | HIGH | NONE | src/config/passport.js:6-9 | No session cookies are used (session_cookies_used = false). |
| COOK-03 | NOT APPLICABLE | SHOULD | LOW | NONE | src/config/passport.js:6-9 | No session cookies are used (session_cookies_used = false). |
| COOK-04 | NOT APPLICABLE | SHOULD | LOW | NONE | src/config/passport.js:6-9 | No session cookies are used (session_cookies_used = false). |
| COOK-05 | NOT APPLICABLE | SHALL NOT | HIGH | NONE | src/config/passport.js:6-9 | No session cookies are used (session_cookies_used = false). |
| COOK-06 | NOT APPLICABLE | SHOULD | LOW | NONE | src/config/passport.js:6-9 | No session cookies are used (session_cookies_used = false). |
| COOK-07 | NOT APPLICABLE | SHOULD | LOW | NONE | src/config/passport.js:6-9 | No session cookies are used (session_cookies_used = false). |
| COOK-08 | NOT APPLICABLE | SHOULD | LOW | NONE | src/config/passport.js:6-9 | No session cookies are used (session_cookies_used = false). |
| COOK-09 | NOT APPLICABLE | SHALL NOT | HIGH | NONE | src/config/passport.js:6-9 | No session cookies are used (session_cookies_used = false). |

### REAUTH

```
REQ:        REAUTH-01
Status:     FAIL
Level:      SHALL
Severity:   HIGH
Detection:  SEMANTIC
Location:   src/services/auth.service.js:38-50
Observed:   Periodic reauthentication is never required: the 30-minute access token is renewed from the refresh token, and the refresh token is itself rolled forward on every use, so a subscriber who never logs out is never asked to authenticate again.
Provision:  §5.2 "The periodic reauthentication of sessions SHALL be performed to confirm the subscriber’s continued presence at an authenticated session"
```
```
REQ:        REAUTH-02
Status:     FAIL
Level:      SHALL
Severity:   HIGH
Detection:  SEMANTIC
Location:   src/services/token.service.js:68-74 and src/services/auth.service.js:38-50
Observed:   Two expirations exist (access 30 min, refresh 30 days) but `refreshAuth` issues a new 30-day refresh token each time. There is no definite overall timeout measured from the authentication event.
Provision:  §2.2.3 "A definite reauthentication overall timeout SHALL be established"
```
```
REQ:        REAUTH-03
Status:     FAIL
Level:      SHOULD
Severity:   LOW
Detection:  SEMANTIC
Location:   src/services/token.service.js:72
Observed:   The 30-day refresh expiry would meet the AAL1 limit if it were absolute; because it rolls forward on each refresh, no overall timeout of at most 30 days is established.
Provision:  §2.1.3 "which SHOULD be no more than 30 days at AAL1."
```
| REAUTH-04 | NOT APPLICABLE | SHOULD | LOW | PROCEDURAL | verifier63.yaml | Declared aal=1; this limit is for AAL2. |
| REAUTH-05 | NOT APPLICABLE | SHOULD | LOW | PROCEDURAL | verifier63.yaml | Declared aal=1; this limit is for AAL2. |
| REAUTH-06 | NOT APPLICABLE | SHALL | HIGH | PROCEDURAL | verifier63.yaml | Declared aal=1; this limit is for AAL3. |
| REAUTH-07 | NOT APPLICABLE | SHOULD | LOW | PROCEDURAL | verifier63.yaml | Declared aal=1; this limit is for AAL3. |
| REAUTH-08 | PASS | SHALL | HIGH | SEMANTIC | src/services/token.service.js:57-63 and src/config/passport.js:11-23 | Expired access tokens are rejected by `jwt.verify` (exp claim); expired refresh tokens are rejected by `verifyToken` and removed. Each timeout that exists is enforced server-side. |
| REAUTH-09 | NOT APPLICABLE | SHALL | HIGH | NONE | src/services/token.service.js:68-74 | No inactivity timeout is configured (inactivity_timeout_configured = false); the only timers are absolute per-token expirations. |
| REAUTH-10 | PASS | SHALL | HIGH | SEMANTIC | src/services/auth.service.js:13-19 and src/services/token.service.js:68-86 | A fresh login issues new access and refresh tokens with new expirations. |

## Summary
```
Mandatory conformance failures (SHALL / SHALL NOT):   15
Recommended-practice deviations (SHOULD / SHOULD NOT): 8
Evidence gaps:                                        15
Not applicable (condition false):                     24
Passed controls:                                      23
Total controls audited:                               85
```

## Out of scope
Reported per reference/OUT-OF-SCOPE.md. Not audited, not passed.

---

## Example 2

### Verifier63 audit - fixtures/composition-refactored
Standard: NIST SP 800-63B-4 (final, 2025-07-31) - reference/PROVENANCE.md
Declared: aal=2  password_usage=part_of_mfa  language=typescript
Files audited: src/checks.ts, src/password-validator.ts, src/session.ts
Procedural checks: applied per procedures/deterministic-checks.md

## Findings

### PWD-LEN

| PWD-LEN-01 | NOT APPLICABLE | SHALL | HIGH | PROCEDURAL | verifier63.yaml | password_usage=part_of_mfa; this minimum applies to the other usage mode. |
| PWD-LEN-02 | PASS | SHALL | HIGH | PROCEDURAL | src/password-validator.ts:9 | Minimum length enforced: 8 (candidate.length < 8); required >= 8 for password_usage=part_of_mfa. |
| PWD-LEN-03 | PASS | SHOULD | LOW | PROCEDURAL | src/password-validator.ts:9 | Password validator located; no maximum-length restriction applied in the supplied files. |
| PWD-LEN-04 | PASS | SHALL | HIGH | SEMANTIC | src/password-validator.ts:16 | `evaluatePassword(password)` receives and evaluates the whole string. |
| PWD-LEN-05 | PASS | SHALL | HIGH | PROCEDURAL | see hashing call | No slice/substring applied to the password before hashing or comparison in the supplied files. |

### PWD-CHAR

| PWD-CHAR-01 | PASS | SHOULD | LOW | PROCEDURAL | see validator | No allowlist regex or whitespace stripping applied to the password in the supplied files. |
| PWD-CHAR-02 | PASS | SHOULD | LOW | PROCEDURAL | see validator | No ASCII-only allowlist applied to the password in the supplied files. |
```
REQ:        PWD-CHAR-03
Status:     FAIL
Level:      SHALL
Severity:   HIGH
Detection:  SEMANTIC
Location:   src/password-validator.ts:9
Observed:   `candidate.length < 8` counts UTF-16 code units, not code points; an astral character counts as two.
Provision:  §3.1.1.2 "Each Unicode code point SHALL be counted as a single character when evaluating password length."
```
| PWD-CHAR-04 | PASS | SHOULD | LOW | PROCEDURAL | src/session.ts:9 | NFC normalization applied: password.normalize("NFC"). |
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
Status:     FAIL
Level:      SHALL
Severity:   HIGH
Detection:  SEMANTIC
Location:   src/password-validator.ts:7-12
Observed:   `collectProblems` checks length and two character classes only; no blocklist comparison exists on the registration path (`registerUser`).
Provision:  §3.1.1.2 "When processing a request to establish or change a password, verifiers SHALL compare the prospective secret against a blocklist that contains known commonly used, expected, or compromised passwords."
```
| PWD-BLK-02 | NOT APPLICABLE | SHALL | HIGH | NONE | src/password-validator.ts:7-12 | No blocklist check present. |
| PWD-BLK-03 | NOT APPLICABLE | SHALL | HIGH | NONE | src/password-validator.ts:7-12 | No blocklist check present. |
| PWD-BLK-04 | NOT APPLICABLE | SHALL | HIGH | NONE | src/password-validator.ts:7-12 | No blocklist check present. |
| PWD-BLK-05 | NOT APPLICABLE | SHOULD | LOW | NONE | src/password-validator.ts:7-12 | No blocklist check present. |
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

```
REQ:        PWD-COMP-01
Status:     FAIL
Level:      SHALL NOT
Severity:   HIGH
Detection:  PROCEDURAL
Location:   src/checks.ts:5
Observed:   Composition rule enforced: src/checks.ts:5 A.test(value) [/[A-Z]/]; src/checks.ts:9 B.test(value) [/\d/]
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
Observed:   Fixture supplies the validator and one session helper file only; this behaviour is not in the supplied code.
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
| PWD-COMP-05 | PASS | SHALL NOT | HIGH | SEMANTIC | src/password-validator.ts:22-28 | `registerUser` takes only the password and a save callback; no security questions are collected. |

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
Observed:   No server/TLS configuration supplied.
Provision:  §3.1.1.2 "Verifiers and CSPs SHALL use approved encryption and an authenticated protected channel when requesting passwords."
```

### PWD-HASH

| PWD-HASH-01 | PASS | SHALL | HIGH | SEMANTIC | src/session.ts:9-11 | argon2id with memoryCost 65536, timeCost 3. |
| PWD-HASH-02 | PASS | SHALL | HIGH | PROCEDURAL | src/session.ts:9 | Password hashing scheme in use: argon2 (argon2.hash(password.normalize("NFC"), { type: argon2.argon2id, memoryCost: 65536, timeCost: 3 })). Salt is generated by the scheme. |
| PWD-HASH-03 | PASS | SHOULD | LOW | SEMANTIC | src/session.ts:10 | memoryCost 65536 KiB, timeCost 3: at or above the argon2 RFC 9106 recommended parameters. |
```
REQ:        PWD-HASH-04
Status:     EVIDENCE REQUIRED
Level:      SHOULD
Severity:   LOW
Detection:  NONE
Location:   src/session.ts:10
Observed:   Parameters are literals; no rehash-on-login or version tag is in the supplied code.
Provision:  §3.1.1.2 "It SHOULD be increased over time to account for increases in computing performance."
```
```
REQ:        PWD-HASH-05
Status:     FAIL
Level:      SHOULD
Severity:   LOW
Detection:  SEMANTIC
Location:   src/session.ts:10
Observed:   argon2 is not the SP 800-132 scheme (PBKDF2); no qualifying guideline supplied. Deviation from this NIST recommendation; not a finding that argon2 is insecure.
Provision:  §3.1.1.2 "An approved password hashing scheme published in the latest revision of [SP800-132] or updated NIST guidelines on password hashing schemes SHOULD be used."
```
| PWD-HASH-06 | PASS | SHOULD | LOW | SEMANTIC | src/session.ts:10 | The PHC-format string returned by `argon2.hash` is returned unmodified. |
```
REQ:        PWD-HASH-07
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/session.ts:10
Observed:   Salt length is an argon2 library default (16 bytes); the library is not supplied and no evidence/ folder is present.
Provision:  §3.1.1.2 "The salt SHALL be at least 32 bits in length"
```
```
REQ:        PWD-HASH-08
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/session.ts:10
Observed:   Salt generation is a library default; not supplied.
Provision:  §3.1.1.2 "and chosen to minimize salt value collisions among stored hashes (i.e., to prevent multiple subscriber accounts from having the same hashed password)."
Governing sentence: "The salt SHALL be at least 32 bits in length and chosen to minimize salt value collisions among stored hashes"
```
| PWD-HASH-09 | PASS | SHALL | HIGH | SEMANTIC | src/session.ts:10 | PHC-format output embeds salt and hash by specification. |
| PWD-HASH-10 | PASS | SHOULD | LOW | SEMANTIC | src/session.ts:10 | PHC-format output embeds algorithm, version and parameters by specification. |
```
REQ:        PWD-HASH-11
Status:     FAIL
Level:      SHOULD
Severity:   LOW
Detection:  SEMANTIC
Location:   src/session.ts:9-11
Observed:   No keyed hashing / pepper step after argon2.
Provision:  §3.1.1.2 "In addition, verifiers SHOULD perform an additional iteration of a keyed hashing or encryption operation using a secret key known only to the verifier."
```
| PWD-HASH-12 | NOT APPLICABLE | SHALL | HIGH | NONE | src/session.ts:9-11 | No keyed step implemented. |
| PWD-HASH-13 | NOT APPLICABLE | SHALL | HIGH | NONE | src/session.ts:9-11 | No keyed step implemented. |
| PWD-HASH-14 | NOT APPLICABLE | SHOULD | LOW | NONE | src/session.ts:9-11 | No keyed step implemented. |

### RATE

| RATE-01 | PASS | SHALL | HIGH | SEMANTIC | src/session.ts:21-27 | `recordFailedAttempt` counts failures per account and disables the password at 10. |
| RATE-02 | PASS | SHALL | HIGH | PROCEDURAL | src/session.ts:22 | Consecutive failed attempts limited at 10 (account.failedAttempts >= MAX_FAILED_ATTEMPTS); NIST cap is 100. |
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
Location:   src/session.ts:24
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

### SESS

| SESS-01 | PASS | SHALL | HIGH | SEMANTIC | src/session.ts:13-19 | A session id is generated and set as a cookie. |
| SESS-02 | PASS | SHALL | HIGH | SEMANTIC | src/session.ts:17-19 | Presented directly as a cookie. |
```
REQ:        SESS-03
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/session.ts:13-19
Observed:   Session creation helper exists; the resolve/lookup path that establishes continuity is not supplied.
Provision:  §5.1 "The continuity of authenticated sessions SHALL be based on the possession of a session secret that is issued by the session host at the time of authentication and optionally refreshed during the session."
```
| SESS-04 | PASS | SHOULD NOT | LOW | SEMANTIC | src/session.ts:18 | Session cookie has no maxAge/expires: not persistent across browser restart. |
| SESS-05 | PASS | SHALL NOT | HIGH | SEMANTIC | src/session.ts:13-19 | No remember-me mechanism in the supplied code. |
```
REQ:        SESS-06
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/session.ts:4-5
Observed:   Lifetime constants are defined; the enforcement path is not supplied.
Provision:  §5.1 "However, RPs and CSPs SHALL ensure that the session lifetime limits described in Sec. 2.2.3 are enforced even when a knowledge of the session secret is demonstrated."
```
```
REQ:        SESS-07
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/session.ts:13-15
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
Observed:   Fixture supplies the validator and one session helper file only; this behaviour is not in the supplied code.
Provision:  §5.1 "A session SHOULD inherit the AAL properties of the authentication event that triggered its creation."
```
```
REQ:        SESS-09
Status:     EVIDENCE REQUIRED
Level:      SHALL NOT
Severity:   HIGH
Detection:  NONE
Location:   none supplied
Observed:   Fixture supplies the validator and one session helper file only; this behaviour is not in the supplied code.
Provision:  §5.1 "A session MAY be considered at a lower AAL than the authentication event but SHALL NOT be considered at a higher AAL than the authentication event."
```
```
REQ:        SESS-10
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/session.ts:13-15
Observed:   Same as SESS-07.
Provision:  §5.1 "Secrets are established during or immediately following authentication."
Governing sentence: "The secrets used for session binding SHALL meet all of the following requirements:"
```
| SESS-11 | PASS | SHALL | HIGH | PROCEDURAL | src/session.ts:13 | Session secret generated with a CSPRNG at 256 bits: randomBytes(32). |
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
Location:   src/session.ts:4-5
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

### COOK

| COOK-01 | PASS | SHALL | HIGH | PROCEDURAL | src/session.ts:17 | secure: true. |
| COOK-02 | PASS | SHALL | HIGH | SEMANTIC | src/session.ts:18 | Path is `/` and no Domain attribute is set, so the cookie is scoped to the issuing host only. |
| COOK-03 | PASS | SHOULD | LOW | PROCEDURAL | src/session.ts:17 | httpOnly: true. |
| COOK-04 | PASS | SHOULD | LOW | PROCEDURAL | src/session.ts:17 | No maxAge/expires: session cookie, discarded when the browser session ends. |
```
REQ:        COOK-05
Status:     EVIDENCE REQUIRED
Level:      SHALL NOT
Severity:   HIGH
Detection:  NONE
Location:   src/session.ts:4-5
Observed:   Server-side expiry constants exist; enforcement not supplied.
Provision:  §5.1.1 "This requirement is intended to limit the accumulation of cookies but SHALL NOT be relied upon to enforce session timeouts."
```
| COOK-06 | PASS | SHOULD | LOW | PROCEDURAL | src/session.ts:17 | Cookie name: __Host-session; path: "/". Requires the __Host- prefix and Path=/. |
| COOK-07 | PASS | SHOULD | LOW | PROCEDURAL | src/session.ts:17 | sameSite: strict. |
| COOK-08 | PASS | SHOULD | LOW | SEMANTIC | src/session.ts:14 | Cookie value is a 32-byte random hex string; opaque. |
| COOK-09 | PASS | SHALL NOT | HIGH | SEMANTIC | src/session.ts:14 | Cookie value carries no personal information. |

### REAUTH

```
REQ:        REAUTH-01
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/session.ts:4-5
Observed:   Timeout constants exist; the reauthentication enforcement path is not supplied.
Provision:  §5.2 "The periodic reauthentication of sessions SHALL be performed to confirm the subscriber’s continued presence at an authenticated session"
```
| REAUTH-02 | PASS | SHALL | HIGH | PROCEDURAL | src/session.ts:4 | Absolute session lifetime configured: 43200000 ms (12.0 h) at SESSION_ABSOLUTE_LIFETIME_MS = 12 * 60 * 60 * 1000. |
| REAUTH-03 | NOT APPLICABLE | SHOULD | LOW | PROCEDURAL | verifier63.yaml | Declared aal=2; this limit is for AAL1. |
| REAUTH-04 | PASS | SHOULD | LOW | PROCEDURAL | src/session.ts:4 | Overall timeout 720 min vs AAL2 limit 1440 min (SESSION_ABSOLUTE_LIFETIME_MS = 12 * 60 * 60 * 1000). |
| REAUTH-05 | PASS | SHOULD | LOW | PROCEDURAL | src/session.ts:5 | Inactivity timeout 30 min vs AAL2 limit 60 min (SESSION_IDLE_TIMEOUT_MS = 30 * 60 * 1000). |
| REAUTH-06 | NOT APPLICABLE | SHALL | HIGH | PROCEDURAL | verifier63.yaml | Declared aal=2; this limit is for AAL3. |
| REAUTH-07 | NOT APPLICABLE | SHOULD | LOW | PROCEDURAL | verifier63.yaml | Declared aal=2; this limit is for AAL3. |
```
REQ:        REAUTH-08
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/session.ts:4-5
Observed:   Enforcement path not supplied.
Provision:  §5.2 "When either timeout expires, the session SHALL be terminated."
```
```
REQ:        REAUTH-09
Status:     EVIDENCE REQUIRED
Level:      SHALL
Severity:   HIGH
Detection:  NONE
Location:   src/session.ts:5
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

## Summary
```
Mandatory conformance failures (SHALL / SHALL NOT):   3
Recommended-practice deviations (SHOULD / SHOULD NOT): 2
Evidence gaps:                                        35
Not applicable (condition false):                     12
Passed controls:                                      33
Total controls audited:                               85
```

## Out of scope
Reported per reference/OUT-OF-SCOPE.md. Not audited, not passed.

---

## Example 3

### Verifier63 audit - fixtures/missing-evidence
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
