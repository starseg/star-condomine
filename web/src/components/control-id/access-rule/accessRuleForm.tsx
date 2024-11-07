"use client";
import { InputItem } from "@/components/form-item";
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
import { useControliDUpdate } from "@/contexts/control-id-update-context";
import api from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlus2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Digite o nome da regra.",
  }),
  type: z.string(),
  priority: z.string(),
});

export default function AccessRuleForm() {
  const { triggerUpdate } = useControliDUpdate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      type: "",
      priority: "1",
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
        type: Number(data.type),
        priority: Number(data.priority),
        lobbyId: lobby,
      };

      const response = await api.post(`accessRule`, info);
      if (response.status === 201) {
        toast.success("Regra registrada!", {
          theme: "colored",
        });
        form.reset({
          name: "",
          type: "",
          priority: "0",
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
          <FilePlus2Icon /> Criar regra de acesso
        </Button>
      </SheetTrigger>
      <SheetContent side={"right"}>
        <SheetHeader>
          <SheetTitle>Criar regra de acesso</SheetTitle>
          <SheetDescription>
            Cadastre aqui uma nova regra de acesso.
          </SheetDescription>
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
