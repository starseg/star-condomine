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
    message: "Digite o nome do grupo.",
  }),
});

export default function GroupUpdateForm({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  const { triggerUpdate } = useControliDUpdate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: name,
    },
  });
  const { data: session } = useSession();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const info = {
        name: data.name,
      };

      const response = await api.put(`group/${id}`, info, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
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
        <Button className="aspect-square p-0" variant={"ghost"}>
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
            className="w-full space-y-2"
          >
            <InputItem
              control={form.control}
              name="name"
              label="Nome do grupo"
              placeholder="Digite o nome do grupo"
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
