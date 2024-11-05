import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/axios";
import { getToken } from "next-auth/jwt";
import { jwtDecode } from "jwt-decode";
import { Session } from "next-auth";

interface Payload {
  user: {
    id: number;
    name: String;
    username: String;
    type: String;
    lobbyId: number | null;
  };
}

interface Token {
  user: {
    token: String;
  };
}

export const config = {
  matcher: "/((?!.*\\.|_next/static|_next/image|favicon.ico|api).*)"
};

export const publicRoutes = [
  "/",
  "/login",
];

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const searchParams = req.nextUrl.searchParams;

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const token = (await getToken({ req })) as Token | null;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }

  const t = JSON.stringify(token);
  const payload: Payload = jwtDecode(t);
  api.defaults.headers.Authorization = `Bearer ${token.user.token}`;

  const user = payload.user;

  if (typeof user.lobbyId === "number") {

    // Se o o id da portaria não estiver na url ou for diferente do id do usuário, redireciona para a página da portaria do usuário
    if (!searchParams.has("lobby") || searchParams.get("lobby") !== user.lobbyId.toString()) {
      return NextResponse.redirect(new URL(`/dashboard/actions/?lobby=${user.lobbyId}`, req.nextUrl.origin));
    }
  }

  return NextResponse.next();
}
