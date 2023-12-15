import VehicleTable from "@/components/vehicle/vehicleTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Veículos do morador",
};

export default async function Vehicles() {
  return (
    <section className="max-w-5xl mx-auto mb-24">
      <h1 className="text-4xl mt-2 mb-4 text-center">Veículos do morador</h1>
      <div className="max-h-[60vh] overflow-x-auto">
        <VehicleTable />
      </div>
    </section>
  );
}
