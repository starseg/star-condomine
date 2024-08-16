import AccessRuleTimeZoneForm from "@/components/control-id/access-rule-time-zone/accessRuleTimeZoneForm";
import AccessRuleTimeZoneTable from "@/components/control-id/access-rule-time-zone/accessRuleTimeZoneTable";
import AccessRuleForm from "@/components/control-id/access-rule/accessRuleForm";
import AccessRuleTable from "@/components/control-id/access-rule/accessRuleTable";
import SyncDevice from "@/components/control-id/device/syncDevice";
import GroupAccessRuleForm from "@/components/control-id/group-access-rule/groupAccessRuleForm";
import GroupAccessRuleTable from "@/components/control-id/group-access-rule/groupAccessRuleTable";
import GroupForm from "@/components/control-id/group/groupForm";
import GroupTable from "@/components/control-id/group/groupTable";
import MemberGroupForm from "@/components/control-id/member-group/memberGroupForm";
import MemberGroupTable from "@/components/control-id/member-group/memberGroupTable";
import TimeSpanForm from "@/components/control-id/time-span/timeSpanForm";
import TimeSpanTable from "@/components/control-id/time-span/timeSpanTable";
import TimeZoneForm from "@/components/control-id/time-zone/timeZoneForm";
import { TimeZoneSearchInDevice } from "@/components/control-id/time-zone/timeZoneSearchInDevice";
import TimeZoneTable from "@/components/control-id/time-zone/timeZoneTable";
import { Menu } from "@/components/menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ControliDUpdateProvider } from "@/contexts/control-id-update-context";
import { ArrowsHorizontal } from "@phosphor-icons/react/dist/ssr";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configurações Control iD",
};

export default async function ControliDConfig({
  searchParams,
}: {
  searchParams?: {
    lobby?: string;
  };
}) {
  const lobby = searchParams?.lobby || "";
  return (
    <ControliDUpdateProvider>
      <Menu url={`/dashboard/actions?id=${lobby}`} />
      <section className="mx-auto mb-24 max-w-5xl">
        <div className="flex justify-between items-center my-2">
          <h1 className="text-3xl">Configurações Control iD</h1>
          <SyncDevice />
        </div>
        <Tabs
          defaultValue="times"
          className="flex flex-col justify-center items-center w-full"
        >
          <TabsList className="w-full">
            <TabsTrigger value="times">Horários</TabsTrigger>
            <TabsTrigger value="time-access" className="text-xl">
              <ArrowsHorizontal />
            </TabsTrigger>
            <TabsTrigger value="accessRules">Regras de acesso</TabsTrigger>
            <TabsTrigger value="group-access" className="text-xl">
              <ArrowsHorizontal />
            </TabsTrigger>
            <TabsTrigger value="groups">Grupos</TabsTrigger>
          </TabsList>
          <TabsContent className="p-4 border rounded w-full" value="times">
            <div className="flex justify-between items-end pb-2 w-full">
              <h2 className="text-xl">Horários</h2>
              <div className="flex gap-2">
                <TimeZoneForm />
                <TimeZoneSearchInDevice />
              </div>
            </div>
            <TimeZoneTable />
            <div className="flex justify-between items-end mt-4 pb-2 w-full">
              <h2 className="text-xl">Intervalos</h2>
              <TimeSpanForm />
            </div>
            <TimeSpanTable />
          </TabsContent>
          <TabsContent
            className="p-4 border rounded w-full"
            value="time-access"
          >
            <div className="flex justify-between items-end pb-2 w-full">
              <h2 className="text-xl">Regras de acesso x Horários</h2>
              <AccessRuleTimeZoneForm />
            </div>
            <AccessRuleTimeZoneTable />
          </TabsContent>
          <TabsContent
            className="p-4 border rounded w-full"
            value="accessRules"
          >
            <div className="flex justify-between items-end pb-2 w-full">
              <h2 className="text-xl">Regras de acesso</h2>
              <AccessRuleForm />
            </div>
            <AccessRuleTable />
          </TabsContent>
          <TabsContent
            className="p-4 border rounded w-full"
            value="group-access"
          >
            <div className="flex justify-between items-end pb-2 w-full">
              <h2 className="text-xl">Grupos x Regras de acesso</h2>
              <GroupAccessRuleForm />
            </div>
            <GroupAccessRuleTable />
          </TabsContent>
          <TabsContent className="p-4 border rounded w-full" value="groups">
            <div className="flex justify-between items-end pb-2 w-full">
              <h2 className="text-xl">Grupos</h2>
              <GroupForm />
            </div>
            <GroupTable />
            <div className="flex justify-between items-end mt-4 pb-2 w-full">
              <h2 className="text-xl">Membros x Grupos</h2>
              <MemberGroupForm />
            </div>
            <MemberGroupTable />
          </TabsContent>
        </Tabs>
      </section>
    </ControliDUpdateProvider>
  );
}
