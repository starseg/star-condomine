import Image from "next/image";
import { ResidentForm } from "../components/residentForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastro de morador - Star Seg",
};

export default function GuestNewResident() {
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
        <h1 className="text-2xl mt-2 mb-4 px-4 text-center">
          Cadastre-se no sistema de portarias da Star Seg
        </h1>
        <ResidentForm />
      </section>
    </>
  );
}
