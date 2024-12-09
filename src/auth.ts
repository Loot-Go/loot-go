import NextAuth from "next-auth";

import type { NextAuthConfig } from "next-auth";

import { validateJWT } from "@/lib/authHelpers";
import Credentials from "@auth/core/providers/credentials";
import { NextResponse } from "next/server";

type User = {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  // Add other fields as needed
};

export const config = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials): Promise<User | null> {
        const token = credentials.token as string; // Safely cast to string; ensure to handle undefined case
        if (typeof token !== "string" || !token) {
          throw new Error("Token is required");
        }
        const jwtPayload = await validateJWT(token);

        if (jwtPayload) {
          // Transform the JWT payload into your user object
          const user: User = {
            id: jwtPayload.sub || "", // Assuming 'sub' is the user ID
            name: jwtPayload.name || "", // Replace with actual field from JWT payload
            email: jwtPayload.email || "", // Replace with actual field from JWT payload
            walletAddress: jwtPayload.verified_credentials[0]?.address || "",
            // Map other fields as needed
          };
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    authorized({ request, auth }) {
      const requestUrl = request.url;
      const { pathname } = request.nextUrl;
      if (!auth)
        return NextResponse.redirect(
          new URL(`/login?redirectTo=${pathname}`, requestUrl),
        );
      else return true;
    },
  },
} as NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
