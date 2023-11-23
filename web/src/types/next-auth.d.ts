import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: int;
      name: String;
      username: String;
      type: String;
    };
  }
}