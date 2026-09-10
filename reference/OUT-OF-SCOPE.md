# Out of scope - declared, not silently omitted

Verifier63 v1 audits only the sections reproduced in `sp800-63b-4-in-scope.md`. Everything below is
reported as OUT OF SCOPE in every audit. A PASS is never emitted for any of it.

## Sections of NIST SP 800-63B-4 not audited

| Section | Title | Why not in v1 |
|---|---|---|
| §1 | Introduction | Introductory; no verifier obligations |
| §1.2 | Document Structure | Document structure |
| §2 | Authentication Assurance Levels | AAL selection is an organizational decision; Verifier63 takes the AAL as a declared input |
| §2.1 | Authentication Assurance Level 1 | AAL definition |
| §2.1.1 | Permitted Authenticator Types | Permitted authenticator types (which authenticators, not how the password verifier behaves) |
| §2.1.2 | Authenticator and Verifier Requirements | Authenticator requirements at AAL1 beyond passwords; approved cryptography and FIPS 140 validation are infrastructure evidence |
| §2.2 | Authentication Assurance Level 2 | AAL definition |
| §2.2.1 | Permitted Authenticator Types | Permitted authenticator types |
| §2.2.2 | Authenticator and Verifier Requirements | Multi-factor authenticator requirements; outside password/session code |
| §2.3 | Authentication Assurance Level 3 | AAL definition |
| §2.3.1 | Permitted Authenticator Types | Permitted authenticator types |
| §2.3.2 | Authenticator and Verifier Requirements | Hardware cryptographic authenticator requirements |
| §2.4 | General Requirements | General organizational requirements |
| §2.4.1 | Security Controls | Security controls baseline (SP 800-53) is organizational |
| §2.4.2 | Records Retention Policy | Records retention policy |
| §2.4.3 | Privacy Requirements | Privacy requirements are organizational and legal, not code |
| §2.4.4 | Redress Requirements | Redress requirements are organizational |
| §3 | Authenticator and Verifier Requirements | Section introduction |
| §3.1 | Requirements by Authenticator Type | See §3 |
| §3.1.1 | Passwords | Password overview; descriptive |
| §3.1.1.1 | Password Authenticators | Subscriber-side password authenticator rules. Its two verifier-relevant sentences (blocklist rejection requires a different password; other composition requirements SHALL NOT be imposed) duplicate PWD-BLK-03 and PWD-COMP-01, which are audited from §3.1.1.2 |
| §3.1.2 | Look-Up Secrets | Look-up secrets: different authenticator type |
| §3.1.2.1 | Look-Up Secret Authenticators | See §3.1.2 |
| §3.1.2.2 | Look-Up Secret Verifiers | See §3.1.2 |
| §3.1.3 | Out-of-Band Devices | Out-of-band devices and SMS/PSTN: different authenticator type |
| §3.1.3.1 | Out-of-Band Authenticators | See §3.1.3 |
| §3.1.3.2 | Out-of-Band Verifiers | See §3.1.3 |
| §3.1.3.3 | Authentication Using the Public Switched Telephone Network | See §3.1.3 |
| §3.1.3.4 | Multi-Factor Out-of-Band Authenticators | See §3.1.3 |
| §3.1.4 | Single-Factor OTP | Single-factor OTP: different authenticator type |
| §3.1.4.1 | Single-Factor OTP Authenticators | See §3.1.4 |
| §3.1.4.2 | Single-Factor OTP Verifiers | See §3.1.4 |
| §3.1.5 | Multi-Factor OTPs | Multi-factor OTP: different authenticator type |
| §3.1.5.1 | Multi-Factor OTP Authenticators | See §3.1.5 |
| §3.1.5.2 | Multi-Factor OTP Verifiers | See §3.1.5 |
| §3.1.6 | Single-Factor Cryptographic Authentication | Single-factor cryptographic authenticators: different authenticator type |
| §3.1.6.1 | Single-Factor Cryptographic Authenticators | See §3.1.6 |
| §3.1.6.2 | Single-Factor Cryptographic Verifiers | See §3.1.6 |
| §3.1.7 | Multi-Factor Cryptographic Authentication | Multi-factor cryptographic authenticators, passkeys, wallets: different authenticator type |
| §3.1.7.1 | Multi-Factor Cryptographic Authenticators | See §3.1.7 |
| §3.1.7.2 | Multi-Factor Cryptographic Verifiers | See §3.1.7 |
| §3.1.7.3 | Usage With Subscriber-Controlled Wallets | See §3.1.7 |
| §3.1.7.4 | Syncable Authenticators | See §3.1.7 |
| §3.2 | General Authenticator Requirements | See §3 |
| §3.2.1 | Physical Authenticators | Physical authenticator handling |
| §3.2.3 | Use of Biometrics | Biometrics: sensor and matcher properties cannot be established from application code |
| §3.2.3.1 | Biometric Accuracy | See §3.2.3 |
| §3.2.3.2 | Presentation Attack Detection | See §3.2.3 |
| §3.2.3.3 | Injection Attack Detection | See §3.2.3 |
| §3.2.3.4 | Use of Biometric Samples | See §3.2.3 |
| §3.2.4 | Attestation | Attestation: authenticator hardware/provenance |
| §3.2.5 | Phishing Resistance | Phishing resistance: channel/verifier-name binding are cryptographic authenticator properties |
| §3.2.5.1 | Channel Binding | Channel binding |
| §3.2.5.2 | Verifier Name Binding | Verifier name binding |
| §3.2.6 | Verifier-CSP or IdP Communications | Verifier-to-CSP/IdP communications: infrastructure |
| §3.2.7 | Replay Resistance | Replay resistance: authenticator property |
| §3.2.8 | Authentication Intent | Authentication intent: authenticator property |
| §3.2.9 | Restricted Authenticators | Restricted authenticators (PSTN): organizational risk acceptance |
| §3.2.10 | Activation Secrets | Activation secrets for multi-factor authenticators |
| §3.2.11 | Connected Authenticators | Connected authenticators (wired/wireless/hybrid): hardware |
| §3.2.11.1 | Wired Connections | See §3.2.11 |
| §3.2.11.2 | Wireless Connections | See §3.2.11 |
| §3.2.11.3 | Hybrid Connections | See §3.2.11 |
| §3.2.13 | Exportability | Key exportability: hardware/OS property |
| §4 | Authenticator Event Management | Section introduction |
| §4.1 | Authenticator Binding | Authenticator binding and enrollment: identity lifecycle, not the password verifier or session code (v2 candidate) |
| §4.1.1 | Binding at Enrollment | See §4.1 |
| §4.1.2 | Post-Enrollment Binding | See §4.1 |
| §4.1.2.1 | Binding an Additional Authenticator | See §4.1.2 |
| §4.1.2.2 | Binding Across Endpoints | See §4.1.2 |
| §4.1.3 | Binding to a Subscriber-Provided Authenticator | See §4.1 |
| §4.1.4 | Renewal | See §4.1 |
| §4.2 | Account Recovery | Account recovery: v2 candidate; mostly semantic and touches identity proofing (SP 800-63A) |
| §4.2.1 | Account Recovery Methods | See §4.2 |
| §4.2.1.1 | Saved Recovery Codes | See §4.2.1 |
| §4.2.1.2 | Issued Recovery Codes | See §4.2.1 |
| §4.2.1.3 | Recovery Contacts | See §4.2.1 |
| §4.2.1.4 | Repeated Identity Proofing | See §4.2.1 |
| §4.2.2 | Recovery Requirements by IAL/AAL | See §4.2 |
| §4.2.2.1 | Recovery Without Identity Proofing | See §4.2.2 |
| §4.2.2.2 | Recovery at AAL2 | See §4.2.2 |
| §4.2.2.3 | Recovery at AAL3 | See §4.2.2 |
| §4.2.3 | Account Recovery Notification | See §4.2 |
| §4.3 | Loss, Theft, Damage, and Compromise | Loss, theft, damage, compromise: identity lifecycle |
| §4.4 | Expiration | Authenticator expiration: identity lifecycle |
| §4.5 | Invalidation | Invalidation: identity lifecycle |
| §4.6 | Account Notifications | Account notifications: v2 candidate |
| §5 | Session Management | Section introduction |
| §5.1.2 | Access Tokens | Access tokens (OAuth-style): different session technology; v2 candidate |
| §5.3 | Session Monitoring | Session monitoring and anomalous session detection: risk-based, organizational; contains privacy SHALL statements not audited here |
| §6 | Threats and Security Considerations | Threats and security considerations: excluded because these are threat-model and organizational considerations outside a code/config audit. Exclusion does not imply the section is non-normative |
| §6.1 | Authenticator Threats | See §6 |
| §6.2 | Threat Mitigation Strategies | See §6 |
| §6.3 | Authenticator Recovery | See §6 |
| §6.4 | Session Attacks | See §6 |
| §7 | Privacy Considerations | Privacy considerations: excluded because privacy risk assessment and controls are organizational/legal. Exclusion does not imply the section is non-normative; it contains SHALL statements |
| §7.1 | Privacy Risk Assessment | See §7 |
| §7.2 | Privacy Controls | See §7 |
| §7.3 | Use Limitation | See §7 |
| §7.4 | Agency-Specific Privacy Compliance | See §7 |
| §8 | Customer Experience Considerations | Customer experience and usability considerations: outside a code/config audit. Exclusion does not imply the section is non-normative |
| §8.1 | Usability | See §8 |
| §8.1.1 | Common Usability Considerations for Authenticators | See §8.1 |
| §8.1.2 | Usability Considerations by Authenticator Type | See §8.1 |
| §8.1.2.1 | Passwords | See §8.1.2 |
| §8.1.2.2 | Look-Up Secrets | See §8.1.2 |
| §8.1.2.3 | Out-of-Band | See §8.1.2 |
| §8.1.2.4 | Single-Factor OTP | See §8.1.2 |
| §8.1.2.5 | Multi-Factor OTP | See §8.1.2 |
| §8.1.2.6 | Single-Factor Cryptographic Authenticator | See §8.1.2 |
| §8.1.2.7 | Multi-Factor Cryptographic Authenticator | See §8.1.2 |
| §8.1.3 | Summary of Usability Considerations | See §8.1 |
| §8.1.4 | Usability Considerations for Biometrics | See §8.1 |
| §8.2 | Customer Success Considerations | See §8 |
| Appendix B | Syncable Authenticators | Passkey / syncable authenticator topic; different authenticator type |
| Appendix B.1 | Introduction | See Appendix B |
| Appendix B.2 | Cloning Authentication Keys | See Appendix B |
| Appendix B.3 | Implementation Requirements | See Appendix B |
| Appendix B.4 | Sharing | See Appendix B |
| Appendix B.5 | Example | See Appendix B |
| Appendix B.6 | Security Considerations | See Appendix B |
| Unnumbered | List of Symbols, Abbreviations, and Acronyms | Back matter |
| Unnumbered | Glossary | Back matter |
| Unnumbered | Change Log | Back matter |

## Included supporting sections, not independently audited

These are reproduced in `sp800-63b-4-in-scope.md` because in-scope controls depend on them. They carry no controls of their own.

| Section | Title | Role |
|---|---|---|
| §1.1 | Notations | Defines SHALL / SHOULD / MAY; source of every control's normative level |
| §3.2.12 | Random Values | Normative supporting dependency; audited only through PWD-HASH-12 and SESS-11, which incorporate it by reference |
| Appendix A (A.1 to A.5) | Strength of Passwords | Informative; rationale behind the composition-rule, length and blocklist controls |

## Normative statements mapped to an existing control

These sentences carry SHALL / SHOULD language but state an obligation already scored under another control. They are declared here so no in-scope SHALL is silently dropped, and not counted twice.

| Section | Statement | Canonical control |
|---|---|---|
| §2.1.3 | "Periodic reauthentication of subscriber sessions SHALL be performed, as described in Sec. 5.2." | REAUTH-01 (quoted from §5.2) |
| §2.2.3 | "Periodic reauthentication of subscriber sessions SHALL be performed, as described in Sec. 5.2." | REAUTH-01 |
| §2.3.3 | "Periodic reauthentication of subscriber sessions SHALL be performed, as described in Sec. 5.2." | REAUTH-01 |
| §2.1.3 | "A definite reauthentication overall timeout SHALL be established" | REAUTH-02 (quoted from §2.2.3; same sentence in §2.1.3) |
| §3.1.1.1 | "the subscriber SHALL be required to choose a different password" (blocklist hit) | PWD-BLK-03 |
| §3.1.1.1 | "Other composition requirements for passwords SHALL NOT be imposed." | PWD-COMP-01 |
| §3.2.2 | "the verifier SHALL implement controls to protect against online guessing attacks" | RATE-01 (quoted from §3.1.1.2) and RATE-02 |
| §3.2.2 | "Following successful authentication at a given AAL, the verifier SHOULD reset the retry count of the authenticators that were used." | RATE-05 (same observable retry-count-reset obligation as "disregard any previous failed attempts") |

## Statements inside in-scope sections that are not controls

One control per normative obligation. The following sentences from reproduced sections are not controls, and why.

| Section | Statement | Why not a control |
|---|---|---|
| §2.1.3 | "An inactivity timeout MAY be applied but is not required at AAL1." | MAY: permissive, never a PASS/FAIL control |
| §2.2.3 | "the verifier MAY allow the subscriber to reauthenticate using only a successful password or biometric comparison in conjunction with the session secret" | MAY |
| §2.3.3 | "AAL3 reauthentication requirements are the same as for initial authentication at AAL3." | Descriptive; AAL3 authenticator requirements (§2.3.2) are out of scope |
| §3.1.1.2 | "Verifiers MAY make limited allowances for mistyping" | MAY |
| §3.1.1.2 | "The verifier MAY also permit the claimant’s device to display individual entered characters" | MAY |
| §3.2.2 | "agencies MAY impose lower limits" / "Additional techniques MAY be used" | MAY |
| §3.2.2 | "If the subscriber cannot authenticate at the required AAL, the account recovery procedures in Sec. 4.2 SHALL be used." | Account recovery (§4.2) is out of scope in v1 |
| §5.1 | "Session secrets used with such proof of possession techniques MAY persist." | MAY |
| §5.1 | "A session MAY be considered at a lower AAL than the authentication event" | MAY half of the sentence; the SHALL NOT half is SESS-09 |
| §5.2 | "the RP MAY alert the subscriber that the session is about to be terminated" | MAY |
| §5.2 | "The limits MAY also be extended when higher security session maintenance technologies ... are used." | MAY |
| §5.2 | "Agencies SHALL establish and document the inactivity and overall time limits being enforced in a system security plan" | Organizational documentation obligation; cannot be established from code. Declared, not passed |
| §5.2 | "the RP SHALL be authoritative as to whether the reauthentication requirements have been met" | Applies to federated authentication (SP 800-63C); federation is out of scope in v1 |

## Other declared limits

- MECHANICAL detection is implemented for TypeScript only. Other languages receive SEMANTIC findings only.
- Infrastructure outside the supplied files (TLS termination, WAF or proxy rate limiting, IdP, HSM, key provisioning) is reported as EVIDENCE REQUIRED, never inferred.
- The AAL and the password usage mode are declared inputs (`verifier63.yaml`). When absent, every control that depends on them is EVIDENCE REQUIRED.
- Conditional controls: when a control's factual condition is false (e.g. no keyed-hash step is implemented, so PWD-HASH-12 to 14 have nothing to apply to) the status is NOT APPLICABLE, never PASS. When the condition cannot be established from the supplied evidence, the status is EVIDENCE REQUIRED.
