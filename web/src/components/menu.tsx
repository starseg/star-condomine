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
  Eye,
  List,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";

const showPermissionError = () => {
  Swal.fire({
    title: "Operação não permitida",
    text: "Sua permissão de usuário não realizar essa ação.",
    icon: "warning",
  });
};

export function Menu({ url = "" }: { url?: string }) {
  const { data: session } = useSession();
  return (
    <header className="flex flex-row w-full justify-between md:justify-around items-center p-4">
      {url === "" ? (
        <BackButton />
      ) : url === "x" ? (
        <div></div>
      ) : (
        <Link href={`${url}`}>
          <ArrowLeft size={"2.5rem"} />
        </Link>
      )}
      <Image
        src="/logo.svg"
        alt="Logo Star Condomine"
        width={419}
        height={68}
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
          <DropdownMenuItem>
            {session?.payload.user.type === "USER" ? (
              <button
                className="flex justify-center items-center gap-2"
                onClick={showPermissionError}
              >
                <UsersThree size={"24px"} /> Operadores
              </button>
            ) : (
              <Link
                href={"/operators"}
                className="flex justify-center items-center gap-2"
              >
                <UsersThree size={"24px"} /> Operadores
              </Link>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem>
            {session?.payload.user.type === "USER" ? (
              <button
                className="flex justify-center items-center gap-2"
                onClick={showPermissionError}
              >
                <Eye size={"24px"} /> Monitoramento
              </button>
            ) : (
              <Link
                href={"/logging"}
                className="flex justify-center items-center gap-2"
              >
                <Eye size={"24px"} /> Monitoramento
              </Link>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
