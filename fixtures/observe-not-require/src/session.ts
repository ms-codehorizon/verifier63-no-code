import { randomBytes } from "crypto";
import argon2 from "argon2";

export const SESSION_ABSOLUTE_LIFETIME_MS = 12 * 60 * 60 * 1000; // 12 h
export const SESSION_IDLE_TIMEOUT_MS = 30 * 60 * 1000;           // 30 min
const MAX_FAILED_ATTEMPTS = 10;

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password.normalize("NFC"), { type: argon2.argon2id, memoryCost: 65536, timeCost: 3 });
}

export function newSessionId(): string {
  return randomBytes(32).toString("hex");
}

export function setSessionCookie(res: any, sessionId: string): void {
  res.cookie("__Host-session", sessionId, { secure: true, httpOnly: true, sameSite: "strict", path: "/" });
}

export function recordFailedAttempt(account: { failedAttempts: number; disabled: boolean }): void {
  account.failedAttempts += 1;
  if (account.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    account.disabled = true;
    throw new Error("Password authenticator disabled after too many failed attempts");
  }
}
