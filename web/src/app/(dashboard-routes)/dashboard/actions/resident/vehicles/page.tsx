import ActionButton from "@/components/actionButton";
import { Menu } from "@/components/menu";
import MemberVehicleTable from "@/components/vehicle/memberVehicleTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Veículos do morador",
};

export default async function Vehicles({
  searchParams,
}: {
  searchParams?: {
    lobby?: string;
    id?: string;
  };
}) {
  const lobby = searchParams?.lobby || "";
  const id = searchParams?.id || "";
  return (
    <>
      <Menu />
      <section className="max-w-5xl mx-auto mb-24">
        <h1 className="text-4xl mt-2 mb-4 text-center">Veículos do morador</h1>
        <div className="max-h-[60vh] overflow-x-auto mb-4">
          <MemberVehicleTable lobby={lobby} member={id} />
        </div>
        <ActionButton
          url={`/dashboard/actions/vehicle/new?lobby=${lobby}`}
          type="+"
          text="Registrar"
        />
      </section>
    </>
  );
}
