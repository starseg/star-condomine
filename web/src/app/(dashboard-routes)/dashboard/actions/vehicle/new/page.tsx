import { VehicleForm } from "@/components/vehicle/vehicleForm";
import { Menu } from "@/components/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrar Veículo",
};
export default function AddVehicle({
  searchParams,
}: {
  searchParams?: { lobby: string };
}) {
  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Registrar Veículo</h1>
        <VehicleForm />
      </section>
    </>
  );
}
