import { Menu } from "@/components/menu";
import { Gear } from "@phosphor-icons/react/dist/ssr";
import { ControliDUpdateProvider } from "@/contexts/control-id-update-context";
import TimeSpanForm from "@/components/control-id/time-span/timeSpanForm";
import TimeSpanTable from "@/components/control-id/time-span/timeSpanTable";
import TimeZoneForm from "@/components/control-id/time-zone/timeZoneForm";
import TimeZoneTable from "@/components/control-id/time-zone/timeZoneTable";
import AccessRuleForm from "@/components/control-id/access-rule/accessRuleForm";
import AccessRuleTable from "@/components/control-id/access-rule/accessRuleTable";
import GroupForm from "@/components/control-id/group/groupForm";
import GroupTable from "@/components/control-id/group/groupTable";

export default async function ControliD() {
  return (
    <ControliDUpdateProvider>
      <Menu />
      <section className="max-w-5xl mx-auto mb-6">
        <h1 className="flex gap-2 items-center text-4xl pb-4">
          <Gear /> Configurações Control iD
        </h1>
        <div className="w-full flex justify-between items-end pb-2">
          <h2 className="text-xl">Horários</h2>
          <TimeZoneForm />
        </div>
        <TimeZoneTable />
        <div className="w-full flex justify-between items-end mt-4 pb-2">
          <h2 className="text-xl">Intervalos</h2>
          <TimeSpanForm />
        </div>
        <TimeSpanTable />
        <div className="w-full flex justify-between items-end mt-4 pb-2">
          <h2 className="text-xl">Regras de acesso</h2>
          <AccessRuleForm />
        </div>
        <AccessRuleTable />
        <div className="w-full flex justify-between items-end mt-4 pb-2">
          <h2 className="text-xl">Grupos</h2>
          <GroupForm />
        </div>
        <GroupTable />
      </section>
    </ControliDUpdateProvider>
  );
}
