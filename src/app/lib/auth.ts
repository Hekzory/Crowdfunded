import { createHash } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Secret key for JWT
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key_change_this_in_production");

// Google OAuth Configuration
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
export const REDIRECT_URI = process.env.REDIRECT_URI || "http://dev.tsv.one:3000/api/auth/google/callback";

// Hash password using SHA-256
export function hashPassword(password: string): string {
    return createHash("sha256").update(password).digest("hex");
}

// Generate JWT token
export async function generateToken(userId: number, email: string, provider = "email"): Promise<string> {
    return await new SignJWT({ userId, email, provider })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(SECRET_KEY);
}

// Verify JWT token
export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload;
    } catch (error) {
        return null;
    }
}

// Get Google OAuth URL
export function getGoogleOAuthURL() {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    const options = {
        redirect_uri: REDIRECT_URI,
        client_id: GOOGLE_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
    };

    const qs = new URLSearchParams(options);
    return `${rootUrl}?${qs.toString()}`;
}

// Get Google OAuth tokens
export async function getGoogleOAuthTokens(code: string) {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
    };

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(values),
        });

        return await res.json();
    } catch (error) {
        console.error("Failed to fetch Google OAuth tokens:", error);
        throw new Error("Failed to fetch Google OAuth tokens");
    }
}

// Get Google user info
export async function getGoogleUser(id_token: string, access_token: string) {
    try {
        const res = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
            headers: {
                Authorization: `Bearer ${id_token}`,
            },
        });

        return await res.json();
    } catch (error) {
        console.error("Failed to fetch Google user:", error);
        throw new Error("Failed to fetch Google user");
    }
}

// Set auth cookie
export async function setAuthCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 2, // 2 hours
        path: "/",
    });
}

// Remove auth cookie
export async function removeAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
}

// Get current user from request
export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        return null;
    }

    try {
        const payload = await verifyToken(token);
        return payload;
    } catch {
        return null;
    }
}
