import { CalendarForm } from "@/components/calendar/calendarForm";
import { Menu } from "@/components/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrar Data",
};
export default function AddDate({
  searchParams,
}: {
  searchParams?: { lobby: string };
}) {
  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Registrar Data</h1>
        <CalendarForm />
      </section>
    </>
  );
}
