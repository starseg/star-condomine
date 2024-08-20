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
  createUserGroupRelationCommand,
  destroyObjectCommand,
} from "../device/commands";
import { SyncItem } from "../device/syncItem";

export default function MemberGroupTable({ devices }: { devices: Device[] }) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const lobbyParam = params.get("lobby");
  const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;
  const { update } = useControliDUpdate();
  const [memberGroups, setMemberGroups] = useState<MemberGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = async () => {
    if (session) {
      try {
        const response = await api.get(`memberGroup`, {
          headers: {
            Authorization: `Bearer ${session.token.user.token}`,
          },
        });
        setMemberGroups(response.data);
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
    member_id: number,
    group_id: number
  ) => {
    try {
      await api.delete(`memberGroup/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      fetchData();
      devices.map(async (device) => {
        await api.post(
          `/control-id/add-command?id=${device.name}`,
          destroyObjectCommand("member_group", {
            member_group: {
              member_id: member_id,
              group_id: group_id,
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
                <TableHead>Membro</TableHead>
                <TableHead>Grupo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberGroups && memberGroups.length > 0 ? (
                memberGroups.map((item) => (
                  <TableRow key={item.memberGroupId}>
                    <TableCell>
                      {item.memberId} - {item.member.name}
                    </TableCell>
                    <TableCell>
                      {item.groupId} - {item.group.name}
                    </TableCell>
                    <TableCell>
                      <DeleteDialog
                        module="relação"
                        confirmFunction={() =>
                          deleteItem(
                            item.memberGroupId,
                            item.memberId,
                            item.groupId
                          )
                        }
                      />
                      <SyncItem
                        lobby={lobby}
                        sendCommand={() =>
                          createUserGroupRelationCommand(
                            item.memberId,
                            item.groupId
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
