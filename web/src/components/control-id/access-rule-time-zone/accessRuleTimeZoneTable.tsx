"use client";
import { SkeletonTable } from "@/components/_skeletons/skeleton-table";
import { DeleteDialog } from "@/components/deleteDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useControliDUpdate } from "@/contexts/control-id-update-context";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  createAccessRuleTimeZoneRelationCommand,
  destroyObjectCommand,
} from "../device/commands";
import { SyncItem } from "../device/syncItem";

export default function AccessRuleTimeZoneTable({
  devices,
}: {
  devices: Device[];
}) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const lobbyParam = params.get("lobby");
  const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;
  const { update } = useControliDUpdate();

  const [accessRuleTimeZones, setAccessRuleTimeZones] = useState<
    AccessRuleTimeZone[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = async () => {
    if (session) {
      try {
        const response = await api.get(`accessRuleTimeZone`, {
          headers: {
            Authorization: `Bearer ${session.token.user.token}`,
          },
        });
        setAccessRuleTimeZones(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, [session, update]);

  const deleteItem = async (
    id: number,
    access_rule_id: number,
    time_zone_id: number
  ) => {
    try {
      await api.delete(`accessRuleTimeZone/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      fetchData();
      devices.map(async (device) => {
        await api.post(
          `/control-id/add-command?id=${device.name}`,
          destroyObjectCommand("access_rule_time_zones", {
            access_rule_time_zones: {
              access_rule_id: access_rule_id,
              time_zone_id: time_zone_id,
            },
          })
        );
      });
      toast.success("Dado excluído com sucesso!", {
        theme: "colored",
      });
    } catch (error) {
      console.error("Erro excluir dado:", error);
    }
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <div className="w-full max-h-[60vh] overflow-auto">
          <Table className="border w-full">
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary">
                <TableHead>Regra de acesso</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessRuleTimeZones && accessRuleTimeZones.length > 0 ? (
                accessRuleTimeZones.map((item) => (
                  <TableRow key={item.accessRuleTimeZoneId}>
                    <TableCell>
                      {item.accessRuleId} - {item.accessRule.name}
                    </TableCell>
                    <TableCell>
                      {item.timeZoneId} - {item.timeZone.name}
                    </TableCell>
                    <TableCell>
                      <DeleteDialog
                        module="relação"
                        confirmFunction={() =>
                          deleteItem(
                            item.accessRuleTimeZoneId,
                            item.accessRuleId,
                            item.timeZoneId
                          )
                        }
                      />
                      <SyncItem
                        lobby={lobby}
                        sendCommand={() =>
                          createAccessRuleTimeZoneRelationCommand(
                            item.accessRuleId,
                            item.timeZoneId
                          )
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    rowSpan={2}
                    colSpan={10}
                    className="w-full text-center"
                  >
                    Nenhum dado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
