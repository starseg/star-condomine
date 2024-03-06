import { ResidentForm } from "@/components/member/residentForm";
import { Menu } from "@/components/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrar morador",
};

export default function NewResident() {
  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Registrar morador</h1>
        <ResidentForm />
      </section>
    </>
  );
}
