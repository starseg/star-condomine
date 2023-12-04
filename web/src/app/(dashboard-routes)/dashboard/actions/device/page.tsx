import { DeviceTable } from "@/components/device/deviceTable";

export default function Device() {
  return (
    <section className="max-w-5xl mx-auto mb-24">
      <h1 className="text-4xl mt-2 mb-4 text-center">Dispositivos</h1>
      <DeviceTable/>
    </section>
  );
}
