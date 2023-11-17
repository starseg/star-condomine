"use client";
import Image from "next/image";
import { InputForm } from "@/components/loginForm";

export default function Home() {
  return (
    <main className="dark flex min-h-screen flex-col items-center justify-center p-24 bg-stone-950">
      <Image
        src="/logo.png"
        alt="Logo Star Condomine"
        width={400}
        height={100}
        className="pb-8"
      />
      {/* <h1 className="text-stone-50 text-4xl pb-8">Entrar na plataforma</h1> */}
      <InputForm />
    </main>
  );
}
