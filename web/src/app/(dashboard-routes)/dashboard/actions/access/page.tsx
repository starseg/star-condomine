import AccessTable from "@/components/access/accessTable";
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
        <h1 className="text-4xl mt-2 mb-4 text-center">Acessos</h1>
        <div className="flex justify-end mb-4">
          <Search placeholder="Buscar..." pagination={false} />
        </div>
        <div className="max-h-[60vh] overflow-x-auto">
          <AccessTable lobby={lobby} />
        </div>
        <div className="mt-4 flex gap-4 items-center">
          <Link
            href={`access/new?lobby=${lobby}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex gap-2 text-xl items-center">
              <FilePlus size={24} /> Registrar Acesso
            </p>
          </Link>
          <Link
            href={`scheduling?lobby=${lobby}&c=${control}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex gap-2 text-xl items-center">
              <FileSearch size={24} /> Agendamentos
            </p>
          </Link>
          <Link
            href={`visitor?lobby=${lobby}&c=${control}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex gap-2 text-xl items-center">
              <FileSearch size={24} /> Visitantes
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
