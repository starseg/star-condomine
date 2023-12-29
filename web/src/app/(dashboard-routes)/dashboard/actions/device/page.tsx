import DeviceTable from "@/components/device/deviceTable";
import { Menu } from "@/components/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dispositivos",
};

export default async function Device({
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
        <h1 className="text-4xl mt-2 mb-4 text-center">Dispositivos</h1>
        <div className="max-h-[60vh] overflow-x-auto">
          <DeviceTable lobby={lobby} />
        </div>
      </section>
    </>
  );
}
