import DeviceTable from "@/components/device/deviceTable";
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
    <section className="max-w-5xl mx-auto mb-24">
      <h1 className="text-4xl mt-2 mb-4 text-center">Dispositivos</h1>
      <DeviceTable lobby={lobby}/>
    </section>
  );
}
