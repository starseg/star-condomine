"use client";
import Image from "next/image";
import { LoginForm } from "@/components/loginForm";
import BackButton from "@/components/backButton";

export default function Login() {
  return (
    <>
      <BackButton className="absolute top-8 left-8" />
      <section className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
        <Image
          src="/logo.svg"
          alt="Logo Star Condomine"
          width={453}
          height={74}
          priority={true}
          className="pb-8"
        />
        <LoginForm />
      </section>
    </>
  );
}
