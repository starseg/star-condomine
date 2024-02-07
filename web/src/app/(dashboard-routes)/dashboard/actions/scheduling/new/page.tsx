import { SchedulingForm } from "@/components/scheduling/schedulingForm";
import { Menu } from "@/components/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agendar Acesso",
};
export default function AddScheduling({
  searchParams,
}: {
  searchParams?: { lobby: string };
}) {
  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Agendar Acesso</h1>
        <SchedulingForm />
      </section>
    </>
  );
}
