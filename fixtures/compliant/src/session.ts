import { randomBytes } from "crypto";

export const SESSION_ABSOLUTE_LIFETIME_MS = 12 * 60 * 60 * 1000; // 12 h  (AAL2 limit: 24 h)
export const SESSION_IDLE_TIMEOUT_MS = 30 * 60 * 1000;           // 30 min (AAL2 limit: 1 h)
const MAX_CONSECUTIVE_FAILURES = 10;

export interface Session { id: string; userId: string; createdAt: number; lastSeenAt: number }
const store = new Map<string, Session>();

export function createSession(userId: string): Session {
  const id = randomBytes(32).toString("base64url"); // 256 bits from a CSPRNG
  const now = Date.now();
  const s = { id, userId, createdAt: now, lastSeenAt: now };
  store.set(id, s);
  return s;
}

export function resolveSession(id: string): Session | undefined {
  const s = store.get(id);
  if (!s) return undefined;
  const now = Date.now();
  if (now - s.createdAt > SESSION_ABSOLUTE_LIFETIME_MS || now - s.lastSeenAt > SESSION_IDLE_TIMEOUT_MS) {
    store.delete(id);
    return undefined;
  }
  s.lastSeenAt = now;
  return s;
}

export function destroySession(id: string): void { store.delete(id); }

export function setSessionCookie(res: any, id: string): void {
  res.cookie("__Host-session", id, { secure: true, httpOnly: true, sameSite: "strict", path: "/", maxAge: SESSION_ABSOLUTE_LIFETIME_MS });
}

export function recordFailedAttempt(account: { failures: number; passwordDisabled: boolean }): void {
  account.failures += 1;
  if (account.failures >= MAX_CONSECUTIVE_FAILURES) {
    account.passwordDisabled = true;
    throw new Error("Password authenticator disabled; rebind required");
  }
}

export function recordSuccess(account: { failures: number }): void { account.failures = 0; }
