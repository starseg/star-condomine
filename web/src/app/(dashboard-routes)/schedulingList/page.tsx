import { Menu } from "@/components/menu";
import SchedulingListItems from "@/components/scheduling/list/schedulingList";
import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import { FilePlus } from "@phosphor-icons/react/dist/ssr";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Listas de agendamentos",
};

export default function SchedulingList() {
  return (
    <>
      <Menu url={`/dashboard`} />
      <section className="mx-auto mb-24 px-2 max-w-5xl">
        <div className="flex md:flex-row flex-col justify-between mb-2">
          <h1 className="mb-2 text-4xl text-center">Listas de agendamentos</h1>
          <Search
            placeholder="Buscar..."
            pagination={false}
            classname="md:w-1/2 lg:w-4/12 items-center"
          />
        </div>
        <div className="max-h-[60vh] overflow-x-auto">
          <SchedulingListItems />
        </div>
        <div className="flex items-center gap-4 mt-4">
          <Link href={"schedulingList/new"}>
            <Button className="flex gap-2 text-lg self-end">
              <FilePlus size={24} />
              Criar lista
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
