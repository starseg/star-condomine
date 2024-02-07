import SchedulingDetails from "@/components/scheduling/schedulingDetails";
import { Menu } from "@/components/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalhes do agendamento",
};

export default async function Scheduling({
  searchParams,
}: {
  searchParams?: {
    id?: string;
  };
}) {
  const id = searchParams?.id || "";
  return (
    <>
      <Menu />
      <section className="max-w-5xl mx-auto mb-24">
        <h1 className="text-4xl text-center">Detalhes do agendamento</h1>
        <SchedulingDetails id={Number(id)} />
      </section>
    </>
  );
}
