import { Request, Response } from "express";
import prisma from "../db";

export const count = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      lobbies,
      members,
      visitors,
      accesses,
      schedulings,
      vehicles,
      devices,
      problems,
      solvedProblems,
    ] = await Promise.all([
      prisma.lobby.count(),
      prisma.member.count(),
      prisma.visitor.count(),
      prisma.access.count(),
      prisma.scheduling.count(),
      prisma.vehicle.count(),
      prisma.device.count(),
      prisma.lobbyProblem.count(),
      prisma.lobbyProblem.count({
        where: {
          status: "INACTIVE",
        },
      }),
    ]);

    const data = {
      lobbies,
      members,
      visitors,
      accesses,
      schedulings,
      vehicles,
      devices,
      problems,
      solvedProblems,
    };
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os dados" });
  }
};

export const accessesByLobby = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const count = await prisma.access.groupBy({
      by: ["lobbyId"],
      _count: true,
    });

    const lobbies = await prisma.lobby.findMany({
      select: {
        lobbyId: true,
        name: true,
      },
    });

    interface AccessResponseInterface {
      lobby: string | undefined;
      count: number;
    }
    const accesses: AccessResponseInterface[] = [];
    count.map((item) => {
      accesses.push({
        lobby: lobbies.find((i) => i.lobbyId === item.lobbyId)?.name,
        count: item._count,
      });
    });
    res.json(accesses);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os dados" });
  }
};

export const getAverageAccessesPerHour = async (
  req: Request,
  res: Response
): Promise<void> => {};
