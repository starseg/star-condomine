"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import { useSearchParams } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { format } from "date-fns";

const FormSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  currentDate: z.boolean(),
});

export function ProblemForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      currentDate: false,
    },
  });

  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const lobbyParam = params.get("lobby");
    const lobby = lobbyParam ? parseInt(lobbyParam, 10) : null;
    const operator = session?.payload.user.id || null;

    let realDate = "";
    if (data.date !== "") {
      const dateObject = new Date(data.date);
      realDate = format(dateObject, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    }
    if (data.currentDate) realDate = new Date().toISOString();
    console.log(realDate);

    const info = {
      title: data.title,
      description: data.description,
      date: realDate,
      lobbyId: lobby,
      operatorId: operator,
    };
    try {
      const response = await api.post("lobbyProblem", info, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      console.log(response.data);
      router.push("/dashboard/actions/problem?lobby=" + lobby);
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-3/4 lg:w-1/3 space-y-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Uma breve descrição do problema..."
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva detalhadamente o problema ocorrido..."
                  rows={10}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data e hora</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  placeholder="Data e hora"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currentDate"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal">
                Utilizar data e hora atuais
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-lg">
          Registrar
        </Button>
      </form>
    </Form>
  );
}
