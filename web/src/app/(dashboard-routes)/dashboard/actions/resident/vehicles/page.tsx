import ActionButton from "@/components/actionButton";
import { Menu } from "@/components/menu";
import { Button } from "@/components/ui/button";
import MemberVehicleTable from "@/components/vehicle/memberVehicleTable";
import { FilePlus } from "@phosphor-icons/react/dist/ssr";
import { Metadata } from "next";
import Link from "next/link";

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
        <h1 className="text-4xl text-center">Veículos do morador</h1>
        <div className="max-h-[60vh] overflow-x-auto mb-4">
          <MemberVehicleTable lobby={lobby} member={id} />
        </div>
        <Link href={`/dashboard/actions/vehicle/new?lobby=${lobby}&id=${id}`}>
          <Button className="text-lg flex gap-2">
            <FilePlus />
            Registrar novo
          </Button>
        </Link>
      </section>
    </>
  );
}
