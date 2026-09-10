# Deterministic check procedures

Written procedures for the 24 controls whose `detection_strategy` is `MECHANICAL_FIRST` in
`reference/requirements.json`. The auditor (Claude, or a person) follows the procedure
literally. A finding produced this way is labelled `Detection: PROCEDURAL`: the steps are
fixed, so a second reader following the same steps on the same code reaches the same verdict.
A control the procedure cannot settle is labelled `Detection: SEMANTIC` and judged, with the
reason the procedure stopped stated in the finding.

No step in this file requires executing anything. Every step is "open the file, find the
construct, follow the value".

## Shared definitions

**Password-like value.** An expression is the password if any of these holds:

1. Its name matches `pass`, `password`, `passwd`, `passphrase`, `pwd`, `secret`, `credential`
   (any case), as a variable, parameter, or property name (`req.body.password`).
2. It is a variable initialised from a password-like value, or a method call on one that
   returns the same string (`.trim()`, `.normalize()`, `.toLowerCase()`).
3. It is a parameter of a function, and at **every** call site of that function in the supplied
   files the argument in that position is password-like (apply this rule recursively, at most
   six hops). This is how a parameter named `value` or `candidate` in a helper is recognised.
4. It is the first parameter of a function whose bound name is password-like
   (`validatePassword(p)`, `const password = (value, helpers) => ...`), or of a method inside an
   object assigned to a password-like property (`password: { validate(value) {...} }`).

If none holds, the value is not the password for the purposes of these procedures.

**Rejection path.** A statement is a rejection if it is any of: `throw`; `return false`;
`return` of a string or template literal; `return` of an object with `valid`/`ok`/`success`
set to `false` or containing an `error`/`errors`/`message`/`reason` key; a `.push(...)` onto
a variable named like `errors`/`issues`/`problems`/`violations`/`failures`; a response with a
4xx status (`res.status(400)`); a call to `reject`/`fail`/`deny`/`abort`; `next(new Error(...))`;
Joi-style `return helpers.message(...)` / `helpers.error(...)`; an assignment
`valid = false` (or `ok`, `success`, `passed`).

**Following a boolean to its sink.** Starting from a test expression, walk outward through
`!`, `&&`, `||`, `? :`, parentheses and template literals, until you reach one of:

- an `if` condition: the sink is **enforce** if either branch contains a rejection path;
  otherwise, if a branch pushes into or assigns a local variable, follow that variable (below);
  otherwise **observe**.
- a variable declaration or assignment: follow every read of that variable (not writes,
  not `.push` calls on it, not `.length` reads that go nowhere) and combine: any **enforce**
  wins; otherwise any **unknown** wins; otherwise **observe**.
- a `return` (or arrow-function body): find every call of the enclosing function in the
  supplied files and continue from each call expression. If the arrow is the callback of
  `.every/.some/.filter/.map/.reduce/.find`, continue from that outer call instead. No callers
  found: **unknown**.
- a property in an object literal that is returned or assigned to a variable: find every
  reader of that property name on the holding variable (or on the callers' result variables)
  and continue from there. Anything else: **unknown**.
- an argument to a function defined in the supplied files: continue from that parameter.
- an argument to `console.*`, `log*`, `logger.*`, `metrics.*`, `telemetry.*`, `analytics.*`,
  `track*`, `record*`, `emit*`, `report*`, a strength meter or score: **observe**.
- an argument to anything named like `assert`, `invariant`, `expect`, `ensure`, `require`,
  `validate`, `check`, `must`, `guard`, or to an external function you cannot see: **unknown**.
- an expression statement with no use: **observe**.

Stop after twelve hops or on revisiting a node: **unknown**.

**Constant value.** A number is provable if it is a literal, arithmetic on literals, a
`const` initialised that way, a property of a `const` object literal, or a parameter that
receives the same literal at every call site. `process.env.*`, database reads, and function
results are not provable.

**Verdict discipline.** Procedural verdicts require the whole supplied program to have been
read. "No X located" means you searched every supplied file. When only fragments are supplied
and a rule depends on absence, prefer EVIDENCE REQUIRED.

---

## composition_enforcement (PWD-COMP-01)

1. List every place a character-class regex is applied to a password-like value:
   `re.test(pw)`, `pw.match(re)`, `re.exec(pw)`, `pw.search(re)`, and schema rules
   `.regex(re)` / `.matches(re)` / `.pattern(re)` chained under a password-like key.
   A character-class regex is one containing `[A-Z]`, `[a-z]`, `\d`, `[0-9]`, `[^A-Za-z0-9]`,
   `\W`, `\p{Lu}`, `\p{Ll}`, or a run of symbols like `[!@#$%^&*]`, and is **not** anchored
   `^...$` (anchored allowlists are charset restrictions, handled below).
2. For each, follow the boolean to its sink. Schema rules are **enforce** by definition.
3. Any **enforce** → FAIL, PROCEDURAL, cite every enforcing site. Otherwise any **unknown** →
   SEMANTIC (state the unresolved site). Otherwise all **observe** → PASS, PROCEDURAL, cite the
   observing sites.
4. If step 1 finds nothing: search the supplied files for any character-class regex at all,
   and for `pw.toUpperCase()`/`toLowerCase()` compared against `pw`, `charCodeAt`/`codePointAt`
   on the password, or `[...pw].some/every/filter` / `pw.split("").some`. Any hit → SEMANTIC
   (a composition rule can be written without a regex). No hit and a password validator
   exists → PASS, PROCEDURAL ("no character-class test exists in the supplied files"). No
   validator → EVIDENCE REQUIRED.

Reference test: `fixtures/observe-not-require` uses the same regexes as
`fixtures/composition-obvious`; their results feed only `metrics.record`. Obvious must FAIL;
observe-not-require must PASS.

## min_length, max_length (PWD-LEN-01, PWD-LEN-02, PWD-LEN-03)

1. Find every comparison of the password's length against a constant: `pw.length`,
   `[...pw].length`, `Array.from(pw).length`, or a variable initialised from one of those;
   and schema rules `.min(n)` / `.max(n)` / `.minLength(n)` / `.maxLength(n)` under a
   password-like key.
2. Keep only comparisons whose sink is **enforce**, and whose constant is provable. Work out
   the direction from which branch rejects: `len < n` rejecting → minimum n; `len <= n` →
   minimum n+1; `len > n` rejecting → maximum n; `len >= n` → maximum n-1. A rejection in the
   `else` branch flips the meaning. Take the highest minimum and the lowest maximum.
3. PWD-LEN-01 applies only when `password_usage = single_factor` (need ≥ 15); PWD-LEN-02 only
   when `part_of_mfa` (need ≥ 8). The other is NOT APPLICABLE. `password_usage` missing →
   both EVIDENCE REQUIRED (state the observed minimum if any).
4. Minimum found → PASS/FAIL against the requirement, PROCEDURAL. Comparison present but
   constant not provable, or sink unknown → SEMANTIC. Nothing found → EVIDENCE REQUIRED.
5. PWD-LEN-03: maximum found → PASS if ≥ 64 else FAIL. No maximum but a validator was located
   → PASS ("no maximum restriction in the supplied files"). No validator → EVIDENCE REQUIRED.

## truncation (PWD-LEN-05)

1. `pw.slice(...)`, `pw.substring(...)`, `pw.substr(...)` on a password-like value before
   hashing or comparison → FAIL, PROCEDURAL.
2. Otherwise, if bcrypt is used (import or `require` of `bcrypt`/`bcryptjs`) and no maximum
   ≤ 72 is enforced: bcrypt truncates input at 72 bytes → SEMANTIC (judge; the real-world
   example in `examples.md` fails this).
3. Otherwise, if a hashing or comparison call exists → PASS, PROCEDURAL. None → EVIDENCE REQUIRED.

## charset_restriction (PWD-CHAR-01, PWD-CHAR-02)

1. Find anchored allowlist regexes `^[...]+$` / `^[...]*$` applied to the password with an
   **enforce** sink.
2. If the class contains no `\p{..}`, `\u`, `\S`, `\w` and no non-ASCII character, the password
   is restricted to ASCII → PWD-CHAR-02 FAIL and the fact `unicode_passwords_accepted = false`.
3. If the class contains no space, `\s`, `\x20` or `\S` → PWD-CHAR-01 FAIL. Also FAIL PWD-CHAR-01
   if whitespace is removed from the password with `replace(/\s/…)` before validation or
   hashing. (`trim()` is not a failure: NIST §3.1.1.2 permits removing leading and trailing
   whitespace.)
4. No such regex and a validator located → both PASS, PROCEDURAL, `unicode_passwords_accepted = true`.
   No validator → EVIDENCE REQUIRED.

## nfc_normalization (PWD-CHAR-04)

Applies only when `unicode_passwords_accepted = true` (else NOT APPLICABLE). PASS if
`.normalize("NFC")` is applied to the password before hashing. FAIL if hashing exists and no
normalization does. No hashing located → EVIDENCE REQUIRED.

## password_expiry (PWD-COMP-02)

Search all supplied files for identifiers matching `password…expir|maxAge|age|rotat`,
`expir…password`, `passwordChangedAt`, `pwdExpir` used in a comparison or date arithmetic.
Any → FAIL, PROCEDURAL, cite the comparison. None → PASS, PROCEDURAL ("no age-based expiry
logic in the supplied files").

## password_hashing (PWD-HASH-02)

1. `argon2.hash`, `bcrypt.hash`/`hashSync` (with bcrypt loaded), `scrypt`/`scryptSync` with
   a salt argument, `pbkdf2`/`pbkdf2Sync` with a salt argument → PASS, PROCEDURAL; record the
   scheme as a fact.
2. `createHash("md5"|"sha1"|"sha256"|"sha512"…)` whose `.update(...)` chain is fed the
   password → FAIL, PROCEDURAL ("fast unsalted digest").
3. Plaintext comparison `stored.password === password` → FAIL, PROCEDURAL.
4. Nothing → EVIDENCE REQUIRED.

## lockout_threshold (RATE-02)

1. Find comparisons of a counter named like `fail|attempt|strike|retry|retries|lockout|wrong|invalid`
   against a provable constant with an **enforce** sink. `counter >= n` → threshold n;
   `counter > n` → threshold n+1. Take the lowest.
2. Threshold ≤ 100 → PASS; > 100 → FAIL. PROCEDURAL either way.
3. Only a windowed limiter keyed on request source (`windowMs` + `max`/`limit`, e.g.
   express-rate-limit) → SEMANTIC: it keys on IP, not the subscriber account, and does not
   disable the authenticator.
4. Nothing → EVIDENCE REQUIRED.

## session_secret_generation (SESS-11)

Look for how the session id / token is produced (a value named like `id`, `sid`, `token`,
`secret`, `session`, or the return of a function named like that).
`crypto.randomBytes(n)` with n ≥ 8, or `crypto.randomUUID()` → PASS, PROCEDURAL.
`Math.random()`, `Date.now()`, a counter, or `randomBytes(n)` with n < 8 feeding the id →
FAIL, PROCEDURAL. A session library with no visible `genid` → SEMANTIC (library default is a
fact outside the supplied files). Nothing → EVIDENCE REQUIRED.

## insecure_storage (SESS-17)

`localStorage.setItem` / `sessionStorage.setItem` with a token/session/jwt/auth value →
FAIL, PROCEDURAL. Client code present with no such write → PASS. No client code → EVIDENCE REQUIRED.

## cookie_attrs (COOK-01, COOK-03, COOK-04, COOK-06, COOK-07)

1. Find the session cookie: `res.cookie(name, value, {options})`, `cookies.set(...)`, or a
   session library call (`session({...})`, `cookieSession({...})`) whose `cookie: {...}`
   holds the options. Prefer the library config; else the cookie whose name matches
   `sess|sid|token|auth`.
2. Options must be a fully literal object. A spread or a variable → all five SEMANTIC.
3. COOK-01 `secure: true` → PASS; `false`/absent → FAIL; environment-dependent
   (`process.env.NODE_ENV === "production"`) → EVIDENCE REQUIRED.
4. COOK-03 `httpOnly: true` → PASS. Absent: FAIL for `res.cookie` (default false), PASS for
   `express-session` (default true).
5. COOK-06 name begins `__Host-` and `path` is `/` or absent → PASS, else FAIL.
6. COOK-07 `sameSite` `"lax"`/`"strict"`/`true` → PASS; `"none"`/`false`/absent → FAIL.
7. COOK-04 no `maxAge`/`expires` → PASS (session cookie). `maxAge` provable → PASS if ≤ the
   declared AAL's overall limit (AAL1 30 d, AAL2 24 h, AAL3 12 h), else FAIL; AAL missing →
   EVIDENCE REQUIRED. `res.cookie` maxAge is milliseconds.
8. No session cookie anywhere and sessions are header-borne tokens → all COOK controls
   NOT APPLICABLE (`session_cookies_used = false`).

## session_timeouts (REAUTH-02 to REAUTH-07)

1. Find constants or config named like `SESSION_(ABSOLUTE|LIFETIME|MAX_AGE|TTL|TIMEOUT|EXPIR)`
   (overall) and `IDLE|INACTIV…` (inactivity) with provable values. Infer the unit from the
   name (`_MS`, `_SECONDS`, `_MINUTES`, `_HOURS`, `_DAYS`) or from a `* 1000` in the
   expression; an uninferable unit → SEMANTIC. For `express-session`, `cookie.maxAge` with
   `rolling: false` is an overall lifetime; with `rolling: true` it is an inactivity timeout.
2. REAUTH-02: an overall lifetime exists → PASS. Only an idle/rolling timeout → FAIL ("no
   definite overall timeout"). Nothing → EVIDENCE REQUIRED.
3. REAUTH-03/04/06 (overall ≤ 30 d / 24 h / 12 h) and REAUTH-05/07 (inactivity ≤ 1 h / 15 min):
   NOT APPLICABLE unless the declared AAL matches; then compare. An AAL2/AAL3 application with
   an overall timeout but no inactivity timeout FAILS the inactivity control.

---

## Worked reference

Apply these procedures to `fixtures/` and compare with each fixture's `EXPECTED.md`. The
same procedures were applied to `examples/node-express-boilerplate/` to produce Example 1 in
`examples.md`; every PROCEDURAL row there can be re-derived by hand from these steps.
