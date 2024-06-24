"use client";
import api from "@/lib/axios";
import { useSession } from "next-auth/react";
import LobbyCard from "./lobbyCard";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SkeletonLobbyCard } from "../_skeletons/skeleton-lobby-card";

export default function List() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const searchParams = useSearchParams();
  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        const params = new URLSearchParams(searchParams);
        try {
          let path;
          if (params.size == 0) {
            path = "lobby/filtered";
          } else {
            path = "lobby/filtered?query=" + params.get("query");
          }
          const response = await api.get(path, {
            headers: {
              Authorization: `Bearer ${session?.token.user.token}`,
            },
          });

          setLobbies(response.data);
          setIsLoading(false);
        } catch (error) {
          console.error("Erro ao obter dados:", error);
        }
      }
    };

    fetchData();
  }, [session, searchParams]);

  return (
    <>
      {isLoading ? (
        <SkeletonLobbyCard />
      ) : (
        <div
          className="bg-stone-900 p-4 rounded-md flex items-center
      justify-evenly flex-wrap gap-4 mb-4 max-h-[25rem] overflow-x-auto"
        >
          {lobbies.map((lobby: Lobby) => {
            const hasActiveProblem = lobby.lobbyProblem.some(
              (problem) => problem.status === "ACTIVE"
            );
            const status = hasActiveProblem ? 1 : 0;
            const ramais = lobby.device
              .map((device) => (device.ramal !== 0 ? device.ramal : null))
              .filter((ramal) => ramal !== null)
              .join(", ");
            return (
              <LobbyCard
                key={lobby.lobbyId}
                href={"dashboard/actions?id=" + lobby.lobbyId}
                title={lobby.name}
                type={lobby.schedules}
                status={status}
                ramais={ramais}
                location={lobby.city + " - " + lobby.state}
                brand={
                  lobby.controllerBrandId ? lobby.ControllerBrand.iconUrl : ""
                }
              />
            );
          })}
        </div>
      )}
    </>
  );
}
