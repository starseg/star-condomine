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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { destroyObjectCommand } from "./commands";
import { useState } from "react";
import { toast } from "react-toastify";

export function CleanDevice({ devices }: { devices: Device[] }) {
  const [id, setId] = useState("");

  async function destroyObjects() {
    const commands = [
      "user_groups",
      "group_access_rules",
      "area_access_rules",
      "access_rule_time_zones",
      "users",
      "time_zones",
      "time_spans",
      "access_rules",
      "groups",
      "areas",
    ];
    const promises = commands.map((command) =>
      api.post(
        `/control-id/add-command?id=${id}`,
        destroyObjectCommand(command)
      )
    );

    try {
      await Promise.all(promises);
      console.log("All commands executed successfully");
      toast.success("Dispositivo limpo com sucesso!");
    } catch (error) {
      console.error("Error executing commands:", error);
      toast.error("Erro ao limpar dispositivo");
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Limpar dados do dispositivo</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Ao confirmar, todos os dados referentes a esta página serão
            excluídos do dispositivo em questão.
          </AlertDialogDescription>
          <Select value={id} onValueChange={setId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um dispositivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {devices.map((device) => (
                  <SelectItem key={device.deviceId} value={device.name}>
                    {device.ip} - {device.description} - {device.lobby.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={destroyObjects}>
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
