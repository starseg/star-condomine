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
  GearSix,
  List,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import Clock from "./clock";

export function Menu({ url = "" }: { url?: string }) {
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
            <Link
              href={"operators"}
              className="flex justify-center items-center gap-2"
            >
              <UsersThree size={"24px"} /> Operadores
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={""} className="flex justify-center items-center gap-2">
              <GearSix size={"24px"} /> Configurar portarias
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
