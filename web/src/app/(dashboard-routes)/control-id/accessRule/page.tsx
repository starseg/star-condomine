import { ControliDUpdateProvider } from "@/contexts/control-id-update-context";
import { Menu } from "@/components/menu";
import { Metadata } from "next";
import { AccessRuleFullRegister } from "@/components/control-id/access-rule/accessRuleFullRegister";

export const metadata: Metadata = {
  title: "Regras de acesso",
};

export default async function AccessRules() {
  return (
    <ControliDUpdateProvider>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl text-center">Criar regra de acesso</h1>
        {/* FORM PARA CRIAR RELAÇÕES */}
        <AccessRuleFullRegister />
        {/* SINCRONIZAÇÃO COM OS DISPOSITIVOS (?) */}
      </section>
    </ControliDUpdateProvider>
  );
}
