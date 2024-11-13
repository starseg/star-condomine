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

    const startTime = new Date(req.query.from as string) || undefined;
    const endTime = new Date(req.query.to as string) || undefined;

    const whereCondition = (req.query.from && req.query.to) ? {
      startTime: {
        gte: startTime,
        lte: endTime,
      },
    } : {};

    console.log(whereCondition);

    const count = await prisma.access.groupBy({
      by: ["lobbyId"],
      _count: true,
      where: whereCondition,
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
    const hourlyCounts = results.map((result) => {
      return {
        ...result,
        hour: Number(result.hour),
        count: Number(result.count),
      };
    });

    const totalAccesses = hourlyCounts.reduce(
      (sum, record) => sum + Number(record.count),
      0
    );

    const numberOfHours = results.length;
    const averageAccessesPerHour = Number(
      numberOfHours > 0 ? totalAccesses / numberOfHours : 0
    ).toFixed(2);

    // Enviar resposta
    res.json({
      averageAccessesPerHour,
      hourlyCounts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

export const countExitsPerHour = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Ajustar o fuso horário (UTC -3)
    const adjustedTimeQuery = Prisma.sql`DATE_SUB(endTime, INTERVAL 3 HOUR)`;

    // Agrupar por hora e contar acessos
    const results = await prisma.$queryRaw<
      { hour: number; count: bigint }[]
    >(Prisma.sql`
      SELECT 
        EXTRACT(HOUR FROM ${adjustedTimeQuery}) as hour, 
        COUNT(*) as count
      FROM Access
      WHERE endTime IS NOT NULL
      GROUP BY EXTRACT(HOUR FROM ${adjustedTimeQuery})
      ORDER BY hour
    `);

    // Converting BigInt counts to number
    const totalAccesses = results.reduce(
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
        hour: Number(result.hour),
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

export const schedulingsByLobby = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const count = await prisma.scheduling.groupBy({
      by: ["lobbyId"],
      _count: true,
    });

    const lobbies = await prisma.lobby.findMany({
      select: {
        lobbyId: true,
        name: true,
      },
    });

    interface SchedulingResponseInterface {
      lobby: string | undefined;
      count: number;
    }
    const accesses: SchedulingResponseInterface[] = [];
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

export const accessesByVisitorType = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Consulta para agrupar acessos por tipo de visitante
    const results = await prisma.$queryRaw<
      { visitorType: string; count: bigint }[]
    >(Prisma.sql`
      SELECT 
      vt.description AS visitorType, 
        COUNT(a.accessId) AS count
        FROM Access a
        JOIN Visitor v ON v.visitorId = a.visitorId
        JOIN VisitorType vt ON vt.visitorTypeId = v.visitorTypeId
        GROUP BY vt.description
        `);

    interface AccessResponseInterface {
      visitorType: string | undefined;
      count: number;
    }
    // Convertendo BigInt para number no campo `count`
    const accesses: AccessResponseInterface[] = results.map((result) => ({
      visitorType: result.visitorType,
      count: Number(result.count),
    }));

    res.json(accesses);
  } catch (error) {
    console.error("Error fetching access counts by visitor type:", error);
    throw new Error("Server error");
  }
};

export const logsByOperator = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const currentDate = new Date();
    const date30DaysAgo = new Date();
    date30DaysAgo.setDate(currentDate.getDate() - 30);

    const count = await prisma.logging.groupBy({
      by: ["operatorId"],
      _count: true,
      where: {
        date: {
          gte: date30DaysAgo,
        },
      },
    });

    const operators = await prisma.operator.findMany({
      select: {
        operatorId: true,
        name: true,
      },
    });

    interface LogsResponseInterface {
      operator: string | undefined;
      count: number;
    }
    const logs: LogsResponseInterface[] = [];
    count.map((item) => {
      logs.push({
        operator: operators.find((i) => i.operatorId === item.operatorId)?.name,
        count: item._count,
      });
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os dados" });
  }
};
