# Citation index

One row per control. Open `sp800-63b-4-in-scope.md` at the line shown and the quoted words are there, verbatim, under the heading for that section. Then open `NIST.SP.800-63B-4.pdf` at the same section and read the same sentence. No tool needed.

Every control in `requirements.json` appears here; a control that could not be located would be listed as MISSING (none are).

| REQ | Section | Line in extract | Level | Quote |
|---|---|---|---|---|
| PWD-LEN-01 | §3.1.1.2 | 53 | SHALL | Verifiers and CSPs SHALL require passwords that are used as a single-factor authentication mechanism to be a minimum of 15 characters in length. |
| PWD-LEN-02 | §3.1.1.2 | 53 | SHALL | Verifiers and CSPs MAY allow passwords that are only used as part of multi-factor authentication processes to be shorter but SHALL require them to be a minimum of eight characters in length. |
| PWD-LEN-03 | §3.1.1.2 | 54 | SHOULD | Verifiers and CSPs SHOULD permit a maximum password length of at least 64 characters. |
| PWD-LEN-04 | §3.1.1.2 | 61 | SHALL | Verifiers SHALL request the password to be provided in full (not a subset of it) |
| PWD-LEN-05 | §3.1.1.2 | 61 | SHALL | SHALL verify the entire submitted password (e.g., not truncate it). |
| PWD-CHAR-01 | §3.1.1.2 | 55 | SHOULD | Verifiers and CSPs SHOULD accept all printing ASCII [RFC20] characters and the space character in passwords. |
| PWD-CHAR-02 | §3.1.1.2 | 56 | SHOULD | Verifiers and CSPs SHOULD accept Unicode [ISO/ISC 10646] characters in passwords. |
| PWD-CHAR-03 | §3.1.1.2 | 56 | SHALL | Each Unicode code point SHALL be counted as a single character when evaluating password length. |
| PWD-CHAR-04 | §3.1.1.2 | 63 | SHOULD | If Unicode characters are accepted in passwords, the verifier SHOULD apply the normalization process for stabilized strings using the Normalization Form Canonical Composition (NFC) normalization |
| PWD-CHAR-05 | §3.1.1.2 | 63 | SHOULD | Subscribers choosing passwords that contain Unicode characters SHOULD be advised that some endpoints may represent some characters differently |
| PWD-BLK-01 | §3.1.1.2 | 65 | SHALL | When processing a request to establish or change a password, verifiers SHALL compare the prospective secret against a blocklist that contains known commonly used, expected, or compromised passwords. |
| PWD-BLK-02 | §3.1.1.2 | 65 | SHALL | The entire password SHALL be subject to comparison, not substrings or words that might be contained therein. |
| PWD-BLK-03 | §3.1.1.2 | 71 | SHALL | If the chosen password is found on the blocklist, the CSP SHALL require the subscriber to select a different secret |
| PWD-BLK-04 | §3.1.1.2 | 71 | SHALL | and SHALL provide the reason for rejection. |
| PWD-BLK-05 | §3.1.1.2 | 71 | SHOULD | the blocklist SHOULD be of sufficient size to prevent subscribers from choosing passwords that attackers are likely to guess before reaching the attempt limit. |
| PWD-BLK-06 | §3.1.1.2 | 75 | SHALL | Verifiers SHALL offer guidance to the subscriber to help the subscriber choose a strong password. |
| PWD-COMP-01 | §3.1.1.2 | 57 | SHALL NOT | Verifiers and CSPs SHALL NOT impose other composition rules (e.g., requiring mixtures of different character types) for passwords. |
| PWD-COMP-02 | §3.1.1.2 | 58 | SHALL NOT | Verifiers and CSPs SHALL NOT require subscribers to change passwords periodically. |
| PWD-COMP-03 | §3.1.1.2 | 58 | SHALL | However, verifiers SHALL force a change if there is evidence that the authenticator has been compromised. |
| PWD-COMP-04 | §3.1.1.2 | 59 | SHALL NOT | Verifiers and CSPs SHALL NOT permit the subscriber to store a hint (e.g., a reminder of how the password was created) that is accessible to an unauthenticated claimant. |
| PWD-COMP-05 | §3.1.1.2 | 60 | SHALL NOT | Verifiers and CSPs SHALL NOT prompt subscribers to use knowledge-based authentication (KBA) (e.g., “What was the name of your first pet?”) or security questions when choosing passwords. |
| PWD-UX-01 | §3.1.1.2 | 79 | SHALL | Verifiers SHALL allow the use of password managers and autofill functionality. |
| PWD-UX-02 | §3.1.1.2 | 79 | SHOULD | Verifiers SHOULD permit claimants to use the “paste” function when entering a password |
| PWD-UX-03 | §3.1.1.2 | 81 | SHOULD | the verifier SHOULD offer an option to display the password — rather than a series of dots or asterisks — while it is entered and until it is submitted to the verifier. |
| PWD-CHAN-01 | §3.1.1.2 | 85 | SHALL | Verifiers and CSPs SHALL use approved encryption and an authenticated protected channel when requesting passwords. |
| PWD-HASH-01 | §3.1.1.2 | 87 | SHALL | Verifiers SHALL store passwords in a form that is resistant to offline attacks. |
| PWD-HASH-02 | §3.1.1.2 | 87 | SHALL | Passwords SHALL be salted and hashed using a suitable password hashing scheme. |
| PWD-HASH-03 | §3.1.1.2 | 87 | SHOULD | The chosen cost factor SHOULD be as high as practical without negatively impacting verifier performance. |
| PWD-HASH-04 | §3.1.1.2 | 87 | SHOULD | It SHOULD be increased over time to account for increases in computing performance. |
| PWD-HASH-05 | §3.1.1.2 | 87 | SHOULD | An approved password hashing scheme published in the latest revision of [SP800-132] or updated NIST guidelines on password hashing schemes SHOULD be used. |
| PWD-HASH-06 | §3.1.1.2 | 87 | SHOULD | The chosen output length of the password verifier, excluding the salt and versioning information, SHOULD be the same as the length of the underlying password hashing scheme output. |
| PWD-HASH-07 | §3.1.1.2 | 89 | SHALL | The salt SHALL be at least 32 bits in length |
| PWD-HASH-08 | §3.1.1.2 | 89 | SHALL | and chosen to minimize salt value collisions among stored hashes (i.e., to prevent multiple subscriber accounts from having the same hashed password). |
| PWD-HASH-09 | §3.1.1.2 | 89 | SHALL | Both the salt value and the resulting hash SHALL be stored for each password. |
| PWD-HASH-10 | §3.1.1.2 | 89 | SHOULD | A reference to the password hashing scheme used, including the cost factor, SHOULD be stored for each password to allow migration to new algorithms and work factors. |
| PWD-HASH-11 | §3.1.1.2 | 91 | SHOULD | In addition, verifiers SHOULD perform an additional iteration of a keyed hashing or encryption operation using a secret key known only to the verifier. |
| PWD-HASH-12 | §3.1.1.2 | 91 | SHALL | If used, this key value SHALL be generated by an approved random bit generator, as described in Sec. 3.2.12. |
| PWD-HASH-13 | §3.1.1.2 | 91 | SHALL | The secret key value SHALL be stored separately from the hashed passwords. |
| PWD-HASH-14 | §3.1.1.2 | 91 | SHOULD | It SHOULD be stored and used within a hardware-protected area, such as a hardware security module or trusted execution environment (TEE) |
| RATE-01 | §3.1.1.2 | 77 | SHALL | Verifiers SHALL implement a rate-limiting mechanism that effectively limits the number of failed authentication attempts that can be made on the subscriber account, as described in Sec. 3.2.2. |
| RATE-02 | §3.2.2 | 97 | SHALL | the verifier SHALL limit consecutive failed authentication attempts using a specific authenticator on a single subscriber account to no more than 100 by disabling that authenticator. |
| RATE-03 | §3.2.2 | 97 | SHALL | If more than one authenticator is involved with an excessive number of authentication attempts (e.g., single-factor cryptographic authenticator and centrally verified password), both authenticators SHALL be disabled. |
| RATE-04 | §3.2.2 | 97 | SHALL | Authenticators that have been disabled SHALL be required to rebind to the subscriber account, as described in Sec. 4.1, to be usable in the future. |
| RATE-05 | §3.2.2 | 107 | SHOULD | When the subscriber successfully authenticates, the verifier SHOULD disregard any previous failed attempts for the authenticators used in the successful authentication. |
| RATE-06 | §3.2.2 | 109 | SHALL | If this is provided, the maximum AAL of the authenticator being reset SHALL not exceed the AAL of the session from which it is being reset. |
| SESS-01 | §5.1 | 121 | SHALL | A session secret SHALL be shared between the subscriber’s software and the accessed service. |
| SESS-02 | §5.1 | 121 | SHALL | The secret SHALL be directly presented by the subscriber’s software, or possession of the secret SHALL be proven using a cryptographic mechanism. |
| SESS-03 | §5.1 | 123 | SHALL | The continuity of authenticated sessions SHALL be based on the possession of a session secret that is issued by the session host at the time of authentication and optionally refreshed during the session. |
| SESS-04 | §5.1 | 128 | SHOULD NOT | Session secrets that are used as bearer tokens for session management SHOULD NOT be persistent (i.e., retained across a restart of the associated application or a reboot of the host device) |
| SESS-05 | §5.1 | 128 | SHALL NOT | Cookies and similar “remember my browser” features SHALL NOT be used instead of authentication except as provided for reauthentication at AAL2 in Sec. 2.2.3 when the inactivity limit has been exceeded but the time limit has not. |
| SESS-06 | §5.1 | 130 | SHALL | However, RPs and CSPs SHALL ensure that the session lifetime limits described in Sec. 2.2.3 are enforced even when a knowledge of the session secret is demonstrated. |
| SESS-07 | §5.1 | 132 | SHALL | The secret used for session binding SHALL be generated by the session host in direct response to an authentication event. |
| SESS-08 | §5.1 | 132 | SHOULD | A session SHOULD inherit the AAL properties of the authentication event that triggered its creation. |
| SESS-09 | §5.1 | 132 | SHALL NOT | A session MAY be considered at a lower AAL than the authentication event but SHALL NOT be considered at a higher AAL than the authentication event. |
| SESS-10 | §5.1 | 136 | SHALL | Secrets are established during or immediately following authentication. |
| SESS-11 | §5.1 | 137 | SHALL | Secrets are established using input from an approved random bit generator, as described in Sec. 3.2.12, and are at least 64 bits in length. |
| SESS-12 | §5.1 | 138 | SHALL | Secrets are erased or invalidated by the session subject when the subscriber logs out. |
| SESS-13 | §5.1 | 139 | SHALL | Secrets are either transferred from the session host to the RP or CSP via an authenticated protected channel or derived from keys that are established as part of establishing a valid, mutually authenticated protected channel. |
| SESS-14 | §5.1 | 140 | SHALL | Secrets will time out and are not accepted after the times specified in Sec. 2.1.3, Sec. 2.2.3, and Sec. 2.3.3, as appropriate for the AAL. |
| SESS-15 | §5.1 | 141 | SHALL | Secrets are unavailable to intermediaries between the host and the subscriber’s endpoint. |
| SESS-16 | §5.1 | 143 | SHOULD | the secrets used for session binding SHOULD be erased on the subscriber endpoint when they log out or when the secret is deemed to have expired. |
| SESS-17 | §5.1 | 143 | SHOULD NOT | They SHOULD NOT be placed in insecure locations (e.g., HTML5 Local Storage) due to the potential exposure of local storage to cross-site scripting (XSS) attacks. |
| SESS-18 | §5.1 | 145 | SHALL NOT | Following authentication, authenticated sessions SHALL NOT fall back to an insecure transport (e.g., from https to http). |
| SESS-19 | §5.1 | 147 | SHALL | POST/PUT content SHALL contain a session identifier |
| SESS-20 | §5.1 | 147 | SHALL | that the RP SHALL verify to protect against cross-site request forgery (CSRF). |
| SESS-21 | §5.1 | 151 | SHOULD | Sessions SHOULD provide a readily accessible mechanism for subscribers to terminate (i.e., log off) their session when their interaction is complete. |
| COOK-01 | §5.1.1 | 161 | SHALL | SHALL be tagged to be accessible only on secure (i.e., HTTPS) sessions. |
| COOK-02 | §5.1.1 | 162 | SHALL | SHALL be accessible to the minimum practical hostnames and paths. |
| COOK-03 | §5.1.1 | 163 | SHOULD | SHOULD be tagged as inaccessible via JavaScript (i.e., HttpOnly). |
| COOK-04 | §5.1.1 | 164 | SHOULD | SHOULD be tagged to expire at or soon after the session’s validity period. |
| COOK-05 | §5.1.1 | 164 | SHALL NOT | This requirement is intended to limit the accumulation of cookies but SHALL NOT be relied upon to enforce session timeouts. |
| COOK-06 | §5.1.1 | 165 | SHOULD | SHOULD have the “__Host-“ prefix and set “Path=/”. |
| COOK-07 | §5.1.1 | 166 | SHOULD | SHOULD set “SameSite=Lax” or “SameSite=Strict”. |
| COOK-08 | §5.1.1 | 167 | SHOULD | SHOULD contain only an opaque string (e.g., a session identifier) |
| COOK-09 | §5.1.1 | 167 | SHALL NOT | and SHALL NOT contain cleartext personal information. |
| REAUTH-01 | §5.2 | 173 | SHALL | The periodic reauthentication of sessions SHALL be performed to confirm the subscriber’s continued presence at an authenticated session |
| REAUTH-02 | §2.2.3 | 33 | SHALL | A definite reauthentication overall timeout SHALL be established |
| REAUTH-03 | §2.1.3 | 33 | SHOULD | which SHOULD be no more than 30 days at AAL1. |
| REAUTH-04 | §2.2.3 | 39 | SHOULD | which SHOULD be no more than 24 hours at AAL2. |
| REAUTH-05 | §2.2.3 | 39 | SHOULD | The inactivity timeout SHOULD be no more than 1 hour. |
| REAUTH-06 | §2.3.3 | 45 | SHALL | At AAL3, the overall timeout for reauthentication SHALL be no more than 12 hours. |
| REAUTH-07 | §2.3.3 | 45 | SHOULD | The inactivity timeout SHOULD be no more than 15 minutes. |
| REAUTH-08 | §5.2 | 175 | SHALL | When either timeout expires, the session SHALL be terminated. |
| REAUTH-09 | §5.2 | 175 | SHALL | Session activity SHALL reset the inactivity timeout |
| REAUTH-10 | §5.2 | 175 | SHALL | successful reauthentication during a session SHALL reset both timeouts. |
