import VisitorDetails from "@/components/visitor/visitorDetails";
import { Menu } from "@/components/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalhes do visitante",
};

export default async function Visitor({
  searchParams,
}: {
  searchParams?: {
    id?: string;
  };
}) {
  const id = searchParams?.id || "";
  return (
    <>
      <Menu />
      <section className="max-w-5xl mx-auto mb-24">
        <h1 className="text-4xl text-center">Detalhes do visitante</h1>
        <VisitorDetails id={Number(id)} />
      </section>
    </>
  );
}
