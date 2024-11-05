"use client";
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
import { PencilLine, PlusCircle, Trash } from "@phosphor-icons/react/dist/ssr";

const FormSchema = z.object({
  tag: z.string(),
  card: z.string(),
  password: z.string(),
});

interface Member {
  memberId: number;
  type: string;
  name: string;
  passwordAccess: string;
  lobbyId: number;
  tag: {
    tagId: number;
    value: string;
    comments: string | null;
    status: "ACTIVE" | "INACTIVE";
    tagTypeId: number;
    memberId: number;
  }[];
}

interface Values {
  password: string;
  tag: string;
  card: string;
}
export default function MemberCredentialsForm({
  memberData,
  preloadedValues,
  tagId,
  cardId,
}: {
  memberData: Member;
  preloadedValues: Values;
  tagId: number;
  cardId: number;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: preloadedValues,
  });
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [tagNumber, setTagNumber] = useState<string[]>([]);
  const [cardNumber, setCardNumber] = useState<string[]>([]);

  let tags: string[] = [];
  let cards: string[] = [];
  useEffect(() => {
    memberData.tag.forEach((tag) => {
      if (tag.status === "ACTIVE") {
        if (tag.tagTypeId === tagId) {
          if (!tags.includes(tag.value)) {
            tags.push(tag.value);
            setTagNumber((prev) => [...prev, tag.value]);
          }
        }
        if (tag.tagTypeId === cardId) {
          if (!cards.includes(tag.value)) {
            cards.push(tag.value);
            setCardNumber((prev) => [...prev, tag.value]);
          }
        }
      }
    });
  }, []);

  const addTag = (value: string) => {
    setTagNumber((prev) => [...prev, value]);
    form.setValue("tag", "");
  };

  const addCard = (value: string) => {
    setCardNumber((prev) => [...prev, value]);
    form.setValue("card", "");
  };

  const deleteTag = (type: string, value: string) => {
    if (type === "tag") {
      setTagNumber(tagNumber.filter((item) => item !== value));
    } else {
      setCardNumber(cardNumber.filter((item) => item !== value));
    }
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await api.delete("tag/member/" + params.get("id"));

      if (response) {
        if (tagNumber[0] != "") {
          try {
            for (let i = 0; i < tagNumber.length; i++) {
              await api.post(
                "tag",
                {
                  value: tagNumber[i],
                  tagTypeId: tagId,
                  memberId: memberData.memberId,
                }
              );
            }
          } catch (error) {
            console.error("(Tag) Erro ao enviar dados para a API:", error);
            throw error;
          }
        }
        if (cardNumber[0] != "") {
          try {
            for (let i = 0; i < cardNumber.length; i++) {
              await api.post(
                "tag",
                {
                  value: cardNumber[i],
                  tagTypeId: cardId,
                  memberId: memberData.memberId,
                }
              );
            }
          } catch (error) {
            console.error("(Cartão) Erro ao enviar dados para a API:", error);
            throw error;
          }
        }
      }
    } catch (error) {
      console.error("(Tag) Erro ao enviar dados para a API:", error);
      throw error;
    }
    try {
      await api.put(
        "member/" + params.get("id"),
        {
          passwordAccess: data.password,
        }
      );
    } catch (error) {
      console.error("(Pass) Erro ao enviar dados para a API:", error);
      throw error;
    }
    router.back();
  };

  return (
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
                  {tagNumber.map((num, index) => {
                    return (
                      <div
                        key={index}
                        className="text-lg p-2 mt-2 rounded-md bg-muted flex justify-between items-center"
                      >
                        <p>{num}</p>
                        <Button
                          type="button"
                          variant="outline"
                          className="aspect-square p-1"
                          onClick={() => deleteTag("tag", num)}
                        >
                          <Trash size={"24px"} />
                        </Button>
                      </div>
                    );
                  })}
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
                        onClick={() => deleteTag("card", num)}
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
  );
}
