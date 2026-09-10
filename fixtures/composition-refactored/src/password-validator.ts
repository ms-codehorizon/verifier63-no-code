// Fixture: the same composition rule, split across helpers with neutral names.
// No identifier says "uppercase", "complexity" or "composition".
import { charClassA, charClassB } from "./checks";

type Outcome = { ok: boolean; reasons: string[] };

function collectProblems(candidate: string): string[] {
  const found: string[] = [];
  if (candidate.length < 8) found.push("too short");
  if (!charClassA(candidate)) found.push("missing class A");
  if (!charClassB(candidate)) found.push("missing class B");
  return found;
}

export function evaluatePassword(password: string): Outcome {
  const reasons = collectProblems(password);
  return { ok: reasons.length === 0, reasons };
}

export function registerUser(password: string, save: (p: string) => void): void {
  const outcome = evaluatePassword(password);
  if (!outcome.ok) {
    throw new Error(outcome.reasons.join(", "));
  }
  save(password);
}
