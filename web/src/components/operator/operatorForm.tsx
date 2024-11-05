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
import { useRouter } from "next/navigation";;
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { InputPassword } from "../input-password";
import RadioInput from "../form/inputRadio";
import DefaultInput from "../form/inputDefault";
import DefaultCombobox from "../form/comboboxDefault";

const FormSchema = z.object({
  type: z.enum(["ADMIN", "USER"]),
  isExternal: z.boolean(),
  lobbyId: z.number().nullable(),
  name: z.string(),
  username: z.string().min(5, {
    message: "O nome deve ter no mínimo 5 caracteres",
  }),
  password: z.string().min(8, {
    message: "A senha deve ter no mínimo 8 caracteres",
  }),
});

export function OperatorForm() {

  const [lobbies, setLobbies] = useState<Lobby[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`lobby`);
        setLobbies(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
    };

    fetchData();
  }, [lobbies])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: "USER",
      isExternal: false,
      lobbyId: null,
      name: "",
      username: "",
      password: "",
    },
  });

  const router = useRouter();

  const [isSending, setIsSendind] = useState(false);
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSendind(true);
    try {
      await api.post("operator", data);
      router.back();
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    } finally {
      setIsSendind(false);
    }
  };


  const userPermissions = [{ value: "USER", label: "Usuário comum" }, { value: "ADMIN", label: "Administrador" }]
  const userExternal = [{ value: false, label: "Interno" }, { value: true, label: "Externo" }]

  interface item {
    value: number;
    label: string;
  }

  let items: item[] = [];

  lobbies.map(lobby => {
    items.push({
      value: lobby.lobbyId,
      label: lobby.name,
    })
  })

  console.log(form.getValues())

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-3/4 lg:w-[40%] 2xl:w-1/3 space-y-6"
      >
        <RadioInput
          control={form.control}
          name="type"
          label="Permissão do usuário"
          object={userPermissions}
          idExtractor={(item) => item.value}
          descriptionExtractor={(item) => item.label}
        />

        <RadioInput
          control={form.control}
          name="isExternal"
          label="Tipo de usuário"
          object={userExternal}
          idExtractor={(item) => item.value}
          descriptionExtractor={(item) => item.label}
        />

        {form.watch("isExternal") === true &&
          <DefaultCombobox
            control={form.control}
            name="lobbyId"
            label="Portaria do Operador"
            object={items}
            selectLabel="Selecione uma portaria"
            searchLabel="Buscar portaria..."
            onSelect={(value: number) => { form.setValue("lobbyId", value) }}
          />
        }

        <DefaultInput control={form.control} name="name" label="Nome" placeholder="Digite o nome completo do Operador" />
        <DefaultInput control={form.control} name="username" label="Nome de usuário" placeholder="Crie um nome único para o usuário" />

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
