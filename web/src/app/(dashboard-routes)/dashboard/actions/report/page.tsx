import ReportTable from "@/components/report/reportTable";
import { Menu } from "@/components/menu";
import { Metadata } from "next";
import { DatePickerWithRange } from "@/components/report/calendarRange";
import { AccessLogs } from "@/components/control-id/access-logs/accessLogs";
import apiBase from "@/lib/axios-base";
import { nextAuthOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "Relatório",
};

export default async function Report({
  searchParams,
}: {
  searchParams?: {
    lobby?: string;
  };
}) {
  const lobbyId = searchParams?.lobby || "";
  const session = await getServerSession(nextAuthOptions);

  // Requisições do lado do servidor precisam enviar o token de autenticação manualmente
  const response = await apiBase.get(`lobby/find/${lobbyId}`, {
    headers: {
      Authorization: `Bearer ${session?.token.user.token}`,
    },
  });

  const lobby: Lobby = response.data;
  const brand = lobby.ControllerBrand.name.replace(" ", "-");
  return (
    <>
      <Menu url={`/dashboard/actions?lobby=${lobbyId}`} />
      <section className="mx-auto mb-24 px-2 max-w-5xl">
        <div className="flex flex-wrap justify-between mb-4">
          <h1 className="text-4xl text-center">Relatório</h1>
          <DatePickerWithRange />
        </div>
        <div>
          <ReportTable lobby={lobbyId} />
        </div>
        {brand === "Control-iD" && (
          <>
            <div className="bg-stone-500 my-4 px-2 w-full h-px" />
            <div className="my-2">
              <AccessLogs />
            </div>
          </>
        )}
      </section>
    </>
  );
}
