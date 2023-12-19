import { OperatorForm } from "@/components/operator/operatorForm";
import { Menu } from "@/components/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastrar operador",
};
export default function AddOperator() {
  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Cadastrar operador</h1>
        <OperatorForm />
      </section>
    </>
  );
}
