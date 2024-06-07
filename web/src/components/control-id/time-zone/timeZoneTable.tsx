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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2Icon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useControliDUpdate } from "@/contexts/control-id-update-context";
import { useSession } from "next-auth/react";
import { deleteAction } from "@/lib/delete-action";
import { SkeletonTable } from "@/components/_skeletons/skeleton-table";

export default function TimeZoneTable() {
  const { data: session } = useSession();
  const { update } = useControliDUpdate();
  const [timeZones, setTimeZones] = useState<TimeZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = async () => {
    if (session) {
      try {
        const response = await api.get(`timeZone`, {
          headers: {
            Authorization: `Bearer ${session.token.user.token}`,
          },
        });
        setTimeZones(response.data);

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
    deleteAction(session, "horário", `timeZone/${id}`, fetchData);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <div className="w-full max-h-[60vh] overflow-auto">
          <Table className="w-full border">
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary">
                <TableHead>ID</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeZones && timeZones.length > 0 ? (
                timeZones.map((timeZone) => (
                  <TableRow key={timeZone.timeZoneId}>
                    <TableCell>{timeZone.timeZoneId}</TableCell>
                    <TableCell>{timeZone.name}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger
                          className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "aspect-square p-0"
                          )}
                        >
                          <Trash2Icon />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Tem certeza que você deseja excluir este horário?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não poderá ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteItem(timeZone.timeZoneId)}
                            >
                              Confirmar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
