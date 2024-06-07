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
      priority: "0",
    },
  });
  const { data: session } = useSession();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const info = {
        name: data.name,
      };

      const response = await api.post(`accessRule`, info, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
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
