"use client";
import { CheckboxItem, InputItem } from "@/components/form-item";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
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
import { useControliDUpdate } from "@/contexts/control-id-update-context";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilLine, PlusCircle } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { modifyObjectCommand } from "../device/commands";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Digite o nome do grupo.",
  }),

  synchronize: z.boolean(),
});

export default function GroupUpdateForm({
  id,
  name,
  devices,
}: {
  id: number;
  name: string;
  devices: Device[];
}) {
  const { triggerUpdate } = useControliDUpdate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: name,
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
      const info = { name: data.name };

      const response = await api.put(`group/${id}`, info, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });

      if (data.synchronize) {
        if (deviceList.length > 0) {
          deviceList.map(async (device) => {
            await api.post(
              `/control-id/add-command?id=${device}`,
              modifyObjectCommand("groups", info, {
                groups: { id: id }, // where
              })
            );
          });
        }
      }

      if (response.status === 200) {
        toast.success("Grupo atualizado!", {
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
          <SheetTitle>Editar grupo</SheetTitle>
          <SheetDescription>Atualize este grupo.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full"
          >
            <InputItem
              control={form.control}
              name="name"
              label="Nome do grupo"
              placeholder="Digite o nome do grupo"
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
