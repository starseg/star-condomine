import ReportTable from "@/components/report/reportTable";
import { Menu } from "@/components/menu";
import { Metadata } from "next";
import { DatePickerWithRange } from "@/components/report/calendarRange";
import { AccessLogs } from "@/components/control-id/access-logs/accessLogs";

export const metadata: Metadata = {
  title: "Relatório",
};

export default async function Report({
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
      <section className="mx-auto mb-24 max-w-5xl">
        <div className="flex justify-between mb-4">
          <h1 className="text-4xl text-center">Relatório</h1>
          <DatePickerWithRange />
        </div>
        <div>
          <ReportTable lobby={lobby} />
        </div>
        <div className="bg-stone-500 my-4 px-2 w-full h-px" />
        <div className="my-2">
          <AccessLogs />
        </div>
      </section>
    </>
  );
}
