"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useControliDUpdate } from "@/contexts/control-id-update-context";
import { useSession } from "next-auth/react";
import { deleteAction } from "@/lib/delete-action";
import { SkeletonTable } from "@/components/_skeletons/skeleton-table";
import GroupUpdateForm from "./groupUpdateForm";
import { useSearchParams } from "next/navigation";
import { createGroupCommand, destroyObjectCommand } from "../device/commands";
import { toast } from "react-toastify";
import { DeleteDialog } from "@/components/deleteDialog";
import { SyncItem } from "../device/syncItem";

export default function GroupTable({ devices }: { devices: Device[] }) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const lobbyParam = params.get("lobby");
  const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;
  const { update } = useControliDUpdate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = async () => {
    if (session) {
      try {
        const response = await api.get(`group/lobby/${lobby}`, {
          headers: {
            Authorization: `Bearer ${session.token.user.token}`,
          },
        });
        setGroups(response.data);

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
    try {
      await api.delete(`group/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      fetchData();
      devices.map(async (device) => {
        await api.post(
          `/control-id/add-command?id=${device.name}`,
          destroyObjectCommand("groups", { groups: { id: id } })
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
                <TableHead>Grupo</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups && groups.length > 0 ? (
                groups.map((group) => (
                  <TableRow key={group.groupId}>
                    <TableCell>{group.groupId}</TableCell>
                    <TableCell>{group.name}</TableCell>
                    <TableCell>
                      <DeleteDialog
                        module="grupo"
                        confirmFunction={() => deleteItem(group.groupId)}
                      />
                      <GroupUpdateForm
                        id={group.groupId}
                        name={group.name}
                        devices={devices}
                      />
                      <SyncItem
                        lobby={lobby}
                        sendCommand={() =>
                          createGroupCommand(group.groupId, group.name)
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
