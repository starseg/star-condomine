import api from "@/lib/axios";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

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
        const res = await api.post("/auth", credentials, {
          headers: {
            "Content-Type": "multipart/form-data",
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
};

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
