import { DeviceUpdateForm } from "@/components/device/deviceUpdateForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atualizar dispositivo",
};
export default function UpdateDevice() {
  return (
    <section className="flex flex-col justify-center items-center mb-12">
      <h1 className="text-4xl mt-2 mb-4">Atualizar Dispositivo</h1>
      <DeviceUpdateForm />
    </section>
  );
}
