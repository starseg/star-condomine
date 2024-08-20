"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "react-toastify";
import api from "@/lib/axios";
import { useControliDUpdate } from "@/contexts/control-id-update-context";
import { CheckboxItem, InputItem } from "@/components/form-item";
import { useSession } from "next-auth/react";
import { PencilLine, PlusCircle } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import { modifyObjectCommand } from "../device/commands";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Digite o nome da regra.",
  }),
  type: z.string(),
  priority: z.string(),

  synchronize: z.boolean(),
});

export default function AccessRuleUpdateForm({
  id,
  name,
  type,
  priority,
  devices,
}: {
  id: number;
  name: string;
  type: string;
  priority: string;
  devices: Device[];
}) {
  const { triggerUpdate } = useControliDUpdate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: name,
      type: type,
      priority: priority,
      synchronize: false,
    },
  });
  const { data: session } = useSession();

  const [deviceId, setDeviceId] = useState("");
  const [deviceList, setDeviceList] = useState<string[]>([]);
  function addDevice() {
    const isSetDevice = deviceList.find((device) => device === deviceId);
    if (deviceId !== "" && !isSetDevice)
      setDeviceList((prev) => [...prev, deviceId]);
  }

  function removeDeviceFromList(device: string) {
    setDeviceList(deviceList.filter((item) => item !== device));
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const info = {
        name: data.name,
        type: Number(data.type),
        priority: Number(data.priority),
      };

      const response = await api.put(`accessRule/${id}`, info, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });

      if (data.synchronize) {
        if (deviceList.length > 0) {
          deviceList.map(async (device) => {
            await api.post(
              `/control-id/add-command?id=${device}`,
              modifyObjectCommand("access_rules", info, {
                access_rules: { id: id }, // where
              })
            );
          });
        }
      }

      if (response.status === 200) {
        toast.success("Regra atualizada!", {
          theme: "colored",
        });
        triggerUpdate();
      }
    } catch (error) {
      toast.error("Erro ao registrar", {
        theme: "colored",
      });
      console.error("Erro:", error);
      throw error;
    }
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="p-0 aspect-square" variant={"ghost"}>
          <PencilLine size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent side={"right"}>
        <SheetHeader>
          <SheetTitle>Editar regra de acesso</SheetTitle>
          <SheetDescription>Atualize esta regra de acesso.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 w-full"
          >
            <InputItem
              control={form.control}
              name="name"
              label="Nome da regra de acesso"
              placeholder="Digite o nome da regra de acesso"
            />
            <InputItem
              control={form.control}
              type="number"
              name="type"
              label="Tipo"
              placeholder="0 = bloqueio | 1 = permissão"
            />
            <InputItem
              control={form.control}
              type="number"
              name="priority"
              label="Prioridade"
              placeholder="Padrão = 0"
            />
            <CheckboxItem
              control={form.control}
              name="synchronize"
              label="Sincronizar com dispositivos"
            />
            {form.getValues("synchronize") && (
              <>
                <div className="flex gap-2">
                  <Select value={deviceId} onValueChange={setDeviceId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um dispositivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {devices.map((device) => (
                          <SelectItem key={device.deviceId} value={device.name}>
                            {device.ip} - {device.name} - {device.description}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={addDevice}
                    className="p-0 text-2xl aspect-square"
                    title="Adicionar"
                  >
                    <PlusCircle />
                  </Button>
                </div>
                <div className="flex gap-2">
                  {deviceList.map((device) => (
                    <p
                      key={device}
                      className="bg-stone-800 hover:bg-stone-950 p-1 border hover:border-red-700 rounded cursor-pointer"
                      onClick={() => removeDeviceFromList(device)}
                    >
                      {device}
                    </p>
                  ))}
                </div>
              </>
            )}
            <SheetFooter>
              <SheetClose asChild>
                <Button type="submit" className="w-full">
                  Salvar
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
