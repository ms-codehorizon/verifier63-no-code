# Provenance of the pinned standard

Every finding Verifier63 produces cites a provision quoted from `sp800-63b-4-in-scope.md`
in this folder. This file records exactly which edition of the standard that text is, where it
came from, and how to prove the copy has not drifted.

## Standard

| Field | Value |
|---|---|
| Title | Digital Identity Guidelines: Authentication and Authenticator Management |
| Identifier | NIST SP 800-63B-4 |
| Status | Final |
| Official publication | July 31, 2025 (PDF cover: July 2025; approved by NIST Editorial Review Board 2025-05-30) |
| Supersedes | NIST SP 800-63B (June 2017; updated March 2, 2020) |
| DOI | https://doi.org/10.6028/NIST.SP.800-63B-4 |
| Authors | Temoshok D, Fenton JL, Choong YY, Lefkovitz N, Regenscheid A, Galluzzo R, Richer JP |
| Copyright | "not subject to copyright in the United States" (PDF, Copyright, Fair Use, and Licensing Statements, p. 3). Reproduced here on that basis. |

## Sources retrieved

Retrieval date: 2026-09-10.

| File in this folder | Source | SHA-256 |
|---|---|---|
| `NIST.SP.800-63B-4.pdf` (publication of record, 129 pages) | https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63B-4.pdf | `d9ab89576b5ae2cfb3ba37781110788dea27a85a5079496dbfc1a79834670afd` |
| `sp800-63b-4.html` (NIST HTML edition, page timestamp Tue, 26 Aug 2025) | https://pages.nist.gov/800-63-4/sp800-63b.html | `ef1988a062c9d278a5455908556e019a4a79ee7c6590dae362c344810bdf03d0` |
| `sp800-63b-4-in-scope.md` (extracted in-scope sections, the text the auditor cites) | derived from `sp800-63b-4.html`, see below | `7212c37e271bf79e3412ed3a13b03f22740d1cb1273ab2447138ce7ca5aeca22` |

## How the in-scope text was produced

1. The HTML edition was converted section by section to markdown: headings kept, `<strong>` kept as
   `**...**`, `<em>` as `*...*`, ordered and unordered lists kept, cross-reference links reduced to
   their link text, footnote markers dropped. No sentence was summarized, reordered, or omitted
   inside a reproduced section.
2. Section numbers are not present in the HTML markup (they are rendered by CSS). They were derived
   from heading depth and document order and cross-checked against the table of contents of the
   PDF of record. In particular: revision 4 has no §5.2.1 or §5.2.2; the AAL-specific timeout
   values live in §2.1.3, §2.2.3 and §2.3.3, and §5.2 refers back to them.
3. Only the sections listed at the top of `sp800-63b-4-in-scope.md` are reproduced. Every other
   section is listed in `OUT-OF-SCOPE.md` by number.

## How to verify, without running anything from this folder

1. **The text is NIST's.** Open `NIST.SP.800-63B-4.pdf` at §3.1.1.2 (Password Verifiers) and
   read it beside the same heading in `sp800-63b-4-in-scope.md`. Or download the PDF again from
   the DOI above and compare.
2. **The copies are unmodified.** Recompute the hashes above with the tool already on your
   machine: `shasum -a 256 <file>` (macOS), `sha256sum <file>` (Linux),
   `certutil -hashfile <file> SHA256` (Windows). Nothing from this folder runs.
3. **Every citation is real.** `CITATION-INDEX.md` lists all 85 controls with the line number in
   `sp800-63b-4-in-scope.md` where the quoted words appear. Open the file at that line.
