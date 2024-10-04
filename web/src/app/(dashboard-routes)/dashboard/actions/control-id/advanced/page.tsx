import { ControliDUpdateProvider } from "@/contexts/control-id-update-context";
import { Menu } from "@/components/menu";
import { Metadata } from "next";
import Push from "@/components/control-id/device/push";

export const metadata: Metadata = {
  title: "Configurações Avançadas",
};

export default async function ControliDDevices() {
  return (
    <ControliDUpdateProvider>
      <Menu />
      <section className="flex flex-col justify-center items-center gap-4 mb-12">
        <h1 className="text-4xl text-center">Configurações Avançadas</h1>
        <Push />
      </section>
    </ControliDUpdateProvider>
  );
}