// Fixture: composition rule driven by a policy object, not by inline regexes.
export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireDigit: boolean;
  requireSymbol: boolean;
}

export const DEFAULT_POLICY: PasswordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireDigit: true,
  requireSymbol: false,
};
