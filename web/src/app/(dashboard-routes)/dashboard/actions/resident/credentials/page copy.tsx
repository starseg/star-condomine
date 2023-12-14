"use client";
import LoadingIcon from "@/components/loadingIcon";
import api from "@/lib/axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash } from "@phosphor-icons/react/dist/ssr";

const FormSchema = z.object({
  tag: z.string(),
  card: z.string(),
  password: z.string(),
});
export default function residentCredentials() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tag: "",
      card: "",
      password: "",
    },
  });
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  useEffect(() => {
    fetchTagTypes();
    fetchTagData();
  }, [session]);

  interface Member {
    memberId: number;
    type: string;
    profileUrl: string;
    name: string;
    rg: string;
    cpf: string;
    comments: string;
    status: string;
    faceAccess: string;
    biometricAccess: string;
    remoteControlAccess: string;
    passwordAccess: string;
    address: string;
    accessPeriod: Date;
    position: string;
    createdAt: Date;
    updatedAt: Date;
    lobbyId: number;
    tag: {
      tagId: number;
      value: string;
    };
  }

  const [data, setData] = useState<Member | null>(null);
  const fetchTagData = async () => {
    try {
      const response = await api.get("member/tags/" + params.get("id"), {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  // BUSCA OS TIPOS DE TAG
  interface ITagTypes {
    tagTypeId: number;
    description: string;
  }
  const [tagTypes, setTagTypes] = useState<ITagTypes[]>([]);
  const fetchTagTypes = async () => {
    try {
      const types = await api.get("tag/types", {
        headers: {
          Authorization: `Bearer ${session?.token.user.token}`,
        },
      });
      setTagTypes(types.data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  // RETORNA O ID DO TIPO DA TAG
  let tag = 0;
  let card = 0;
  tagTypes.forEach((type) => {
    if (type.description === "Tag") tag = type.tagTypeId;
    if (type.description === "Cartão") card = type.tagTypeId;
  });

  const [tagNumber, setTagNumber] = useState<string[]>([]);
  const addTag = (value: string) => {
    setTagNumber((prev) => [...prev, value]);
    form.setValue("tag", "");
  };

  const [cardNumber, setCardNumber] = useState<string[]>([]);
  const addCard = (value: string) => {
    setCardNumber((prev) => [...prev, value]);
    form.setValue("card", "");
  };

  const deleteTag = (value: string) => {};

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {};

  return (
    <section className="max-w-5xl mx-auto mb-24 px-4">
      {data ? (
        <>
          <h1 className="text-4xl mt-2">Credenciais</h1>
          <h2 className="text-3xl mb-4 text-primary">{data.name}</h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col lg:flex-row gap-8"
            >
              <div className="w-full lg:w-1/3">
                <FormField
                  control={form.control}
                  name="tag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tag</FormLabel>
                      <FormControl>
                        <div className="flex w-full items-center space-x-2">
                          <Input
                            type="text"
                            placeholder="Número da tag"
                            autoComplete="off"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="aspect-square p-1"
                            onClick={() => addTag(field.value)}
                          >
                            <PlusCircle size={"32px"} />
                          </Button>
                        </div>
                      </FormControl>
                      <div className="flex flex-col">
                        {tagNumber.map((num, index) => (
                          <div
                            key={index}
                            className="text-lg p-2 mt-2 rounded-md bg-muted flex justify-between items-center"
                          >
                            <p>{num}</p>
                            <Button
                              type="button"
                              variant="outline"
                              className="aspect-square p-1"
                              onClick={() => deleteTag(field.value)}
                            >
                              <Trash size={"24px"} />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <FormField
                  control={form.control}
                  name="card"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cartão</FormLabel>
                      <FormControl>
                        <div className="flex w-full items-center space-x-2">
                          <Input
                            type="text"
                            placeholder="Número do cartão"
                            autoComplete="off"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="aspect-square p-1"
                            onClick={() => addCard(field.value)}
                          >
                            <PlusCircle size={"32px"} />
                          </Button>
                        </div>
                      </FormControl>
                      <div className="flex flex-col">
                        {cardNumber.map((num, index) => (
                          <div
                            key={index}
                            className="text-lg p-2 mt-2 rounded-md bg-muted flex justify-between items-center"
                          >
                            <p>{num}</p>
                            <Button
                              type="button"
                              variant="outline"
                              className="aspect-square p-1"
                              onClick={() => deleteTag(field.value)}
                            >
                              <Trash size={"24px"} />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Senha numérica"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full text-lg mt-4">
                  Salvar tudo
                </Button>
              </div>
            </form>
          </Form>
        </>
      ) : (
        <div className="w-full flex items-center justify-center">
          <LoadingIcon />
        </div>
      )}
    </section>
  );
}
