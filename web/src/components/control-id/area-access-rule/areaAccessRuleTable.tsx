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

export default function AreaAccessRuleTable() {
  const { data: session } = useSession();
  const { update } = useControliDUpdate();
  const [areaAccessRules, setAreaAccessRules] = useState<AreaAccessRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = async () => {
    if (session) {
      try {
        const response = await api.get(`areaAccessRule`, {
          headers: {
            Authorization: `Bearer ${session.token.user.token}`,
          },
        });
        setAreaAccessRules(response.data);
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
    deleteAction(session, "relação", `areaAccessRule/${id}`, fetchData);
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
                <TableHead>Portaria</TableHead>
                <TableHead>Regra de acesso</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {areaAccessRules && areaAccessRules.length > 0 ? (
                areaAccessRules.map((item) => (
                  <TableRow key={item.areaAccessRuleId}>
                    <TableCell>
                      {item.areaId} - {item.lobby.name}
                    </TableCell>
                    <TableCell>
                      {item.accessRuleId} - {item.accessRule.name}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={"ghost"}
                        className="p-0 aspect-square"
                        onClick={() => deleteItem(item.areaAccessRuleId)}
                      >
                        <Trash2Icon />
                      </Button>
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
