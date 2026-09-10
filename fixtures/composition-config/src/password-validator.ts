import { DEFAULT_POLICY, PasswordPolicy } from "./policy";

export function validate(password: string, policy: PasswordPolicy): string[] {
  const errors: string[] = [];
  if (password.length < policy.minLength) errors.push(`min length ${policy.minLength}`);
  if (policy.requireUppercase && !/[A-Z]/.test(password)) errors.push("uppercase required");
  if (policy.requireDigit && !/[0-9]/.test(password)) errors.push("digit required");
  if (policy.requireSymbol && !/[^A-Za-z0-9]/.test(password)) errors.push("symbol required");
  return errors;
}

export function signup(password: string): void {
  const errors = validate(password, DEFAULT_POLICY);
  if (errors.length > 0) {
    throw new Error(errors.join("; "));
  }
}
