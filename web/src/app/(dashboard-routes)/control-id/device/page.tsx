import { ControliDUpdateProvider } from "@/contexts/control-id-update-context";
import { Menu } from "@/components/menu";
import { Metadata } from "next";
import Login from "@/components/control-id/device/login";
import Push from "@/components/control-id/device/push";

export const metadata: Metadata = {
  title: "Sincronizar dispositivo",
};

export default async function ControliDDevices() {
  return (
    <ControliDUpdateProvider>
      <Menu />
      <section className="flex flex-col justify-center items-center gap-4 mb-12">
        <h1 className="text-4xl text-center">Sincronizar dispositivo</h1>
        {/* <Login /> */}
        <Push />
      </section>
    </ControliDUpdateProvider>
  );
}
