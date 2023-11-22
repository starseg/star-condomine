"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="flex flex-col max-w-[453px]">
        <h1 className="self-start pl-4">Seja bem-vindo ao</h1>
        <Image
          src="/logo.png"
          alt="Logo Star Condomine"
          width={453}
          height={74}
          priority={true}
        />
        <Link href={"login"} className="self-end mr-4">
          <Button>Entrar na plataforma</Button>
        </Link>
      </div>
    </main>
  );
}
