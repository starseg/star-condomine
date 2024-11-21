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

    const whereCondition =
      req.query.from && req.query.to
        ? {
            startTime: {
              gte: startTime,
              lte: endTime,
            },
          }
        : {};

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
    const startTime = new Date(req.query.from as string) || undefined;
    const endTime = new Date(req.query.to as string) || undefined;

    const whereCondition =
      req.query.from && req.query.to
        ? {
            date: {
              gte: startTime,
              lte: endTime,
            },
          }
        : {};

    const count = await prisma.lobbyProblem.groupBy({
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
    const startTime = new Date(req.query.from as string) || undefined;
    const endTime = new Date(req.query.to as string) || undefined;

    const whereCondition =
      req.query.from && req.query.to
        ? {
            startTime: {
              gte: startTime,
              lte: endTime,
            },
          }
        : {};
    const count = await prisma.access.groupBy({
      by: ["operatorId"],
      _count: true,
      where: whereCondition,
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
    // Validar e definir `from` e `to`
    const fromDate = req.query.from
      ? new Date(req.query.from as string)
      : undefined;
    const toDate = req.query.to ? new Date(req.query.to as string) : undefined;

    // Ajustar o fuso horário (UTC -3) e definir o campo de data
    const adjustedTimeQuery = Prisma.sql`DATE_SUB(startTime, INTERVAL 3 HOUR)`;

    // Construir a query SQL com o `WHERE` condicional para `fromDate` e `toDate`
    const results = await prisma.$queryRaw<
      { hour: number; count: bigint }[]
    >(Prisma.sql`
      SELECT 
        EXTRACT(HOUR FROM ${adjustedTimeQuery}) AS hour, 
        COUNT(*) AS count
      FROM Access
      ${
        fromDate && toDate
          ? Prisma.sql`
        WHERE startTime BETWEEN ${fromDate} AND ${toDate}
      `
          : Prisma.sql``
      }
      GROUP BY EXTRACT(HOUR FROM ${adjustedTimeQuery})
      ORDER BY hour
    `);

    if (!results || results.length === 0) {
      res.status(404).json({ error: "Nenhum acesso encontrado" });
      return;
    }

    // Converter `BigInt` para `number` e calcular a média de acessos por hora
    const hourlyCounts = results.map((result) => ({
      hour: Number(result.hour),
      count: Number(result.count),
    }));

    const totalAccesses = hourlyCounts.reduce(
      (sum, record) => sum + record.count,
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
    // Validar e definir `from` e `to`
    const fromDate = req.query.from ? new Date(req.query.from as string) : null;
    const toDate = req.query.to ? new Date(req.query.to as string) : null;

    // Ajustar o fuso horário (UTC -3) e definir o campo de data
    const adjustedTimeQuery = Prisma.sql`DATE_SUB(endTime, INTERVAL 3 HOUR)`;

    // Construir a query SQL com `WHERE` condicional para `fromDate`, `toDate`, e `endTime IS NOT NULL`
    const results = await prisma.$queryRaw<
      { hour: number; count: bigint }[]
    >(Prisma.sql`
      SELECT 
        EXTRACT(HOUR FROM ${adjustedTimeQuery}) AS hour, 
        COUNT(*) AS count
      FROM Access
      WHERE endTime IS NOT NULL
      ${
        fromDate && toDate
          ? Prisma.sql`AND startTime BETWEEN ${fromDate} AND ${toDate}`
          : Prisma.sql``
      }
      GROUP BY EXTRACT(HOUR FROM ${adjustedTimeQuery})
      ORDER BY hour
    `);

    if (!results || results.length === 0) {
      res.status(404).json({ error: "Nenhuma saída encontrada" });
      return;
    }

    // Converter `BigInt` para `number` e calcular a média de saídas por hora
    const hourlyCounts = results.map((result) => ({
      hour: Number(result.hour),
      count: Number(result.count),
    }));

    const totalExits = hourlyCounts.reduce(
      (sum, record) => sum + record.count,
      0
    );

    const numberOfHours = results.length;
    const averageExitsPerHour =
      numberOfHours > 0 ? totalExits / numberOfHours : 0;

    // Enviar resposta
    res.json({
      averageExitsPerHour: parseFloat(averageExitsPerHour.toFixed(2)),
      hourlyCounts,
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
    const startTime = new Date(req.query.from as string) || undefined;
    const endTime = new Date(req.query.to as string) || undefined;

    const whereCondition =
      req.query.from && req.query.to
        ? {
            startDate: {
              gte: startTime,
              lte: endTime,
            },
          }
        : {};
    const count = await prisma.scheduling.groupBy({
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
    const startTime = new Date(req.query.from as string) || undefined;
    const endTime = new Date(req.query.to as string) || undefined;
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
        ${
          req.query.from && req.query.to
            ? Prisma.sql`
          WHERE startTime BETWEEN ${startTime} AND ${endTime}
        `
            : Prisma.sql``
        }
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
