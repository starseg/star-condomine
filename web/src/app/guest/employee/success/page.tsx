"use client";
import { Button } from "@/components/ui/button";
import { Check, FilePlus } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Success() {
  // PEGA O ID DA PORTARIA
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const lobbyParam = params.get("lobby");
  const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;
  return (
    <section className="flex flex-col justify-center items-center mb-12">
      <Image
        src="/portaria-online.png"
        alt="Robozinho da portaria online da starseg"
        width={278}
        height={224}
        priority={true}
        className="my-4"
      />
      <Check className="text-green-400 w-16 h-16" />
      <h1 className="text-4xl mt-2 text-center">
        Cadastro realizado com sucesso!
      </h1>
      <p className="m-4 text-center">
        Esse formulário pode ser preenchido por cada funcionário.
      </p>
      <Button className="text-lg">
        <Link
          href={`/guest/employee?lobby=${lobby}`}
          className="flex gap-2 items-center"
        >
          <FilePlus size={24} />
          Cadastrar novo funcionário
        </Link>
      </Button>
    </section>
  );
}
