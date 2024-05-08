import { CredentialsForm } from "@/components/member/credentialsForm";
import { Menu } from "@/components/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrar credencial",
};
export default function AddCredential() {
  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Registrar Credencial</h1>
        <CredentialsForm />
      </section>
    </>
  );
}
