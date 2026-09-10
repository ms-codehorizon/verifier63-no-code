# NIST SP 800-63B-4 - In-Scope Sections (verbatim)

Verbatim reproduction of the sections of NIST SP 800-63B-4 that Verifier63 audits against.
Text taken from the NIST HTML edition and cross-checked against the PDF of record; see PROVENANCE.md.
Inline emphasis (**SHALL**, *italics*) preserved from the source. Section numbers follow the official table of contents.
Cross-reference links are rendered as their link text; footnote markers are dropped. Nothing has been summarized, reordered, or omitted within a reproduced section.

Sections reproduced: §1.1, §2.1.3, §2.2.3, §2.3.3, §3.1.1.2, §3.2.2, §3.2.12, §5.1, §5.1.1, §5.2, §A, §A.1, §A.2, §A.3, §A.4, §A.5

---

## §1.1 Notations

*Role in Verifier63: SUPPORTING (normative notation). Source of the SHALL / SHOULD levels; not independently audited.*

This guideline uses the following typographical conventions in text:

- Specific terms in **CAPITALS** represent normative requirements. When these same terms are not in **CAPITALS**, the term does not represent a normative requirement.
- The terms “**SHALL**” and “**SHALL NOT**” indicate requirements to be followed strictly in order to conform to the publication and from which no deviation is permitted.
- The terms “**SHOULD**” and “**SHOULD NOT**” indicate that among several possibilities, one is recommended as particularly suitable without mentioning or excluding others, that a certain course of action is preferred but not necessarily required, or that (in the negative form) a certain possibility or course of action is discouraged but not prohibited.
- The terms “**MAY**” and “**NEED NOT**” indicate a course of action permissible within the limits of the publication.
- The terms “**CAN**” and “**CANNOT**” indicate a possibility and capability — whether material, physical, or causal — or, in the negative, the absence of that possibility or capability.

## §2.1.3 Reauthentication

*Role in Verifier63: IN SCOPE (audited).*

These guidelines provide for two types of timeouts, which are further described in Sec. 5.2:

1. An overall timeout limits the duration of an authenticated session to a specified period following authentication or a previous reauthentication.
2. An inactivity timeout terminates a session that has not had activity from the subscriber for a specified period.

Periodic reauthentication of subscriber sessions **SHALL** be performed, as described in Sec. 5.2. A definite reauthentication overall timeout **SHALL** be established, which **SHOULD** be no more than 30 days at AAL1. An inactivity timeout **MAY** be applied but is not required at AAL1.

## §2.2.3 Reauthentication

*Role in Verifier63: IN SCOPE (audited).*

Periodic reauthentication of subscriber sessions **SHALL** be performed, as described in Sec. 5.2. A definite reauthentication overall timeout **SHALL** be established, which **SHOULD** be no more than 24 hours at AAL2. The inactivity timeout **SHOULD** be no more than 1 hour. When the inactivity timeout has occurred but the overall timeout has not yet occurred, the verifier **MAY** allow the subscriber to reauthenticate using only a successful password or biometric comparison in conjunction with the *session secret*, as described in Sec. 5.1.

## §2.3.3 Reauthentication

*Role in Verifier63: IN SCOPE (audited).*

Periodic reauthentication of subscriber sessions **SHALL** be performed, as described in Sec. 5.2. At AAL3, the overall timeout for reauthentication **SHALL** be no more than 12 hours. The inactivity timeout **SHOULD** be no more than 15 minutes. Unlike AAL2, AAL3 reauthentication requirements are the same as for initial authentication at AAL3.

## §3.1.1.2 Password Verifiers

*Role in Verifier63: IN SCOPE (audited).*

The following requirements apply to passwords.

1. Verifiers and CSPs **SHALL** require passwords that are used as a single-factor authentication mechanism to be a minimum of 15 characters in length. Verifiers and CSPs **MAY** allow passwords that are only used as part of multi-factor authentication processes to be shorter but **SHALL** require them to be a minimum of eight characters in length.
2. Verifiers and CSPs **SHOULD** permit a maximum password length of at least 64 characters.
3. Verifiers and CSPs **SHOULD** accept all printing ASCII [RFC20] characters and the space character in passwords.
4. Verifiers and CSPs **SHOULD** accept Unicode [ISO/ISC 10646] characters in passwords. Each Unicode code point **SHALL** be counted as a single character when evaluating password length.
5. Verifiers and CSPs **SHALL NOT** impose other composition rules (e.g., requiring mixtures of different character types) for passwords.
6. Verifiers and CSPs **SHALL NOT** require subscribers to change passwords periodically. However, verifiers **SHALL** force a change if there is evidence that the authenticator has been compromised.
7. Verifiers and CSPs **SHALL NOT** permit the subscriber to store a hint (e.g., a reminder of how the password was created) that is accessible to an unauthenticated claimant.
8. Verifiers and CSPs **SHALL NOT** prompt subscribers to use knowledge-based authentication (KBA) (e.g., “What was the name of your first pet?”) or security questions when choosing passwords.
9. Verifiers **SHALL** request the password to be provided in full (not a subset of it) and **SHALL** verify the entire submitted password (e.g., not truncate it).

If Unicode characters are accepted in passwords, the verifier **SHOULD** apply the normalization process for stabilized strings using the Normalization Form Canonical Composition (NFC) normalization defined in Sec. 12.1 of *Unicode Normalization Forms* [UAX15]. This process is applied before hashing the byte string that represents the password. Subscribers choosing passwords that contain Unicode characters **SHOULD** be advised that some endpoints may represent some characters differently, which would affect their ability to authenticate successfully.

When processing a request to establish or change a password, verifiers **SHALL** compare the prospective secret against a blocklist that contains known commonly used, expected, or compromised passwords. The entire password **SHALL** be subject to comparison, not substrings or words that might be contained therein. For example, the list may include:

- Passwords obtained from previous breach corpuses
- Dictionary words
- Context-specific words, such as the name of the service, the username, and derivatives thereof

If the chosen password is found on the blocklist, the CSP **SHALL** require the subscriber to select a different secret and **SHALL** provide the reason for rejection. Since the blocklist is used to defend against brute-force attacks and unsuccessful attempts are rate-limited, the blocklist **SHOULD** be of sufficient size to prevent subscribers from choosing passwords that attackers are likely to guess before reaching the attempt limit.

> Excessively large blocklists are of little incremental security benefit because the blocklist is used to defend against online attacks, which are already limited by the throttling requirements described in Sec. 3.2.2.

Verifiers **SHALL** offer guidance to the subscriber to help the subscriber choose a strong password. This is particularly important following the rejection of a password on the blocklist as it discourages trivial modifications of listed weak passwords [Blocklists].

Verifiers **SHALL** implement a rate-limiting mechanism that effectively limits the number of failed authentication attempts that can be made on the subscriber account, as described in Sec. 3.2.2.

Verifiers **SHALL** allow the use of password managers and autofill functionality. Verifiers **SHOULD** permit claimants to use the “paste” function when entering a password to facilitate password manager use when password autofill APIs are unavailable. Password managers have been shown to increase the likelihood that subscribers will choose stronger passwords, particularly if the password managers include password generators [Managers].

To help the claimant successfully enter a password, the verifier **SHOULD** offer an option to display the password — rather than a series of dots or asterisks — while it is entered and until it is submitted to the verifier. This allows the claimant to confirm their entry if they are in a location where their screen is unlikely to be observed. The verifier **MAY** also permit the claimant’s device to display individual entered characters for a short time after each character is typed to verify the correct entry. This is common on mobile devices.

Verifiers **MAY** make limited allowances for mistyping (e.g., removing leading and trailing whitespace characters before verification, allowing the verification of passwords with differing cases for the leading character) if the password remains at least the required minimum length after such processing and the complexity of the resulting password is not significantly reduced.

Verifiers and CSPs **SHALL** use approved encryption and an authenticated protected channel when requesting passwords.

Verifiers **SHALL** store passwords in a form that is resistant to offline attacks. Passwords **SHALL** be *salted* and hashed using a suitable password hashing scheme. Password hashing schemes take a password, a salt, and a cost factor as inputs and generate a password hash. Their purpose is to make each password guess more expensive for an attacker who has obtained a hashed password file, thereby making the cost of a guessing attack high or prohibitive. The chosen cost factor **SHOULD** be as high as practical without negatively impacting verifier performance. It **SHOULD** be increased over time to account for increases in computing performance. An approved password hashing scheme published in the latest revision of [SP800-132] or updated NIST guidelines on password hashing schemes **SHOULD** be used. The chosen output length of the password verifier, excluding the salt and versioning information, **SHOULD** be the same as the length of the underlying password hashing scheme output.

The salt **SHALL** be at least 32 bits in length and chosen to minimize salt value collisions among stored hashes (i.e., to prevent multiple subscriber accounts from having the same hashed password). Both the salt value and the resulting hash **SHALL** be stored for each password. A reference to the password hashing scheme used, including the cost factor, **SHOULD** be stored for each password to allow migration to new algorithms and work factors.

In addition, verifiers **SHOULD** perform an additional iteration of a keyed hashing or encryption operation using a secret key known only to the verifier. If used, this key value **SHALL** be generated by an approved random bit generator, as described in Sec. 3.2.12. The secret key value **SHALL** be stored separately from the hashed passwords. It **SHOULD** be stored and used within a hardware-protected area, such as a hardware security module or trusted execution environment (TEE), such as a trusted platform module (TPM). With this additional iteration, brute-force attacks on the hashed passwords are impractical as long as the secret key value remains secret.

## §3.2.2 Rate Limiting (Throttling)

*Role in Verifier63: IN SCOPE (audited).*

When required by the authenticator type descriptions in Sec. 3.1, the verifier **SHALL** implement controls to protect against *online guessing attacks*. Unless otherwise specified in the description of a given authenticator, the verifier **SHALL** limit consecutive failed authentication attempts using a specific authenticator on a single subscriber account to no more than 100 by disabling that authenticator. If more than one authenticator is involved with an excessive number of authentication attempts (e.g., single-factor cryptographic authenticator and centrally verified password), both authenticators **SHALL** be disabled. Authenticators that have been disabled **SHALL** be required to rebind to the subscriber account, as described in Sec. 4.1, to be usable in the future.

> The limit of 100 attempts is an upper bound, and agencies **MAY** impose lower limits. The limit of 100 was chosen to balance the likelihood of a correct guess (e.g., 100 attempts against a six-digit decimal OTP authenticator output) versus the potential need for account recovery when the limit is exceeded.

Additional techniques **MAY** be used to reduce the likelihood that an attacker will lock the legitimate claimant out due to rate limiting. These include:

- Requiring the claimant to complete a bot detection and mitigation challenge before attempting authentication
- Requiring the claimant to wait after a failed attempt for a period of time that increases as the subscriber account approaches its maximum allowance for consecutive failed attempts (e.g., 30 seconds up to an hour)
- Leveraging other risk-based or adaptive authentication techniques to identify claimant behaviors that fall within or outside of typical norms (e.g., the use of the claimant’s IP address, geolocation, timing of request patterns, or browser metadata)

When the subscriber successfully authenticates, the verifier **SHOULD** disregard any previous failed attempts for the authenticators used in the successful authentication.

Following successful authentication at a given AAL, the verifier **SHOULD** reset the retry count of the authenticators that were used. If this is provided, the maximum AAL of the authenticator being reset **SHALL** not exceed the AAL of the session from which it is being reset. If the subscriber cannot authenticate at the required AAL, the account recovery procedures in Sec. 4.2 **SHALL** be used.

## §3.2.12 Random Values

*Role in Verifier63: SUPPORTING DEPENDENCY (normative). Not independently audited except where an in-scope provision incorporates it.*

Random values are extensively used in authentication processes in a variety of roles (e.g., nonces, authentication secrets). Unless otherwise specified, random values that reference this section **SHALL** be generated by an approved random bit generator [RBG] that provides at least the minimum security strength specified in the latest revision of [SP800-131A] (i.e., 112 bits as of the date of this publication).

## §5.1 Session Bindings

*Role in Verifier63: IN SCOPE (audited).*

A session occurs between the software (i.e., the session subject) that a subscriber is running (e.g., browser, application, operating system) and the RP or CSP that the subscriber is accessing (i.e., the session host). A session secret **SHALL** be shared between the subscriber’s software and the accessed service. This secret binds the two ends of the session and allows the subscriber to continue using the service over time. The secret **SHALL** be directly presented by the subscriber’s software, or possession of the secret **SHALL** be proven using a cryptographic mechanism.

The continuity of authenticated sessions **SHALL** be based on the possession of a session secret that is issued by the session host at the time of authentication and optionally refreshed during the session. The nature of a session depends on the application, such as:

- A web browser session with a “session” cookie
- An instance of a mobile application that retains a session secret

Session secrets that are used as bearer tokens for session management **SHOULD NOT** be persistent (i.e., retained across a restart of the associated application or a reboot of the host device) because they are tied to specific sessions that a restart or reboot would end. Cookies and similar “remember my browser” features **SHALL NOT** be used instead of authentication except as provided for reauthentication at AAL2 in Sec. 2.2.3 when the inactivity limit has been exceeded but the time limit has not.

Some technologies (e.g., the emerging device bound session credentials specification [DBSC]) mitigate the risk of theft of session secrets by using cryptographic protocols that prove the possession of a session secret rather than using them as bearer tokens. These technologies might additionally store and use these session secrets in protected keystores to reduce the risk of exfiltration by malware. Session secrets used with such proof of possession techniques **MAY** persist. However, RPs and CSPs **SHALL** ensure that the session lifetime limits described in Sec. 2.2.3 are enforced even when a knowledge of the session secret is demonstrated.

The secret used for session binding **SHALL** be generated by the session host in direct response to an authentication event. A session **SHOULD** inherit the AAL properties of the authentication event that triggered its creation. A session **MAY** be considered at a lower AAL than the authentication event but **SHALL NOT** be considered at a higher AAL than the authentication event.

The secrets used for session binding **SHALL** meet all of the following requirements:

1. Secrets are established during or immediately following authentication.
2. Secrets are established using input from an approved random bit generator, as described in Sec. 3.2.12, and are at least 64 bits in length.
3. Secrets are erased or invalidated by the session subject when the subscriber logs out.
4. Secrets are either transferred from the session host to the RP or CSP via an authenticated protected channel or derived from keys that are established as part of establishing a valid, mutually authenticated protected channel.
5. Secrets will time out and are not accepted after the times specified in Sec. 2.1.3, Sec. 2.2.3, and Sec. 2.3.3, as appropriate for the AAL.
6. Secrets are unavailable to intermediaries between the host and the subscriber’s endpoint.

In addition, the secrets used for session binding **SHOULD** be erased on the subscriber endpoint when they log out or when the secret is deemed to have expired. They **SHOULD NOT** be placed in insecure locations (e.g., HTML5 Local Storage) due to the potential exposure of local storage to cross-site scripting (XSS) attacks.

Following authentication, authenticated sessions **SHALL NOT** fall back to an insecure transport (e.g., from https to http).

POST/PUT content **SHALL** contain a session identifier that the RP **SHALL** verify to protect against cross-site request forgery (CSRF).

Several mechanisms exist for managing a session over time. The following sections give different examples, additional requirements, and considerations for each example technology. Additional informative guidance is available in the Open Worldwide Application Security Project (OWASP) *Session Management Cheat Sheet* [OWASP-session].

Sessions **SHOULD** provide a readily accessible mechanism for subscribers to terminate (i.e., log off) their session when their interaction is complete. Session logoff gives the subscriber additional confidence and control over the security of their session, particularly if the endpoint might be accessible to others.

## §5.1.1 Browser Cookies

*Role in Verifier63: IN SCOPE (audited).*

Browser cookies are the predominant mechanism by which a session is created and tracked when a subscriber accesses a service. Cookies are not authenticators but are suitable as short-term secrets for the duration of a session.

Cookies used for session maintenance:

1. **SHALL** be tagged to be accessible only on secure (i.e., HTTPS) sessions.
2. **SHALL** be accessible to the minimum practical hostnames and paths.
3. **SHOULD** be tagged as inaccessible via JavaScript (i.e., HttpOnly).
4. **SHOULD** be tagged to expire at or soon after the session’s validity period. This requirement is intended to limit the accumulation of cookies but **SHALL NOT** be relied upon to enforce session timeouts.
5. **SHOULD** have the “__Host-“ prefix and set “Path=/”.
6. **SHOULD** set “SameSite=Lax” or “SameSite=Strict”.
7. **SHOULD** contain only an opaque string (e.g., a session identifier) and **SHALL NOT** contain cleartext personal information.

## §5.2 Reauthentication

*Role in Verifier63: IN SCOPE (audited).*

The periodic reauthentication of sessions **SHALL** be performed to confirm the subscriber’s continued presence at an authenticated session (e.g., that the subscriber has not walked away without logging out).

Session management uses two types of timeouts. An *overall timeout* limits the duration of an authenticated session to a specific period following authentication or a previous reauthentication. An *inactivity timeout* terminates a session without activity from the subscriber for a specific period. For both types of timeouts, the RP **MAY** alert the subscriber that the session is about to be terminated and allow the subscriber to make the session active or reauthenticate as appropriate before the session expires. When either timeout expires, the session **SHALL** be terminated. Session activity **SHALL** reset the inactivity timeout, and successful reauthentication during a session **SHALL** reset both timeouts.

The overall and inactivity timeout expiration limits depend on several factors, including the AAL of the session, the environment in which the session is conducted (e.g., whether the subscriber is in a restricted area), the type of endpoint being used (e.g., mobile application, web-based), whether the endpoint is a managed device, and the nature of the application itself. The limits **MAY** also be extended when higher security session maintenance technologies (e.g., device-bound mechanisms) are used. Agencies **SHALL** establish and document the inactivity and overall time limits being enforced in a system security plan, such as that described in [SP800-39]. Detailed requirements for each AAL are given in Sec. 2.1.3, Sec. 2.2.3, and Sec. 2.3.3.

Special considerations apply to session management and reauthentication when using a federation protocol and IdP to authenticate at the RP, as described in [SP800-63C]. The federation protocol communicates an authentication event at the IdP to the RP using an assertion, and the RP then begins an authenticated session based on the successful validation of this assertion. Since the IdP and RP manage sessions separately from each other and the federation protocol does not connect the session management between the IdP and RP, the termination of the subscriber’s sessions at an IdP and RP are independent of each other. Likewise, the subscriber’s sessions at multiple different RPs are established and terminated independently of each other.

Consequently, when an RP session expires and the RP requires reauthentication, it is possible that the session at the IdP has not expired and that a new assertion could be generated from this session at the IdP without explicitly reauthenticating the subscriber. The IdP can communicate the time and details of the authentication event to the RP, but the RP **SHALL** be authoritative as to whether the reauthentication requirements have been met. Section 4.7 of [SP800-63C] provides additional details and requirements for session management within a federation context.

## §A Strength of Passwords

*Role in Verifier63: SUPPORTING (informative). Backs the composition-rule and length citations.*

*This appendix is informative.*

This appendix uses the word “password” for ease of discussion. Where used, it should be interpreted to include passphrases and PINs.

### §A.1 Introduction

Passwords are a widely used form of authentication despite concerns about their use from both a usability and security standpoint [Persistence]. Humans have a limited ability to memorize complex, arbitrary secrets, so they often choose passwords that can be easily guessed. To address the resultant security concerns, online services have introduced rules that increase the effective strength of these passwords. The most notable form is composition rules, which require users to choose passwords that are constructed using a mix of character types (e.g., at least one digit, uppercase letter, and symbol). However, analyses of breached password databases reveal that the benefit of such rules is less significant than initially thought [Policies], and the impacts on usability and memorability are severe.

The effective strength of user-chosen passwords has often been characterized using the information theory concept of entropy [Shannon]. While entropy can be readily calculated for data with deterministic distribution functions, estimating entropy for user-chosen passwords is challenging. For this reason, a different and somewhat more straightforward approach based primarily on password length is presented herein. The use of passphrases (i.e., passwords with multiple words) is often an effective way to create a longer password.

Many attacks associated with passwords are not affected by password complexity and length. Keystroke logging, phishing, and social engineering attacks are equally effective on lengthy and complex passwords as they are on simple ones. These attacks are outside of the scope of this Appendix.

### §A.2 Length

Password length is a primary factor in characterizing password strength [Strength] [Composition]. Passwords that are too short yield to brute-force attacks and dictionary attacks. The minimum password length required depends on the threat model being addressed. Online attacks in which the attacker attempts to log in by guessing the password can be mitigated by limiting the permitted login attempt rate. To prevent an attacker (or a persistent claimant with poor typing skills) from quickly inflicting a denial-of-service attack on the subscriber by making many incorrect guesses, passwords need to be complex enough that a reasonable number of attempts can be permitted with a low probability of a successful guess, and rate limiting, as described in Sec. 3.2.2 can be applied before there is a significant chance of a successful guess.

Offline attacks are possible when the attacker obtains one or more hashed passwords through a database breach. The ability of the attacker to determine one or more users’ passwords depends on how the password is stored. Commonly, passwords are salted with a random value and hashed, preferably using a computationally expensive algorithm. Even with such measures, the current ability of attackers to compute many billions of hashes per second in an offline environment that is not subject to rate limiting requires passwords to be orders of magnitude more complex than those expected to resist only online attacks.

Users should be encouraged to make their passwords as long as they want within reason. Since the size of a hashed password is independent of its length, there is no reason to prohibit the use of lengthy passwords (or passphrases) if the user wishes. However, extremely long passwords (perhaps megabytes long) could require excessive processing time to hash, so it is reasonable to have some limit.

### §A.3 Complexity

Composition rules are commonly used in an attempt to increase the difficulty of guessing user-chosen passwords. However, research has shown that users respond in very predictable ways to the requirements imposed by composition rules [Policies]. For example, a user who might have chosen “password” as their password would be relatively likely to choose “Password1” if required to include an uppercase letter and a number or “Password1!” if a symbol is also required.

Users also express frustration when online services reject their attempts to create complex passwords. Many services reject passwords with spaces and various special characters. Characters that are not accepted are sometimes the result of an effort to avoid attacks that depend on those characters (e.g., SQL injection). However, an unhashed password would not be sent intact to a database, so such precautions are unnecessary. Users should also be able to include space characters to allow the use of phrases. Repeated space characters add little to the effective strength of passwords and may introduce usability issues (e.g., the undetected use of two spaces rather than one), so removing repeated spaces in typed passwords may be beneficial if initial verification fails.

Since users’ password choices are often predictable, attackers are likely to guess passwords that have previously proven successful. These include dictionary words and passwords from previous breaches, such as the “Password1!” example above. For this reason, passwords chosen by users should be compared against a blocklist of unacceptable passwords. This list should include passwords from previous breach corpuses, dictionary words used as passwords, and specific words (e.g., the name of the service itself) that users are likely to choose. Since a minimum length requirement will also govern the user’s choice of passwords, this dictionary only needs to include entries that meet that requirement. As noted in Sec. 3.1.1.2, it is not beneficial for the blocklist to be excessively large or comprehensive, since its primary purpose is to prevent the use of very common passwords that might be guessed in an online attack before throttling restrictions take effect. An excessively large blocklist will likely frustrate users who attempt to choose a memorable password.

Highly complex passwords introduce a new potential vulnerability: they are less likely to be memorable and more likely to be written down or stored electronically in an unsafe manner. While these practices are not necessarily vulnerable, some methods of recording such secrets will be. This is an additional motivation for not requiring excessively long or complex passwords.

### §A.4 Central vs. Local Verification

While passwords that are used as a separate authentication factor are often centrally verified by the CSP’s verifier, those that are used as an activation factor for a multi-factor authenticator are either verified locally by the authenticator or used to derive the authenticator output, which will be incorrect if the wrong activation factor is used. Both of these situations are referred to as “local verification.”

The attack surfaces and vulnerabilities for central and local verification are very different. Accordingly, the requirements for centrally verified passwords differ from those verified locally. Centrally verified passwords require the verifier (i.e., an online resource) to store salted and iteratively hashed verification secrets for all of the subscribers’ passwords. Although the salting and hashing process increases the computational effort to determine the passwords from the hashes, the verifier is an attractive target for attackers, particularly those interested in compromising an arbitrary subscriber rather than a specific one.

Local verifiers do not have the same concerns with large-scale attacks on a central online verifier but depend on the physical security of the authenticator and the integrity of its associated endpoint. To the extent that the authenticator stores the activation factor, that factor must be protected against physical and *side-channel* (e.g., power and timing analysis) attacks on the authenticator. When the activation factor is entered through the associated endpoint, the endpoint needs to be free of malware (e.g., key-logging software). Since such threats are less dependent on the length and complexity of the password, these requirements are relaxed for local verification.

Online password-guessing attacks are a similar threat to centrally and locally verified passwords. Throttling is the primary defense against online attacks and can be particularly challenging for local verifiers because of the limited ability of some authenticators to securely store information about unsuccessful attempts. Throttling of local activation factors can be done in one of two ways. The authenticator itself could handle the throttling by keeping count of invalid activation attempts or, when activated incorrectly, the authenticator could produce an invalid authenticator output that will be rejected and throttled by the verifier.

### §A.5 Summary

Length and complexity requirements beyond those recommended here significantly increase user frustration and the difficulty of using passwords. As a result, users often work around these restrictions counterproductively. Other mitigations (e.g., blocklists, secure hashed storage, machine-generated random passwords, rate limiting) are more effective at preventing modern brute-force attacks, so no additional password requirements are imposed.
