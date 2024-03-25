import { Menu } from "@/components/menu";
import { SchedulingListForm } from "@/components/scheduling/list/schedulingListForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar lista de agendamento",
};

export default function Notification() {
  return (
    <>
      <Menu url={`/dashboard`} />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 text-center">
          Criar lista de agendamento
        </h1>
        <SchedulingListForm />
      </section>
    </>
  );
}
