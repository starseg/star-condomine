import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/axios";
import { Session } from "next-auth";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const searchParams = req.nextUrl.searchParams;

  const response = await fetch(`${req.nextUrl.origin}/api/session`)
  const session = await response.json() as Session | null;

  console.log(session);

  if (!session) {
    return NextResponse.redirect(`${req.nextUrl.origin}/`);
  }



  api.defaults.headers.Authorization = `Bearer ${session.token.user.token}`;

  const user = session.payload.user;

  if (typeof user.lobbyId === "number") {

    // Se o usuário tentar acessar a página de dashboard, redirecione para a página de ações do lobby
    if (pathname === "/dashboard") {
      return NextResponse.redirect(`${req.nextUrl.origin}/dashboard/actions?lobby=${user.lobbyId}`);
    }

    // Se o lobbyId não estiver na query string, adicione-o e redirecione para o lobby correto
    if (!searchParams.has("lobby")) {
      searchParams.set("lobby", user.lobbyId.toString());
      return NextResponse.redirect(`${req.nextUrl.origin}/${pathname}?${searchParams.toString()}`);
    }

    // Se o lobbyId na query string for diferente do lobbyId do usuário, atualize-o e redirecione para o lobby correto
    if (searchParams.get("lobby") !== user.lobbyId.toString()) {
      searchParams.set("lobby", user.lobbyId.toString());
      return NextResponse.redirect(`${req.nextUrl.origin}/${pathname}?${searchParams.toString()}`);
    }
  }


  return NextResponse.next();
}
