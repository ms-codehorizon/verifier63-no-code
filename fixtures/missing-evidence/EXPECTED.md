# Expected findings: fixtures/missing-evidence

Correct-looking code whose critical facts live in an external identity service, and no `verifier63.yaml`. The right answer is EVIDENCE REQUIRED, many times, and no invented PASS.

Declared: aal=not declared, password_usage=not declared.

Drop this fixture into a Claude project together with the auditor folder and ask for the audit. The rows below are what the written procedures in `procedures/deterministic-checks.md` produce for the 24 procedural controls; the remaining 61 controls are semantic and depend on the supplied fragments (most will be EVIDENCE REQUIRED for a fixture this small).

| REQ | Expected status | Detection | Where | Why |
|---|---|---|---|---|
| COOK-01 | PASS | PROCEDURAL | src/auth.ts:5-11 | secure: true. |
| COOK-03 | PASS | PROCEDURAL | src/auth.ts:5-11 | httpOnly: true. |
| COOK-04 | PASS | PROCEDURAL | src/auth.ts:5-11 | No maxAge/expires: session cookie, discarded when the browser session ends. |
| COOK-06 | PASS | PROCEDURAL | src/auth.ts:5-11 | Cookie name: __Host-sid; path: "/". Requires the __Host- prefix and Path=/. |
| COOK-07 | PASS | PROCEDURAL | src/auth.ts:5-11 | sameSite: lax. |
| PWD-CHAR-01 | PASS | PROCEDURAL | see validator | No allowlist regex or whitespace stripping applied to the password in the supplied files. |
| PWD-CHAR-02 | PASS | PROCEDURAL | see validator | No ASCII-only allowlist applied to the password in the supplied files. |
| PWD-CHAR-04 | EVIDENCE REQUIRED | SEMANTIC (procedure could not settle it) | none supplied | No hashing path located; cannot establish whether normalization occurs before hashing. |
| PWD-COMP-01 | PASS | PROCEDURAL | see password validator | No character-class regex exists anywhere in the supplied files. |
| PWD-COMP-02 | PASS | PROCEDURAL | all supplied files | No password age, expiry, or rotation-interval logic located in the supplied files. |
| PWD-HASH-02 | EVIDENCE REQUIRED | SEMANTIC (procedure could not settle it) | none supplied | No password hashing or comparison call located in the supplied files; hashing may occur in a library or external service not supplied. |
| PWD-LEN-01 | EVIDENCE REQUIRED | PROCEDURAL | src/auth.ts:14 | password_usage not declared in verifier63.yaml; cannot determine whether the 15-character (single factor) or 8-character (part of MFA) minimum applies. Enforced minimum observed: 15. |
| PWD-LEN-02 | EVIDENCE REQUIRED | PROCEDURAL | src/auth.ts:14 | password_usage not declared in verifier63.yaml; cannot determine whether the 15-character (single factor) or 8-character (part of MFA) minimum applies. Enforced minimum observed: 15. |
| PWD-LEN-03 | PASS | PROCEDURAL | src/auth.ts:14 | Password validator located; no maximum-length restriction applied in the supplied files. |
| PWD-LEN-05 | EVIDENCE REQUIRED | SEMANTIC (procedure could not settle it) | none supplied | No hashing or comparison of the password located; cannot establish that the entire password is verified. |
| RATE-02 | EVIDENCE REQUIRED | SEMANTIC (procedure could not settle it) | none supplied | No per-account failed-attempt threshold located in the supplied files. Rate limiting may be implemented outside the supplied code. |
| REAUTH-02 | EVIDENCE REQUIRED | SEMANTIC (procedure could not settle it) | none supplied | No session lifetime configuration located in the supplied files. |
| REAUTH-03 | EVIDENCE REQUIRED | PROCEDURAL | verifier63.yaml | aal not declared; cannot select the applicable limit. |
| REAUTH-04 | EVIDENCE REQUIRED | PROCEDURAL | verifier63.yaml | aal not declared; cannot select the applicable limit. |
| REAUTH-05 | EVIDENCE REQUIRED | PROCEDURAL | verifier63.yaml | aal not declared; cannot select the applicable limit. |
| REAUTH-06 | EVIDENCE REQUIRED | PROCEDURAL | verifier63.yaml | aal not declared; cannot select the applicable limit. |
| REAUTH-07 | EVIDENCE REQUIRED | PROCEDURAL | verifier63.yaml | aal not declared; cannot select the applicable limit. |
| SESS-11 | EVIDENCE REQUIRED | SEMANTIC (procedure could not settle it) | src/auth.ts:5-11 | Session library configured (session({ name: "__Host-sid", secret: process.env.SESSION_SECRET as string, resave: false, saveUninitialized: false, coo) with no visible genid; its default id generator and length are library |
| SESS-17 | EVIDENCE REQUIRED | SEMANTIC (procedure could not settle it) | none supplied | No client-side code supplied; cannot establish where the session secret is stored on the endpoint. |
