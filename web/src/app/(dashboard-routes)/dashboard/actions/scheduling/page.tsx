import SchedulingTable from "@/components/scheduling/schedulingTable";
import { Menu } from "@/components/menu";
import Search from "@/components/search";
import { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { FilePlus, FileSearch } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Agendamentos",
};

export default async function Scheduling({
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
      <Menu url={`/dashboard/actions?lobby=${lobby}`} />
      <section className="mx-auto mb-24 px-2 max-w-5xl">
        <div className="flex md:flex-row flex-col justify-between mb-4">
          <h1 className="text-4xl text-center">Agendamentos</h1>
          <Search
            placeholder="Buscar..."
            pagination={false}
            classname="md:w-1/2 lg:w-4/12 items-center"
          />
        </div>
        <SchedulingTable lobby={lobby} />
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <Link
            href={`scheduling/new?lobby=${lobby}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex items-center gap-2 text-xl">
              <FilePlus size={24} /> Agendar
            </p>
          </Link>
          <Link
            href={`access?lobby=${lobby}&c=${control}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex items-center gap-2 text-xl">
              <FileSearch size={24} /> Acessos
            </p>
          </Link>
          <Link
            href={`visitor?lobby=${lobby}&c=${control}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex items-center gap-2 text-xl">
              <FileSearch size={24} /> Visitantes
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
