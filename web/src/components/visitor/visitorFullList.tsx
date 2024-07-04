"use client";
import api from "@/lib/axios";
import { formatDate } from "@/lib/utils";
import { UserCircle } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";

export default function VisitorFullList({ lobby }: { lobby: string }) {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isSorted, setIsSorted] = useState(false);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const fetchData = async () => {
    if (session)
      try {
        let path;
        if (!params.get("query")) {
          path = "visitor/lobby/" + lobby;
        } else {
          path = `visitor/filtered/${lobby}?query=${params.get("query")}`;
        }
        const response = await api.get(path, {
          headers: {
            Authorization: `Bearer ${session?.token.user.token}`,
          },
        });
        setVisitors(response.data);
      } catch (error) {
        console.error("Erro ao obter dados:", error);
      }
  };
  useEffect(() => {
    fetchData();
  }, [session, searchParams]);

  const orderByDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSorted(event.target.checked);
    if (event.target.checked) {
      setVisitors((prevVisitors) =>
        [...prevVisitors].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } else {
      fetchData();
    }
  };

  return (
    <>
      <section className="max-h-[60vh] overflow-x-auto">
        {visitors.map((visitor) => (
          <div
            key={visitor.visitorId}
            className="bg-stone-850 my-2 border border-primary rounded-md p-4 flex gap-6 items-center"
          >
            {visitor.profileUrl ? (
              <img
                src={visitor.profileUrl}
                alt="Foto"
                className="aspect-auto max-h-20 max-w-20"
              />
            ) : (
              <UserCircle className="w-20 h-20" />
            )}
            <div className="flex flex-col gap-1 font-bold">
              <p>ID: {visitor.visitorId}</p>
              <p>{visitor.name}</p>
              <p>
                Status:{" "}
                {visitor.status === "ACTIVE" ? "✅ Ativo" : "❌ Inativo"}
              </p>
              <p>CPF/CNPJ: {visitor.cpf}</p>
              <p>RG: {visitor.rg}</p>
            </div>
            <div className="flex flex-col gap-1 font-bold">
              <p>Telefone: {visitor.phone}</p>
              <p>Tipo: {visitor.visitorType.description}</p>
              <p>Relação: {visitor.relation}</p>
              <p>Data de registro: {formatDate(visitor.createdAt)}</p>
              <p>Última atualização: {formatDate(visitor.updatedAt)}</p>
            </div>
            <div className="flex flex-col gap-1 font-bold">
              <p>
                Observações: {visitor.comments ? visitor.comments : "Nenhuma"}
              </p>
            </div>
          </div>
        ))}
      </section>
      <div className="flex gap-2 items-center p-2">
        <input type="checkbox" checked={isSorted} onChange={orderByDate} />
        <Label>Ordenar por data de registro</Label>
      </div>
    </>
  );
}
