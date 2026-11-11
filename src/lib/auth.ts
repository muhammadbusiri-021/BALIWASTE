// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "juri@baliwaste.id" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const [foundUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email))
            .limit(1);

          if (!foundUser) {
            // Demo fallback jika database belum diseed
            if (
              (credentials.email === "juri@madurawaste.id" &&
                (credentials.password === "juriMadura2026!" || credentials.password === "juriBali2026!")) ||
              (credentials.email === "juri@baliwaste.id" &&
                (credentials.password === "juriBali2026!" || credentials.password === "juriMadura2026!"))
            ) {
              return {
                id: "demo-juri-id",
                name: "Dewan Juri AI Innovation",
                email: credentials.email,
                role: "officer",
              };
            }
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            foundUser.passwordHash
          );

          if (!isValid) return null;

          return {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role,
          };
        } catch (error) {
          console.error("Auth authorization error:", error);
          // Demo fallback jika koneksi database offline/belum disetting
          if (
            (credentials.email === "juri@madurawaste.id" &&
              (credentials.password === "juriMadura2026!" || credentials.password === "juriBali2026!")) ||
            (credentials.email === "juri@baliwaste.id" &&
              (credentials.password === "juriBali2026!" || credentials.password === "juriMadura2026!"))
          ) {
            return {
              id: "demo-juri-id",
              name: "Dewan Juri AI Innovation",
              email: credentials.email,
              role: "officer",
            };
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as unknown as { role?: string }).role || "citizen";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as unknown as { id?: string; role?: string }).id = token.id as string;
        (session.user as unknown as { id?: string; role?: string }).role = token.role as string;
      }
      return session;
    },
  },
};
