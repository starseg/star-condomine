import EmployeeFullList from "@/components/member/employeeFullList";
import { Menu } from "@/components/menu";
import Search from "@/components/search";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Funcionários",
};

export default async function VisitorList({
  searchParams,
}: {
  searchParams?: {
    lobby?: string;
  };
}) {
  const lobby = searchParams?.lobby || "";

  return (
    <>
      <Menu url="" />
      <section className="max-w-5xl mx-auto mb-24">
        <div className="flex justify-between mb-4">
          <h1 className="text-4xl text-center">Detalhes dos funcionários</h1>
          <Search placeholder="Buscar..." pagination={false} classname="md:w-1/2 lg:w-4/12 items-center" />
        </div>
        <div className="max-h-[60vh] overflow-x-auto">
          <EmployeeFullList lobby={lobby} />
        </div>
      </section>
    </>
  );
}
