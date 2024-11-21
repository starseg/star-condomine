import CalendarTable from "@/components/calendar/calendarTable";
import { Menu } from "@/components/menu";
import Search from "@/components/search";
import { buttonVariants } from "@/components/ui/button";
import { FilePlus } from "@phosphor-icons/react/dist/ssr";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Calendário de feriados",
};

export default async function Calendar({
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
          <h1 className="mb-2 text-4xl text-center">Calendário de feriados</h1>
          <Search
            placeholder="Buscar..."
            pagination={false}
            classname="md:w-1/2 lg:w-4/12 items-center"
          />
        </div>
        <div className="max-h-[60vh] overflow-x-auto">
          <CalendarTable lobby={lobby} />
        </div>
        <div className="flex items-center gap-4 mt-6">
          <Link
            href={`calendar/new?lobby=${lobby}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex items-center gap-2 text-xl">
              <FilePlus size={24} /> Registrar data
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
