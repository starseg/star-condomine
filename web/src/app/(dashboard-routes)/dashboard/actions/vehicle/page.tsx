import VehicleTable from "@/components/vehicle/vehicleTable";
import { Menu } from "@/components/menu";
import { Metadata } from "next";
import Search from "@/components/search";

export const metadata: Metadata = {
  title: "Veículos",
};

export default async function Vehicle({
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
      <section className="mx-auto mb-24 px-2 max-w-5xl">
        <div className="flex md:flex-row flex-col justify-between mb-4">
          <h1 className="text-4xl text-center">Veículos</h1>
          <Search
            placeholder="Buscar..."
            pagination={false}
            classname="md:w-1/2 lg:w-4/12 items-center"
          />
        </div>
        <VehicleTable lobby={lobby} />
      </section>
    </>
  );
}
