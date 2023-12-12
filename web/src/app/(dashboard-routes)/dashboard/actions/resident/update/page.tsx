import { ResidentUpdateForm } from "@/components/member/residentUpdateForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atualizar Morador",
};
export default function UpdateResident() {
  return (
    <section className="flex flex-col justify-center items-center mb-12">
      <h1 className="text-4xl mt-2 mb-4">Atualizar Morador</h1>
      <ResidentUpdateForm />
    </section>
  );
}
