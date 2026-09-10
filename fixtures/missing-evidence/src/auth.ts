// Fixture: correct-looking code whose critical facts live outside the supplied files.
import session from "express-session";
import { identityService } from "./identity-client";

export const sessionMiddleware = session({
  name: "__Host-sid",
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true, httpOnly: true, sameSite: "lax", path: "/" },
});

export function validatePassword(password: string): void {
  if (password.length < 15) throw new Error("Password must be at least 15 characters");
}

export async function storePassword(userId: string, password: string): Promise<void> {
  // Hashing, salting and cost factor are configured inside the identity service.
  await identityService.setCredential(userId, password);
}

export async function loginFailed(userId: string): Promise<void> {
  await identityService.recordFailure(userId); // lockout policy is server-side, not supplied
}
