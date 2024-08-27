"use client";
import { SkeletonTable } from "@/components/_skeletons/skeleton-table";
import { DeleteDialog } from "@/components/deleteDialog";
import { Button } from "@/components/ui/button";
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
import { Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  createGroupAccessRuleRelationCommand,
  destroyObjectCommand,
} from "../device/commands";
import { SyncItem } from "../device/syncItem";

export default function GroupAccessRuleTable({
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

  const [groupAccessRules, setGroupAccessRules] = useState<GroupAccessRule[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = async () => {
    if (session) {
      try {
        const response = await api.get(`groupAccessRule/lobby/${lobby}`, {
          headers: {
            Authorization: `Bearer ${session.token.user.token}`,
          },
        });
        setGroupAccessRules(response.data);
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
    group_id: number,
    access_rule_id: number
  ) => {
    try {
      await api.delete(`groupAccessRule/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      fetchData();
      devices.map(async (device) => {
        await api.post(
          `/control-id/add-command?id=${device.name}`,
          destroyObjectCommand("group_access_rules", {
            group_access_rules: {
              group_id: group_id,
              access_rule_id: access_rule_id,
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
                <TableHead>Grupo</TableHead>
                <TableHead>Regra de acesso</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupAccessRules && groupAccessRules.length > 0 ? (
                groupAccessRules.map((item) => (
                  <TableRow key={item.groupAccessRuleId}>
                    <TableCell>
                      {item.groupId} - {item.group.name}
                    </TableCell>
                    <TableCell>
                      {item.accessRuleId} - {item.accessRule.name}
                    </TableCell>
                    <TableCell>
                      <DeleteDialog
                        module="relação"
                        confirmFunction={() =>
                          deleteItem(
                            item.groupAccessRuleId,
                            item.groupId,
                            item.accessRuleId
                          )
                        }
                      />
                      <SyncItem
                        lobby={lobby}
                        sendCommand={() =>
                          createGroupAccessRuleRelationCommand(
                            item.groupId,
                            item.accessRuleId
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
