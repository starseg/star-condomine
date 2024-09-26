"use client";
import AccessRuleTimeZoneForm from "@/components/control-id/access-rule-time-zone/accessRuleTimeZoneForm";
import AccessRuleTimeZoneTable from "@/components/control-id/access-rule-time-zone/accessRuleTimeZoneTable";
import AccessRuleForm from "@/components/control-id/access-rule/accessRuleForm";
import { AccessRuleSearchInDevice } from "@/components/control-id/access-rule/accessRuleSearchInDevice";
import AccessRuleTable from "@/components/control-id/access-rule/accessRuleTable";
import { Monitor } from "@/components/control-id/device/monitor";
import SyncDevice from "@/components/control-id/device/syncDevice";
import GroupAccessRuleForm from "@/components/control-id/group-access-rule/groupAccessRuleForm";
import GroupAccessRuleTable from "@/components/control-id/group-access-rule/groupAccessRuleTable";
import GroupForm from "@/components/control-id/group/groupForm";
import { GroupSearchInDevice } from "@/components/control-id/group/groupSearchInDevice";
import GroupTable from "@/components/control-id/group/groupTable";
import MemberGroupForm from "@/components/control-id/member-group/memberGroupForm";
import MemberGroupTable from "@/components/control-id/member-group/memberGroupTable";
import TimeSpanForm from "@/components/control-id/time-span/timeSpanForm";
import { TimeSpanSearchInDevice } from "@/components/control-id/time-span/timeSpanSearchInDevice";
import TimeSpanTable from "@/components/control-id/time-span/timeSpanTable";
import TimeZoneForm from "@/components/control-id/time-zone/timeZoneForm";
import { TimeZoneSearchInDevice } from "@/components/control-id/time-zone/timeZoneSearchInDevice";
import TimeZoneTable from "@/components/control-id/time-zone/timeZoneTable";
import VisitorGroupForm from "@/components/control-id/visitor-group/visitorGroupForm";
import VisitorGroupTable from "@/components/control-id/visitor-group/visitorGroupTable";
import MemberTable from "@/components/member/memberTable";
import { Menu } from "@/components/menu";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VisitorTable from "@/components/visitor/visitorTable";
import { ControliDUpdateProvider } from "@/contexts/control-id-update-context";
import api from "@/lib/axios";
import { ArrowsHorizontal } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ControliDConfig({
  searchParams,
}: {
  searchParams?: {
    lobby?: string;
  };
}) {
  const { data: session } = useSession();
  const lobby = searchParams?.lobby || "";
  const [devices, setDevices] = useState<Device[]>([]);
  const fetchDevices = async () => {
    if (session)
      try {
        const response = await api.get(`device/lobby/${lobby}`, {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setDevices(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };

  useEffect(() => {
    fetchDevices();
  }, [session]);
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
            <TabsTrigger value="user-group" className="text-xl">
              <ArrowsHorizontal />
            </TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
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
              <div className="flex gap-2">
                <TimeSpanForm />
                <TimeSpanSearchInDevice />
              </div>
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
            <AccessRuleTimeZoneTable devices={devices} />
          </TabsContent>
          <TabsContent
            className="p-4 border rounded w-full"
            value="accessRules"
          >
            <div className="flex justify-between items-end pb-2 w-full">
              <h2 className="text-xl">Regras de acesso</h2>
              <div className="flex gap-2">
                <TimeZoneForm />
                <AccessRuleSearchInDevice />
              </div>
            </div>
            <AccessRuleTable devices={devices} />
          </TabsContent>
          <TabsContent
            className="p-4 border rounded w-full"
            value="group-access"
          >
            <div className="flex justify-between items-end pb-2 w-full">
              <h2 className="text-xl">Grupos x Regras de acesso</h2>
              <GroupAccessRuleForm />
            </div>
            <GroupAccessRuleTable devices={devices} />
          </TabsContent>
          <TabsContent className="p-4 border rounded w-full" value="groups">
            <div className="flex justify-between items-end pb-2 w-full">
              <h2 className="text-xl">Grupos</h2>
              <div className="flex gap-2">
                <GroupForm />
                <GroupSearchInDevice />
              </div>
            </div>
            <GroupTable devices={devices} />
          </TabsContent>
          <TabsContent className="p-4 border rounded w-full" value="user-group">
            <div className="flex justify-between items-end mt-4 pb-2 w-full">
              <h2 className="text-xl">Membros x Grupos</h2>
              <MemberGroupForm />
            </div>
            <MemberGroupTable devices={devices} />
            <div className="flex justify-between items-end mt-4 pb-2 w-full">
              <h2 className="text-xl">Visitantes x Grupos</h2>
              <VisitorGroupForm />
            </div>
            <VisitorGroupTable devices={devices} />
          </TabsContent>
          <TabsContent className="p-4 border rounded w-full" value="users">
            <div className="flex justify-between items-end mt-4 pb-2 w-full">
              <h2 className="text-xl">Membros</h2>
              <Link
                href={`/dashboard/actions/employee/new?lobby=${lobby}`}
                className={buttonVariants({ variant: "default" })}
              >Adicionar Membro</Link>
            </div>
            <MemberTable lobby={lobby} />

            <div className="flex justify-between items-end mt-4 pb-2 w-full">
              <h2 className="text-xl">Visitantes</h2>
              <Link
                href={`/dashboard/actions/visitor/new?lobby=${lobby}`}
                className={buttonVariants({ variant: "default" })}
              >Adicionar visitante</Link>
            </div>
            <VisitorTable lobby={lobby} />
          </TabsContent>
        </Tabs>
        <Monitor />
      </section>
    </ControliDUpdateProvider>
  );
}
