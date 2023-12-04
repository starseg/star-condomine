import { DeviceForm } from "@/components/device/deviceForm";

export default function AddDevice() {
  return (
    <section className="flex flex-col justify-center items-center mb-12">
      <h1 className="text-4xl mt-2 mb-4">Registrar Dispositivo</h1>
      <DeviceForm/>
    </section>
  );
}
