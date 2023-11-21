"use client";
import Image from "next/image";
import { InputForm } from "@/components/loginForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <Image
        src="/logo.png"
        alt="Logo Star Condomine"
        width={400}
        height={100}
        className="pb-8"
      />
      <InputForm />
    </main>
  );
}
