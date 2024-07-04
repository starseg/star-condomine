"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BackButton from "./backButton";
import Image from "next/image";
import LogoutButton from "./logoutButton";
import Link from "next/link";
import {
  ArrowLeft,
  BellRinging,
  BookBookmark,
  Envelope,
  Eye,
  List,
  ListChecks,
  PresentationChart,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import NotificationList from "./notification/notificationList";

export function Menu({ url = "" }: { url?: string }) {
  const { data: session } = useSession();
  return (
    <header className="flex flex-row w-full justify-between md:justify-around items-center p-4">
      {url === "" ? (
        <BackButton />
      ) : url === "bell" ? (
        <NotificationList />
      ) : (
        <Link href={`${url}`}>
          <ArrowLeft size={"2.5rem"} />
        </Link>
      )}
      <Image
        src="/logo.svg"
        alt="Logo Star Condomine"
        width={417}
        height={36}
        priority={true}
        className="max-w-[80%] hidden md:block"
      />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <List size={"2.5rem"} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="px-4">
          <DropdownMenuLabel>Menu</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {session?.payload.user.type === "ADMIN" && (
            <>
              <DropdownMenuItem>
                <Link
                  href={"/operators"}
                  className="flex justify-center items-center gap-2"
                >
                  <UsersThree size={"24px"} /> Operadores
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href={"/logging"}
                  className="flex justify-center items-center gap-2"
                >
                  <Eye size={"24px"} /> Monitoramento
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href={"/notification"}
                  className="flex justify-center items-center gap-2"
                >
                  <BellRinging size={"24px"} /> Notificações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href={"/manager"}
                  className="flex justify-center items-center gap-2"
                >
                  <PresentationChart size={"24px"} /> Painel gerencial
                </Link>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuItem>
            <Link
              href={"/schedulingList"}
              className="flex justify-center items-center gap-2"
            >
              <ListChecks size={"24px"} /> Lista de agendamentos
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href={"/feedback"}
              className="flex justify-center items-center gap-2"
            >
              <Envelope size={"24px"} /> Feedbacks
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <a
              href="https://northern-squirrel-23f.notion.site/Manual-Star-Condomine-14149e5d23a24c1ab3a9a199478ee9d6"
              target="_blank"
              className="flex justify-center items-center gap-2"
            >
              <BookBookmark size={"24px"} /> Manual
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
