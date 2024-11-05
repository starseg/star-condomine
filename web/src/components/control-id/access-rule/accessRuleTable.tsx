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
  createAccessRuleCommand,
  createPortalAccessRuleRelationCommand,
  destroyObjectCommand,
} from "../device/commands";
import { SyncItem } from "../device/syncItem";
import AccessRuleUpdateForm from "./accessRuleUpdateForm";

export default function AccessRuleTable({ devices }: { devices: Device[] }) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const lobbyParam = params.get("lobby");
  const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;
  const { update } = useControliDUpdate();
  const [accessRules, setAccessRules] = useState<AccessRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = async () => {
    if (session) {
      try {
        const response = await api.get(`accessRule/lobby/${lobby}`);
        setAccessRules(response.data);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, [session, update]);

  const deleteItem = async (id: number) => {
    // deleteAction(session, "regra de acesso", `accessRule/${id}`, fetchData);
    try {
      await api.delete(`accessRule/${id}`);
      fetchData();
      devices.map(async (device) => {
        await api.post(
          `/control-id/add-command?id=${device.name}`,
          destroyObjectCommand("access_rules", { access_rules: { id: id } })
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
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessRules.length > 0 ? (
                accessRules.map((accessRule) => (
                  <TableRow key={accessRule.accessRuleId}>
                    <TableCell>{accessRule.accessRuleId}</TableCell>
                    <TableCell>{accessRule.name}</TableCell>
                    <TableCell>{accessRule.type}</TableCell>
                    <TableCell>{accessRule.priority}</TableCell>
                    <TableCell>
                      <DeleteDialog
                        module="regra de acesso"
                        confirmFunction={() =>
                          deleteItem(accessRule.accessRuleId)
                        }
                      />
                      <AccessRuleUpdateForm
                        id={accessRule.accessRuleId}
                        name={accessRule.name}
                        priority={accessRule.priority.toString()}
                        type={accessRule.type.toString()}
                        devices={devices}
                      />
                      <SyncItem
                        lobby={lobby}
                        sendCommand={() =>
                          createAccessRuleCommand(
                            accessRule.accessRuleId,
                            accessRule.name,
                            accessRule.priority,
                            accessRule.type
                          )
                        }
                        sendCommand2={() =>
                          createPortalAccessRuleRelationCommand(
                            1,
                            accessRule.accessRuleId
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
