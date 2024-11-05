import ReportTable from "@/components/report/reportTable";
import { Menu } from "@/components/menu";
import { Metadata } from "next";
import { DatePickerWithRange } from "@/components/report/calendarRange";

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
      <section className="max-w-5xl mx-auto mb-24">
        <div className="flex justify-between mb-4">
          <h1 className="text-4xl text-center">Relatório</h1>
          <DatePickerWithRange />
        </div>
        <div>
          <ReportTable lobby={lobby} />
        </div>
      </section>
    </>
  );
}
