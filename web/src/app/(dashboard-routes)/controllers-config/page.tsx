import BrandTable from "@/components/controllers-config/brandTable";
import { Menu } from "@/components/menu";
import { buttonVariants } from "@/components/ui/button";
import { FilePlus, Gear } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default async function ControliD() {
  return (
    <>
      <Menu />
      <section className="max-w-5xl mx-auto mb-6">
        <h1 className="flex gap-2 items-center text-4xl pb-8">
          <Gear /> Configurações gerais dos controladores
        </h1>
        <div className="flex justify-between pb-2">
          <h2 className="text-2xl">Marcas</h2>
          <Link
            href="controllers-config/brand/new"
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex gap-2 text-lg items-center">
              <FilePlus size={24} /> Registrar marca
            </p>
          </Link>
        </div>
        <div className="max-h-[60vh] overflow-x-auto">
          <BrandTable />
        </div>
      </section>
    </>
  );
}
