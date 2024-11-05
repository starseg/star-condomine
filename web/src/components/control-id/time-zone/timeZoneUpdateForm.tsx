"use client";
import { CheckboxItem, InputItem } from "@/components/form-item";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useControliDUpdate } from "@/contexts/control-id-update-context";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilLine, PlusCircle } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { modifyObjectCommand } from "../device/commands";
import { useEffect, useState } from "react";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Digite o nome do horário.",
  }),

  synchronize: z.boolean(),
});

export default function TimeZoneUpdateForm({
  id,
  name,
  lobby,
}: {
  id: number;
  name: string;
  lobby: number | null;
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

  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const fetchDevices = async () => {
    if (session)
      try {
        const response = await api.get(`device/lobby/${lobby}`);
        setDevices(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };
  const [deviceList, setDeviceList] = useState<string[]>([]);
  function addDevice() {
    const isSetDevice = deviceList.find((device) => device === deviceId);
    if (deviceId !== "" && !isSetDevice)
      setDeviceList((prev) => [...prev, deviceId]);
  }

  function removeDeviceFromList(device: string) {
    setDeviceList(deviceList.filter((item) => item !== device));
  }

  useEffect(() => {
    fetchDevices();
  }, [session]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await api.put(
        `timeZone/${id}`,
        { name: data.name }
      );

      if (data.synchronize) {
        if (deviceList.length > 0) {
          deviceList.map(async (device) => {
            await api.post(
              `/control-id/add-command?id=${device}`,
              modifyObjectCommand(
                "time_zones",
                { name: data.name },
                { time_zones: { id: id } }
              )
            );
          });
        }
      }

      if (response.status === 200) {
        toast.success("Horário atualizado!", {
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
        <Button className="p-0 aspect-square" variant={"ghost"} title="Editar">
          <PencilLine size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent side={"right"}>
        <SheetHeader>
          <SheetTitle>Editar horário</SheetTitle>
          <SheetDescription>Atualize este horário.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full"
          >
            <InputItem
              control={form.control}
              name="name"
              label="Nome do horário"
              placeholder="Digite o nome do horário"
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
