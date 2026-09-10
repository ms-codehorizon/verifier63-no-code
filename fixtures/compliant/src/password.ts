// Fixture: no intentional violations. Length only, blocklist, argon2id, NFC, no expiry, no hints.
import argon2 from "argon2";
import { blocklist } from "./blocklist";

export const MIN_PASSWORD_LENGTH = 15;
export const MAX_PASSWORD_LENGTH = 256;

export class PasswordRejected extends Error {}

export function validateNewPassword(password: string, username: string): void {
  const normalized = password.normalize("NFC");
  const length = [...normalized].length; // code points, not UTF-16 units
  if (length < MIN_PASSWORD_LENGTH) throw new PasswordRejected(`Use at least ${MIN_PASSWORD_LENGTH} characters. Longer passphrases are fine.`);
  if (length > MAX_PASSWORD_LENGTH) throw new PasswordRejected(`Use at most ${MAX_PASSWORD_LENGTH} characters.`);
  if (blocklist.has(normalized) || normalized.toLowerCase().includes(username.toLowerCase())) {
    throw new PasswordRejected("That password appears on a list of commonly used or compromised passwords. Choose a different one.");
  }
}

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password.normalize("NFC"), { type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 1 });
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  return argon2.verify(hash, password.normalize("NFC"));
}
