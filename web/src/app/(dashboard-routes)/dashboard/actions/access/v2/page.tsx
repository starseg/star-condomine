import AccessTable from "@/components/access/accessTable";
import NewAccessTable from "@/components/access/newTable";
import { Menu } from "@/components/menu";
import Search from "@/components/search";
import { buttonVariants } from "@/components/ui/button";
import { FilePlus, FileSearch } from "@phosphor-icons/react/dist/ssr";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Acessos",
};

export default async function Access({
  searchParams,
}: {
  searchParams?: {
    lobby?: string;
    c?: string;
  };
}) {
  const lobby = searchParams?.lobby || "";
  const control = searchParams?.c || "";
  return (
    <>
      <Menu url={`/dashboard/actions?id=${lobby}`} />
      <section className="max-w-5xl mx-auto mb-24">
        <h1 className="text-4xl text-center">Acessos</h1>
        <div className="flex justify-end mb-4">
          <Search placeholder="Buscar..." pagination={false} />
        </div>
        <NewAccessTable lobby={lobby} />
      </section>
    </>
  );
}
