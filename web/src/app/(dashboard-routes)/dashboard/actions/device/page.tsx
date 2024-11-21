import DeviceTable from "@/components/device/deviceTable";
import { Menu } from "@/components/menu";
import Search from "@/components/search";
import { buttonVariants } from "@/components/ui/button";
import { DeviceMobile, FilePlus } from "@phosphor-icons/react/dist/ssr";
import { Metadata } from "next";
import Link from "next/link";
import { SelectFilter } from "@/components/selectFilter";

export const metadata: Metadata = {
  title: "Dispositivos",
};

export default async function Device({
  searchParams,
}: {
  searchParams?: {
    lobby?: string;
    status?: string;
  };
}) {
  const lobby = searchParams?.lobby || "";
  const status = searchParams?.status || "";
  return (
    <>
      <Menu url={`/dashboard/actions?lobby=${lobby}`} />
      <section className="mx-auto mt-4 mb-24 px-2 max-w-5xl">
        <div className="flex md:flex-row flex-col justify-between mb-4">
          <h1 className="mb-2 text-4xl text-center">Dispositivos</h1>
          <div className="flex gap-2 md:w-1/2">
            <Search placeholder="Buscar..." pagination={false} />
            <SelectFilter
              defaultValue={"Todos"}
              values={[
                { label: "Todos", value: "Todos" },
                { label: "Ativos", value: "ACTIVE" },
                { label: "Inativos", value: "INACTIVE" },
              ]}
              label="Status"
              pagination={false}
              classname="w-1/4"
            />
          </div>
        </div>
        <div className="max-h-[60vh] overflow-x-auto">
          <DeviceTable lobby={lobby} />
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-6">
          <Link
            href={`device/new?lobby=${lobby}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex items-center gap-2 text-xl">
              <FilePlus size={24} /> Registrar dispositivo
            </p>
          </Link>
          <Link
            href="/deviceModel"
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex items-center gap-2 text-xl">
              <DeviceMobile size={24} /> Modelos de dispositivo
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
