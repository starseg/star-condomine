import ReportTable from "@/components/report/reportTable";
import { Menu } from "@/components/menu";
import { Metadata } from "next";
import { DatePickerWithRange } from "@/components/report/calendarRange";
import { Button } from "@/components/ui/button";
import { FilePdf } from "@phosphor-icons/react/dist/ssr";

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
      <Menu url={`/dashboard/actions?id=${lobby}`} />
      <section className="max-w-5xl mx-auto mb-24">
        <h1 className="text-4xl mt-2 mb-4 text-center">Relatório</h1>
        <div className="flex justify-between mb-4">
          <DatePickerWithRange />
          <Button variant={"outline"} className="flex gap-2 px-8">
            {" "}
            <FilePdf size={24} /> Gerar arquivo
          </Button>
        </div>
        <div className="max-h-[60vh] overflow-x-auto">
          <ReportTable lobby={lobby} />
        </div>
      </section>
    </>
  );
}
