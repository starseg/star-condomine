"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="flex flex-col max-w-[453px]">
        <h1 className="self-start">Seja bem-vindo ao</h1>
        <Image
          src="/logo.svg"
          alt="Logo Star Condomine"
          width={417}
          height={36}
          priority={true}
          className="mt-2 mb-4"
        />
        <Link href={"login"} className="self-end">
          <Button className="text-lg">Entrar na plataforma</Button>
        </Link>
      </div>
    </main>
  );
}
