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
import { useControliDUpdate } from "@/contexts/control-id-update-context";
import { InputItem } from "@/components/form-item";
import { useSession } from "next-auth/react";
import { PencilLine } from "@phosphor-icons/react/dist/ssr";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Digite o nome da regra.",
  }),
  type: z.string(),
  priority: z.string(),
});

export default function AccessRuleUpdateForm({
  id,
  name,
  type,
  priority,
}: {
  id: number;
  name: string;
  type: string;
  priority: string;
}) {
  const { triggerUpdate } = useControliDUpdate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: name,
      type: type,
      priority: priority,
    },
  });
  const { data: session } = useSession();

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
        <Button className="aspect-square p-0" variant={"ghost"}>
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
            className="w-full space-y-2"
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
