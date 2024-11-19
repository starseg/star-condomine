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
      <Menu url={`/dashboard/actions?lobby=${lobby}`} />
      <section className="mx-auto mb-24 px-2 max-w-5xl">
        <div className="flex md:flex-row flex-col justify-between mb-4 px-2">
          <h1 className="text-4xl text-center">Acessos</h1>
          <Search
            placeholder="Buscar..."
            pagination={false}
            classname="md:w-1/2 lg:w-4/12 items-center"
          />
        </div>
        <AccessTable lobby={lobby} />
      </section>
    </>
  );
}
