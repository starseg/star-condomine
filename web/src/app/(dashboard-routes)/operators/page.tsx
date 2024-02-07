import { Menu } from "@/components/menu";
import OperatorTable from "@/components/operator/operatorTable";
import { Button } from "@/components/ui/button";
import { FilePlus } from "@phosphor-icons/react/dist/ssr";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Operadores",
};

export default function Operators() {
  return (
    <>
      <Menu url={`/dashboard`} />
      <section className="max-w-5xl mx-auto mb-24">
        <h1 className="text-4xl text-center">Operadores do sistema</h1>
        <OperatorTable />
        <Link
          href={"operators/new"}
          className="flex justify-end max-w-[90%] mx-auto mt-4"
        >
          <Button className="self-end text-lg flex gap-2">
            <FilePlus size={24} />
            Adicionar operador
          </Button>
        </Link>
      </section>
    </>
  );
}
