import ProblemTable from "@/components/problem/problemTable";
import { Menu } from "@/components/menu";
import { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { FilePlus } from "@phosphor-icons/react/dist/ssr";
import Search from "@/components/search";

export const metadata: Metadata = {
  title: "Problemas da portaria",
};

export default async function Problems({
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
        <div className="flex md:flex-row flex-col justify-between mb-4">
          <h1 className="mb-2 text-4xl text-center">Problemas da portaria</h1>
          <Search
            placeholder="Buscar..."
            pagination={false}
            classname="md:w-1/2 lg:w-4/12 items-center"
          />
        </div>
        <div className="max-h-[60vh] overflow-x-auto">
          <ProblemTable lobby={lobby} />
        </div>
        <div className="flex items-center gap-4 mt-6">
          <Link
            href={`problem/new?lobby=${lobby}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex items-center gap-2 text-xl">
              <FilePlus size={24} /> Registrar problema
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
