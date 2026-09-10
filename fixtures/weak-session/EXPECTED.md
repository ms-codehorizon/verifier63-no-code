# Expected findings: fixtures/weak-session

No composition rules, but sha256 hashing, a 500-attempt lockout, `Math.random()` session ids, a 7-day rolling lifetime at AAL2, and every cookie attribute wrong.

Declared: aal=2, password_usage=single_factor.

Drop this fixture into a Claude project together with the auditor folder and ask for the audit. The rows below are what the written procedures in `procedures/deterministic-checks.md` produce for the 24 procedural controls; the remaining 61 controls are semantic and depend on the supplied fragments (most will be EVIDENCE REQUIRED for a fixture this small).

| REQ | Expected status | Detection | Where | Why |
|---|---|---|---|---|
| COOK-01 | FAIL | PROCEDURAL | src/auth.ts:27 | secure: false. |
| COOK-03 | FAIL | PROCEDURAL | src/auth.ts:27 | httpOnly: false. |
| COOK-04 | FAIL | PROCEDURAL | src/auth.ts:27 | Cookie maxAge 604800000 ms (168.0 h) vs AAL2 overall session limit 24 h. |
| COOK-06 | FAIL | PROCEDURAL | src/auth.ts:27 | Cookie name: sid; path: default /. Requires the __Host- prefix and Path=/. |
| COOK-07 | FAIL | PROCEDURAL | src/auth.ts:27 | sameSite: none. |
| PWD-CHAR-01 | PASS | PROCEDURAL | see validator | No allowlist regex or whitespace stripping applied to the password in the supplied files. |
| PWD-CHAR-02 | PASS | PROCEDURAL | see validator | No ASCII-only allowlist applied to the password in the supplied files. |
| PWD-CHAR-04 | FAIL | PROCEDURAL | see hashing call | Unicode accepted (no ASCII allowlist) but no normalize('NFC') applied to the password before hashing in the supplied files. |
| PWD-COMP-01 | PASS | PROCEDURAL | see password validator | No character-class regex exists anywhere in the supplied files. |
| PWD-COMP-02 | FAIL | PROCEDURAL | src/auth.ts:19 | Age-based password expiry logic present: src/auth.ts:19 ageDays > PASSWORD_MAX_AGE_DAYS. |
| PWD-HASH-02 | FAIL | PROCEDURAL | src/auth.ts:14 | Password hashed with a fast unsalted digest: createHash("sha256"). Not a password hashing scheme (no salt, no cost factor). |
| PWD-LEN-01 | PASS | PROCEDURAL | src/auth.ts:9 | Minimum length enforced: 15 (password.length < 15); required >= 15 for password_usage=single_factor. |
| PWD-LEN-02 | NOT APPLICABLE | PROCEDURAL | verifier63.yaml | password_usage=single_factor; this minimum applies to the other usage mode. |
| PWD-LEN-03 | FAIL | PROCEDURAL | src/auth.ts:10 | Maximum length permitted: 20 (password.length > 20); NIST recommends permitting at least 64. |
| PWD-LEN-05 | PASS | PROCEDURAL | see hashing call | No slice/substring applied to the password before hashing or comparison in the supplied files. |
| RATE-02 | FAIL | PROCEDURAL | src/auth.ts:32 | Consecutive failed attempts limited at 501 (user.failures > MAX_LOGIN_FAILURES); NIST cap is 100. |
| REAUTH-02 | PASS | PROCEDURAL | src/auth.ts:4 | Absolute session lifetime configured: 604800000 ms (168.0 h) at SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000. |
| REAUTH-03 | NOT APPLICABLE | PROCEDURAL | verifier63.yaml | Declared aal=2; this limit is for AAL1. |
| REAUTH-04 | FAIL | PROCEDURAL | src/auth.ts:4 | Overall timeout 10080 min vs AAL2 limit 1440 min (SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000). |
| REAUTH-05 | FAIL | PROCEDURAL | src/auth.ts:4 | No inactivity timeout configured; AAL2 recommends one of at most 60 min. |
| REAUTH-06 | NOT APPLICABLE | PROCEDURAL | verifier63.yaml | Declared aal=2; this limit is for AAL3. |
| REAUTH-07 | NOT APPLICABLE | PROCEDURAL | verifier63.yaml | Declared aal=2; this limit is for AAL3. |
| SESS-11 | FAIL | PROCEDURAL | src/auth.ts:23 | Session secret derived from a non-approved or too-short source: Math.random().toString(36).slice(2). |
| SESS-17 | EVIDENCE REQUIRED | SEMANTIC (procedure could not settle it) | none supplied | No client-side code supplied; cannot establish where the session secret is stored on the endpoint. |
