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
      <Menu url={`/dashboard/actions?id=${lobby}`} />
      <section className="max-w-5xl mx-auto mb-24">
        <div className="flex justify-between mb-4">
          <h1 className="text-4xl text-center">Veículos</h1>
          <Search placeholder="Buscar..." pagination={false} classname="md:w-1/2 lg:w-4/12 items-center" />
        </div>
        <VehicleTable lobby={lobby} />
      </section>
    </>
  );
}
