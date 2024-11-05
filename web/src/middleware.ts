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
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};

export const publicRoutes = ["/"];

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const searchParams = req.nextUrl.searchParams;

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const token = (await getToken({ req })) as Token | null;

  if (!token) {
    return NextResponse.next();
  }

  const t = JSON.stringify(token);
  const payload: Payload = jwtDecode(t);

  api.defaults.headers.Authorization = `Bearer ${token.user.token}`;

  const user = payload.user;

  if (typeof user.lobbyId === "number") {
    // Se o usuário tentar acessar a página de dashboard, redirecione para a página de ações do lobby
    if (pathname === "/dashboard") {
      return NextResponse.redirect(
        `${req.nextUrl.origin}/dashboard/actions?lobby=${user.lobbyId}`
      );
    }

    // Se o lobbyId não estiver na query string, adicione-o e redirecione para o lobby correto
    if (!searchParams.has("lobby")) {
      searchParams.set("lobby", user.lobbyId.toString());
      return NextResponse.redirect(
        `${req.nextUrl.origin}/${pathname}?${searchParams.toString()}`
      );
    }

    // Se o lobbyId na query string for diferente do lobbyId do usuário, atualize-o e redirecione para o lobby correto
    if (searchParams.get("lobby") !== user.lobbyId.toString()) {
      searchParams.set("lobby", user.lobbyId.toString());
      return NextResponse.redirect(
        `${req.nextUrl.origin}/${pathname}?${searchParams.toString()}`
      );
    }
  }

  return NextResponse.next();
}
