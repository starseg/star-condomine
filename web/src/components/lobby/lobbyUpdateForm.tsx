"use client";

import * as z from "zod";
import api from "@/lib/axios";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { MaskedInput } from "../maskedInput";
import { useEffect, useState } from "react";
import LoadingIcon from "../loadingIcon";

const FormSchema = z.object({
  type: z.enum(["CONDOMINIUM", "COMPANY"]),
  cnpj: z.string().min(18),
  name: z.string().min(5),
  responsible: z.string().min(5),
  telephone: z.string().min(10),
  schedules: z.string().min(3),
  procedures: z.string().optional(),
  cep: z.string().min(9),
  state: z.string().min(2).max(2),
  city: z.string().min(2),
  neighborhood: z.string().min(2),
  street: z.string().min(2),
  number: z.string().min(1),
  complement: z.string().optional(),
  datasheet: z.instanceof(File).optional(),
});

export function LobbyUpdateForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: "CONDOMINIUM",
      cnpj: "",
      name: "",
      responsible: "",
      telephone: "",
      schedules: "",
      procedures: "",
      cep: "",
      state: "",
      city: "",
      neighborhood: "",
      street: "",
      number: "",
      complement: "",
      datasheet: new File([], ""),
    },
  });

  type UploadFunction = (file: File) => Promise<string>;

  // Função para fazer upload de um arquivo para o Firebase Storage
  const uploadFile: UploadFunction = async (file) => {
    initializeApp(firebaseConfig);
    const storage = getStorage();

    const timestamp = new Date().toISOString();
    const fileName = `portarias/ficha-tecnica-${timestamp}.pdf`;

    const fileRef = ref(storage, fileName);

    try {
      await uploadBytes(fileRef, file).then((snapshot) => {
        console.log("Uploaded file!");
      });
      const downloadURL = await getDownloadURL(fileRef);
      console.log("Arquivo enviado com sucesso. URL de download:", downloadURL);

      return downloadURL;
    } catch (error) {
      console.error("Erro ao enviar o arquivo:", error);
      throw error;
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const url = await uploadFile(file);
      console.log("URL do arquivo:", url);
      return url;
    } catch (error) {
      console.error("Erro durante o upload:", error);
    }
  };

  interface Lobby {
    lobbyId: number;
    cnpj: string;
    name: string;
    responsible: string;
    telephone: string;
    schedules: string;
    procedures: string;
    datasheet: string;
    cep: string;
    state: string;
    city: string;
    neighborhood: string;
    street: string;
    number: string;
    complement: string;
    type: string;
    createdAt: string;
    updatedAt: string;
  }

  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const id = params.get("id");
  const [details, setDetails] = useState<Lobby>();

  const fetchData = async () => {
    try {
      const response = await api.get("lobby/find/" + id, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setDetails(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [session]);

  if (details) {
    form.setValue("cnpj", details.cnpj);
    form.setValue("name", details.name);
    form.setValue("responsible", details.responsible);
    form.setValue("telephone", details.telephone);
    form.setValue("schedules", details.schedules);
    form.setValue("procedures", details.procedures);
    form.setValue("cep", details.cep);
    form.setValue("state", details.state);
    form.setValue("city", details.city);
    form.setValue("neighborhood", details.neighborhood);
    form.setValue("street", details.street);
    form.setValue("number", details.number);
    form.setValue("complement", details.complement);
  }

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    let file;
    if (data.datasheet instanceof File && data.datasheet.size > 0)
      file = await handleFileUpload(data.datasheet);
    else if (details?.datasheet) file = details.datasheet;
    else file = "";

    try {
      const info = {
        type: data.type,
        cnpj: data.cnpj,
        name: data.name,
        responsible: data.responsible,
        telephone: data.telephone,
        schedules: data.schedules,
        procedures: data.procedures,
        cep: data.cep,
        state: data.state,
        city: data.city,
        neighborhood: data.neighborhood,
        street: data.street,
        number: data.number,
        complement: data.complement,
        datasheet: file,
      };
      const response = await api.put("lobby/" + id, info, {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      console.log(response.data);
      router.push("/dashboard/actions/details?lobby=" + id);
    } catch (error) {
      console.error("Erro ao enviar dados para a API:", error);
      throw error;
    }
  };

  return (
    <Form {...form}>
      {details ? (
        <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-3/4 lg:w-1/3 space-y-6"
      >
        {details?.type != undefined ? (
          <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de portaria</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={
                    details?.type != undefined ? details.type : field.value
                  }
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="CONDOMINIUM" />
                    </FormControl>
                    <FormLabel className="font-normal">Condomínio</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="COMPANY" />
                    </FormControl>
                    <FormLabel className="font-normal">Empresa</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        ) : "carregando dados..."}
        
        <FormField
          control={form.control}
          name="cnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ</FormLabel>
              <FormControl>
                <MaskedInput
                  mask="99.999.999/9999-99"
                  placeholder="Digite o CNPJ da empresa"
                  autoComplete="off"
                  {...field}
                  onBlur={() => form.setValue("cnpj", field.value)}
                />
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
                  placeholder="Digite o nome da empresa"
                  autoComplete="off"
                  {...field}
                  onBlur={() => form.setValue("name", field.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="responsible"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsável</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite o nome do responsável da empresa"
                  autoComplete="off"
                  {...field}
                  onBlur={() => form.setValue("responsible", field.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telephone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <MaskedInput
                  mask="(99) 99999-9999"
                  type="text"
                  placeholder="Digite o telefone da empresa"
                  autoComplete="off"
                  {...field}
                  onBlur={() => form.setValue("telephone", field.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="schedules"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horários</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Quais são os horários do monitoramento?"
                  autoComplete="off"
                  {...field}
                  onBlur={() => form.setValue("schedules", field.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="procedures"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Procedimentos gerais</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Quais são os procedimentos a seguir com essa portaria?"
                  {...field}
                  onBlur={() => form.setValue("procedures", field.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="datasheet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ficha técnica</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) =>
                    field.onChange(e.target.files ? e.target.files[0] : null)
                  }
                />
              </FormControl>
              <FormDescription>
                Não preencha esse campo se quiser manter o arquivo anterior
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cep"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <MaskedInput
                  mask="99999-999"
                  type="text"
                  placeholder="Digite o CEP da portaria"
                  autoComplete="off"
                  {...field}
                  onBlur={() => form.setValue("cep", field.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite o Estado da portaria"
                  autoComplete="off"
                  {...field}
                  onBlur={() => form.setValue("state", field.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite a cidade da portaria"
                  autoComplete="off"
                  {...field}
                  onBlur={() => form.setValue("city", field.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="neighborhood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite o bairro da portaria"
                  autoComplete="off"
                  {...field}
                  onBlur={() => form.setValue("neighborhood", field.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rua</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Digite a rua da portaria"
                  autoComplete="off"
                  {...field}
                  onBlur={() => form.setValue("street", field.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Digite o número da portaria"
                  autoComplete="off"
                  {...field}
                  onBlur={() => form.setValue("number", field.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="complement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complemento</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Alguma informação adicional do endereço"
                  autoComplete="off"
                  {...field}
                  onBlur={() => form.setValue("complement", field.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-lg">
          Atualizar
        </Button>
      </form>
      ) : <LoadingIcon/>}
    </Form>
  );
}
