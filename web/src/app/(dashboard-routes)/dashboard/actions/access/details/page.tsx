import AccessDetails from "@/components/access/accessDetails";
import { Menu } from "@/components/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalhes do acesso",
};

export default async function Access({
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
        <h1 className="text-4xl mt-2 mb-4 text-center">Detalhes do acesso</h1>
        <AccessDetails id={Number(id)} />
      </section>
    </>
  );
}
