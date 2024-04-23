import ManagementPanel from "@/components/manager/managementPanel";
import { Menu } from "@/components/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Painel Gerencial",
};

export default function Management() {
  return (
    <>
      <Menu />
      <section className="max-w-5xl mx-auto mb-24">
        <h1 className="text-4xl text-center mb-2">Painel Gerencial</h1>
        <div>
          <ManagementPanel />
        </div>
      </section>
    </>
  );
}
