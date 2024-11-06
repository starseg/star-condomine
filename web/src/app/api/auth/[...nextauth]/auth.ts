import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import apiBase from "@/lib/axios-base";

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        const res = await apiBase.post("/auth", credentials, {
          headers: {
            "Content-Type": "application/json",
          },
          validateStatus: (status) => status >= 200 && status < 500,
        });
        const user = await res.data;

        // If no error and we have user data, return it
        if (res.status === 200 && user) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    maxAge: 12 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      user && (token.user = user);
      return token;
    },
    async session({ session, token }) {
      const t = JSON.stringify(token);
      const payload = jwtDecode(t);
      session = { payload, token } as any;
      return session;
    },
  },
};
