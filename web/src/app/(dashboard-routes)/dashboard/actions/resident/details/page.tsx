import ResidentDetails from "@/components/member/residentDetails";
import { Menu } from "@/components/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalhes do morador",
};

export default async function Member({
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
        <h1 className="text-4xl text-center">Detalhes do morador</h1>
        <ResidentDetails id={Number(id)} />
      </section>
    </>
  );
}
