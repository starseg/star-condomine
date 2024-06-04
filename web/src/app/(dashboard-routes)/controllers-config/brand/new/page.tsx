import { BrandForm } from "@/components/controllers-config/brandForm";
import { Menu } from "@/components/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrar marca",
};
export default function AddBrand() {
  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Registrar marca</h1>
        <BrandForm />
      </section>
    </>
  );
}
