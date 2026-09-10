// Fixture: composition rule enforced the obvious way.
export class ValidationError extends Error {}

export function validatePassword(password: string): void {
  if (password.length < 8) {
    throw new ValidationError("Password must be at least 8 characters");
  }
  if (!/[A-Z]/.test(password)) {
    throw new ValidationError("Password must contain an uppercase letter");
  }
  if (!/[0-9]/.test(password)) {
    throw new ValidationError("Password must contain a digit");
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    throw new ValidationError("Password must contain a symbol");
  }
}
