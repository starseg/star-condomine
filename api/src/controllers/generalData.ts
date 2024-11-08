import { Request, Response } from "express";
import prisma from "../db";
import { Prisma } from "@prisma/client";

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

export const accessesByOperator = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const count = await prisma.access.groupBy({
      by: ["operatorId"],
      _count: true,
    });

    const operators = await prisma.operator.findMany({
      select: {
        operatorId: true,
        name: true,
      },
    });

    interface AccessResponseInterface {
      operator: string | undefined;
      count: number;
    }
    const accesses: AccessResponseInterface[] = [];
    count.map((item) => {
      accesses.push({
        operator: operators.find((i) => i.operatorId === item.operatorId)?.name,
        count: item._count,
      });
    });
    res.json(accesses);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os dados" });
  }
};

export const countAccessesPerHour = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Ajustar o fuso horário (UTC -3)
    const adjustedTimeQuery = Prisma.sql`DATE_SUB(startTime, INTERVAL 3 HOUR)`;

    // Agrupar por hora e contar acessos
    const results = await prisma.$queryRaw<
      { hour: number; count: bigint }[]
    >(Prisma.sql`
      SELECT 
        EXTRACT(HOUR FROM ${adjustedTimeQuery}) as hour, 
        COUNT(*) as count
      FROM Access
      GROUP BY EXTRACT(HOUR FROM ${adjustedTimeQuery})
      ORDER BY hour
    `);

    if (!results) {
      res.status(404).json({ error: "Nenhum acesso encontrado" });
      return;
    }

    // Converting BigInt counts to number
    const convertedResults = results.map(result => {
      return {
        ...result,
        count: Number(result.count)
      }
    })


    const totalAccesses = convertedResults.reduce(
      (sum, record) => sum + Number(record.count),
      0
    );

    const numberOfHours = results.length;
    const averageAccessesPerHour =
      numberOfHours > 0 ? totalAccesses / numberOfHours : 0;

    // Enviar resposta
    res.json({
      averageAccessesPerHour,
      hourlyCounts: results.map((result) => ({
        ...result,
        count: Number(result.count),
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
