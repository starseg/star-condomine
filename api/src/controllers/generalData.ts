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

export const problemsByLobby = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const count = await prisma.lobbyProblem.groupBy({
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
    const problems: AccessResponseInterface[] = [];
    count.map((item) => {
      problems.push({
        lobby: lobbies.find((i) => i.lobbyId === item.lobbyId)?.name,
        count: item._count,
      });
    });
    res.json(problems);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os dados" });
  }
};

export const countAccessesPerHour = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { day, from, to } = req.query;

  const dayObj = day ? new Date(day as string) : undefined;

  if (dayObj && isNaN(dayObj.getTime())) {
    res.status(400).json({ error: "A data fornecida não é válida" });
    return;
  }
  const logs = await prisma.logging.findMany({
    where: {
      url: { startsWith: "/access" },
    },
  });
  logs.map((log) => {
    let hour = log.date.getHours() - 3;
    if (hour) {
    }
  });
};
