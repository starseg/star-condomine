import AccessTable from "@/components/access/accessTable";
import { Menu } from "@/components/menu";
import Search from "@/components/search";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acessos",
};

export default async function Access({
  searchParams,
}: {
  searchParams?: {
    lobby?: string;
  };
}) {
  const lobby = searchParams?.lobby || "";
  return (
    <>
      <Menu url={`/dashboard/actions?id=${lobby}`} />
      <section className="max-w-5xl mx-auto mb-24">
        <h1 className="text-4xl mt-2 mb-4 text-center">Acessos</h1>
        <div className="flex justify-end mb-4">
          <Search placeholder="Buscar..." pagination={false} />
        </div>
        <div className="max-h-[60vh] overflow-x-auto">
          <AccessTable lobby={lobby} />
        </div>
      </section>
    </>
  );
}