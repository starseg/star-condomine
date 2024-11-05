"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
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
import { FilePlus2Icon } from "lucide-react";
import { useControliDUpdate } from "@/contexts/control-id-update-context";
import { InputItem } from "@/components/form-item";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Digite o nome do horário.",
  }),
});

export default function TimeZoneForm() {
  const { triggerUpdate } = useControliDUpdate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const lobbyParam = params.get("lobby");
  const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const info = {
        name: data.name,
        lobbyId: lobby,
      };

      const response = await api.post(`timeZone`, info);
      if (response.status === 201) {
        toast.success("Horário registrado!", {
          theme: "colored",
        });
        form.reset({
          name: "",
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
        <Button className="flex gap-2">
          <FilePlus2Icon /> Criar horário
        </Button>
      </SheetTrigger>
      <SheetContent side={"right"}>
        <SheetHeader>
          <SheetTitle>Criar horário</SheetTitle>
          <SheetDescription>Cadastre aqui um novo horário.</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 w-full"
          >
            <InputItem
              control={form.control}
              name="name"
              label="Nome do horário"
              placeholder="Digite o nome do horário"
            />
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
