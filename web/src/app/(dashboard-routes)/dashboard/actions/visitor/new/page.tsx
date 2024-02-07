import { VisitorForm } from "@/components/visitor/visitorForm";
import { Menu } from "@/components/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrar visitante",
};

export default function NewVisitor({
  searchParams,
}: {
  searchParams?: { lobby: string };
}) {
  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Registrar visitante</h1>
        <VisitorForm />
      </section>
    </>
  );
}
