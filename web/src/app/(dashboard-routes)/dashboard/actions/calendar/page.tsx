import CalendarTable from "@/components/calendar/calendarTable";
import { Menu } from "@/components/menu";
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
      <Menu url={`/dashboard/actions?id=${lobby}`} />
      <section className="max-w-5xl mx-auto mb-24">
        <h1 className="text-4xl text-center mb-2">Calendário de feriados</h1>
        <div className="max-h-[60vh] overflow-x-auto">
          <CalendarTable lobby={lobby} />
        </div>
        <div className="mt-6 flex gap-4 items-center">
          <Link
            href={`calendar/new?lobby=${lobby}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex gap-2 text-xl items-center">
              <FilePlus size={24} /> Registrar data
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
