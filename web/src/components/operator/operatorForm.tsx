"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useState } from "react";
import { InputPassword } from "../input-password";

const FormSchema = z.object({
  type: z.enum(["ADMIN", "USER"]),
  name: z.string(),
  username: z.string().min(5, {
    message: "O nome deve ter no mínimo 5 caracteres",
  }),
  password: z.string().min(8, {
    message: "A senha deve ter no mínimo 8 caracteres",
  }),
});

export function OperatorForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: "USER",
      name: "",
      username: "",
      password: "",
    },
  });

  const { data: session } = useSession();
  const router = useRouter();

  const [isSending, setIsSendind] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    try {
      const response = await api.post("operator", data, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      // console.log(response.data);
      router.push("/operators");
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    } finally {
      setIsSendind(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-3/4 lg:w-[40%] 2xl:w-1/3 space-y-6"
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de permissão</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="USER" />
                    </FormControl>
                    <FormLabel className="font-normal">Usuário comum</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="ADMIN" />
                    </FormControl>
                    <FormLabel className="font-normal">Administrador</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite o nome completo do operador"
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome de usuário</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Crie um nome único para o usuário"
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <InputPassword placeholder="Crie uma senha forte" {...field} />
              </FormControl>
              <FormDescription>
                Dicas para criar uma senha forte: <br />
                - no mínimo 8 caracteres; <br />
                - letras maiúsculas e minúsculas; <br />
                - números; <br />- símbolos especiais;
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-lg" disabled={isSending}>
          Cadastrar
        </Button>
      </form>
    </Form>
  );
}
