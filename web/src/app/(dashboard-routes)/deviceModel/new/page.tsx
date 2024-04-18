import { DeviceModelForm } from "@/components/device/model/deviceModelForm";
import { Menu } from "@/components/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrar modelo de dispositivo",
};
export default function AddDeviceModel() {
  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Registrar modelo de dispositivo</h1>
        <DeviceModelForm />
      </section>
    </>
  );
}
