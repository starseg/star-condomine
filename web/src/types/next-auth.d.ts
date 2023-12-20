import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    payload: {
      user: {
        id: int;
        name: String;
        username: String;
        type: String;
      };
    };
    token: {
      user: {
        token: String;
      };
    };
  }
}
