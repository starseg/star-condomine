import AccessRuleTimeZoneForm from "@/components/control-id/access-rule-time-zone/accessRuleTimeZoneForm";
import AccessRuleTimeZoneTable from "@/components/control-id/access-rule-time-zone/accessRuleTimeZoneTable";
import AccessRuleForm from "@/components/control-id/access-rule/accessRuleForm";
import AccessRuleTable from "@/components/control-id/access-rule/accessRuleTable";
import AreaAccessRuleForm from "@/components/control-id/area-access-rule/areaAccessRuleForm";
import AreaAccessRuleTable from "@/components/control-id/area-access-rule/areaAccessRuleTable";
import SyncDevice from "@/components/control-id/device/syncDevice";
import GroupAccessRuleForm from "@/components/control-id/group-access-rule/groupAccessRuleForm";
import GroupAccessRuleTable from "@/components/control-id/group-access-rule/groupAccessRuleTable";
import GroupForm from "@/components/control-id/group/groupForm";
import GroupTable from "@/components/control-id/group/groupTable";
import TimeSpanForm from "@/components/control-id/time-span/timeSpanForm";
import TimeSpanTable from "@/components/control-id/time-span/timeSpanTable";
import TimeZoneForm from "@/components/control-id/time-zone/timeZoneForm";
import TimeZoneTable from "@/components/control-id/time-zone/timeZoneTable";
import { Menu } from "@/components/menu";
import { buttonVariants } from "@/components/ui/button";
import { ControliDUpdateProvider } from "@/contexts/control-id-update-context";
import { Gear } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default async function ControliD() {
  return (
    <ControliDUpdateProvider>
      <Menu />
      {/* <section className="mx-auto mb-6 max-w-5xl">
        <h1 className="flex items-center gap-2 pb-4 text-4xl">
          <Gear /> Configurações Control iD
        </h1>
        <div className="flex gap-4">
          <SyncDevice />
          <Link
            href={"control-id/device"}
            className={buttonVariants({ variant: "default" })}
          >
            Testes em dispositivos
          </Link>
          <Link
            href={"control-id/accessRule"}
            className={buttonVariants({ variant: "default" })}
          >
            Definir regra de acesso
          </Link>
        </div>
        <div className="flex justify-between items-end pb-2 w-full">
          <h2 className="text-xl">Horários</h2>
          <TimeZoneForm />
        </div>
        <TimeZoneTable />
        <div className="flex justify-between items-end mt-4 pb-2 w-full">
          <h2 className="text-xl">Intervalos</h2>
          <TimeSpanForm />
        </div>
        <TimeSpanTable />
        <div className="flex justify-between items-end mt-4 pb-2 w-full">
          <h2 className="text-xl">Regras de acesso</h2>
          <AccessRuleForm />
        </div>
        <AccessRuleTable />
        <div className="flex justify-between items-end mt-4 pb-2 w-full">
          <h2 className="text-xl">Grupos</h2>
          <GroupForm />
        </div>
        <GroupTable />
        <div className="flex justify-between items-end mt-4 pb-2 w-full">
          <h2 className="text-xl">Grupos x Regras de acesso</h2>
          <GroupAccessRuleForm />
        </div>
        <GroupAccessRuleTable />
        <div className="flex justify-between items-end mt-4 pb-2 w-full">
          <h2 className="text-xl">Portarias x Regras de acesso</h2>
          <AreaAccessRuleForm />
        </div>
        <AreaAccessRuleTable />
        <div className="flex justify-between items-end mt-4 pb-2 w-full">
          <h2 className="text-xl">Regras de acesso x Horários</h2>
          <AccessRuleTimeZoneForm />
        </div>
        <AccessRuleTimeZoneTable />
      </section> */}
    </ControliDUpdateProvider>
  );
}
