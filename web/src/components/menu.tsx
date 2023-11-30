"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BackButton from "./backButton";
import Image from "next/image";
import LogoutButton from "./logoutButton";
import Link from "next/link";
import { GearSix, List, UsersThree } from "@phosphor-icons/react/dist/ssr";

export function Menu() {
  return (
    <header className="flex flex-row w-full justify-around items-center p-2">
      <BackButton />
      <Image
        src="/logo.png"
        alt="Logo Star Condomine"
        width={453}
        height={74}
        priority={true}
        className="max-w-[80%]"
      />
      <DropdownMenu>
        <DropdownMenuTrigger>
          <List size={"2.5rem"}/>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="px-4">
          <DropdownMenuLabel>Menu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href={""} className="flex justify-center items-center gap-2">
              <UsersThree size={"24px"}/> Operadores
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={""} className="flex justify-center items-center gap-2">
              <GearSix size={"24px"}/> Configurar portarias
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogoutButton/>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
