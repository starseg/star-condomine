import DeviceModelTable from "@/components/device/model/deviceModelTable";
import { Menu } from "@/components/menu";
import { buttonVariants } from "@/components/ui/button";
import { FilePlus } from "@phosphor-icons/react/dist/ssr";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Modelos de dispositivos",
};

export default async function Device() {
  return (
    <>
      <Menu />
      <section className="max-w-5xl mx-auto mb-24">
        <h1 className="text-4xl text-center mb-4">Modelos de dispositivo</h1>
        <div className="max-h-[60vh] overflow-x-auto">
          <DeviceModelTable />
        </div>
        <div className="mt-6 flex gap-4 items-center">
          <Link
            href={`deviceModel/new`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex gap-2 text-xl items-center">
              <FilePlus size={24} /> Registrar modelo
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
