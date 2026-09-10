// Fixture: no composition rules (good), but sessions, hashing and lockout are wrong.
import { createHash } from "crypto";

const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days, rolling
const MAX_LOGIN_FAILURES = 500;
const PASSWORD_MAX_AGE_DAYS = 90;

export function validatePassword(password: string): void {
  if (password.length < 15) throw new Error("Password must be at least 15 characters");
  if (password.length > 20) throw new Error("Password must be at most 20 characters");
}

export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export function mustRotate(user: { passwordChangedAt: Date }): boolean {
  const ageDays = (Date.now() - user.passwordChangedAt.getTime()) / 86400000;
  return ageDays > PASSWORD_MAX_AGE_DAYS;
}

export function newSessionId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function setSessionCookie(res: any, sid: string): void {
  res.cookie("sid", sid, { secure: false, httpOnly: false, sameSite: "none", maxAge: SESSION_MAX_AGE_MS });
}

export function onLoginFailure(user: { failures: number; locked: boolean }): void {
  user.failures++;
  if (user.failures > MAX_LOGIN_FAILURES) {
    user.locked = true;
    throw new Error("locked");
  }
}
