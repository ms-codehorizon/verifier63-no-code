// Fixture: the SAME regexes as composition-obvious, but their results are only
// recorded for analytics and shown in a strength meter. Nothing is rejected.
import { metrics } from "./metrics";

export class ValidationError extends Error {}

export function validatePassword(password: string): void {
  if (password.length < 8) {
    throw new ValidationError("Password must be at least 8 characters");
  }
  const hasUppercase = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  metrics.record("password_has_uppercase", hasUppercase);
  metrics.record("password_has_digit", hasDigit);
  metrics.record("password_has_symbol", hasSymbol);
}

export function strengthHint(password: string): string {
  const classes = [/[A-Z]/, /[a-z]/, /\d/].filter((re) => re.test(password)).length;
  return classes >= 3 ? "strong" : "consider a longer passphrase";
}
