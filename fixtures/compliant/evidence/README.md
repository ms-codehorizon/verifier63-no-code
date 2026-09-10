# Evidence for facts the code alone cannot establish

- `argon2` npm package 0.41.x: argon2id, 16-byte (128-bit) salt generated per hash with `crypto.randomBytes`; output is PHC string (embeds salt, parameters and version). Supports PWD-HASH-07, 08, 09, 10.
- Node `crypto.randomBytes` is a CSPRNG backed by OpenSSL's approved DRBG. Supports SESS-11 and §3.2.12.
- TLS terminates at the application (HTTPS listener in `server.ts`, not supplied here); HSTS enabled. Declared, not proven: SESS-13, SESS-18 and PWD-CHAN-01 remain EVIDENCE REQUIRED unless server.ts is supplied.
- No keyed-hash (pepper) step is implemented: PWD-HASH-12, 13, 14 are NOT APPLICABLE.
