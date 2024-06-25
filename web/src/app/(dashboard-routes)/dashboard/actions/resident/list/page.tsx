import ResidentFullList from "@/components/member/residentFullList";
import { Menu } from "@/components/menu";
import Search from "@/components/search";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moradores",
};

export default async function VisitorList({
  searchParams,
}: {
  searchParams?: {
    lobby?: string;
  };
}) {
  const lobby = searchParams?.lobby || "";

  return (
    <>
      <Menu url="" />
      <section className="max-w-5xl mx-auto mb-24">
        <h1 className="text-4xl text-center">Detalhes dos moradores</h1>
        <div className="flex justify-end mb-4">
          <Search placeholder="Buscar..." pagination={false} />
        </div>
        <ResidentFullList lobby={lobby} />
      </section>
    </>
  );
}
