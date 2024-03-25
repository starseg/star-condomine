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
      <section className="max-w-5xl mx-auto mb-24">
        <h1 className="text-4xl text-center mb-2">Listas de agendamentos</h1>
        <div className="flex justify-end mb-2">
          <Search placeholder="Buscar..." pagination={false} />
        </div>
        <SchedulingListItems />
        <div className="mt-4 flex gap-4 items-center">
          <Link href={"schedulingList/new"}>
            <Button className="self-end text-lg flex gap-2">
              <FilePlus size={24} />
              Criar lista
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
