import Image from "next/image";
import { VisitorForm } from "../components/visitorForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastro de visitante - Star Seg",
};

export default function GuestNewVisitor() {
  return (
    <>
      <section className="flex flex-col justify-center items-center mb-12">
        <Image
          src="/portaria-online.png"
          alt="Robozinho da portaria online da starseg"
          width={278}
          height={224}
          priority={true}
          className="my-4"
        />
        <h1 className="text-2xl mt-2 mb-4 px-4 text-center w-full md:w-3/4 lg:w-1/2 2xl:w-1/3">
          Cadastre um visitante ou prestador de serviços no sistema de portarias
          da Star Seg
        </h1>
        <VisitorForm />
      </section>
    </>
  );
}
