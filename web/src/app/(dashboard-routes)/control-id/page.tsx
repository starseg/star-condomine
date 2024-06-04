import { Menu } from "@/components/menu";
import { Gear } from "@phosphor-icons/react/dist/ssr";

export default async function ControliD() {
  return (
    <>
      <Menu />
      <section className="max-w-5xl mx-auto mb-6">
        <h1 className="flex gap-2 items-center text-4xl pb-4">
          <Gear /> Configurações Control iD
        </h1>
      </section>
    </>
  );
}
