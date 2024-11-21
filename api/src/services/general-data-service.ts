import { Prisma } from "@prisma/client";
import prisma from "../db";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { InvalidDateError } from "./errors/invalid-date-error";

interface AccessResponseInterface {
  lobby: string | undefined;
  count: number;
}

interface LogsResponseInterface {
  operator: string | undefined;
  count: number;
}

interface AccessVisitorResponseInterface {
  visitorType: string | undefined;
  count: number;
}

interface AccessOperatorResponseInterface {
  operator: string | undefined;
  count: number;
}

export class GeneralDataService {
  async getCardsCountData() {
    const data = await Promise.all([
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

    return {
      lobbies: data[0],
      members: data[1],
      visitors: data[2],
      accesses: data[3],
      schedulings: data[4],
      vehicles: data[5],
      devices: data[6],
      problems: data[7],
      solvedProblems: data[8],
    };
  }

  async getAccessesByLobby(startTime?: Date, endTime?: Date) {

    if ((startTime && endTime) && (startTime > endTime || endTime < startTime)) {
      throw new InvalidDateError();
    }

    const whereCondition = startTime && endTime ? {
      startTime: {
        gte: startTime,
        lte: endTime,
      }
    } : {};

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

    const accesses: AccessResponseInterface[] = [];
    count.map((item) => {
      accesses.push({
        lobby: lobbies.find((i) => i.lobbyId === item.lobbyId)?.name,
        count: item._count,
      });
    });

    return accesses;
  }

  async getProblemsByLobby(startTime?: Date, endTime?: Date) {

    if ((startTime && endTime) && (startTime > endTime || endTime < startTime)) {
      throw new InvalidDateError();
    }

    const whereCondition = startTime && endTime ? {
      createdAt: {
        gte: startTime,
        lte: endTime,
      }
    } : {};

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

    const problems: AccessResponseInterface[] = [];
    count.map((item) => {
      problems.push({
        lobby: lobbies.find((i) => i.lobbyId === item.lobbyId)?.name,
        count: item._count,
      });
    });

    return problems;
  }

  async getAccessesByOperator(startTime?: Date, endTime?: Date) {

    if ((startTime && endTime) && (startTime > endTime || endTime < startTime)) {
      throw new InvalidDateError();
    }

    const whereCondition = startTime && endTime ? {
      startTime: {
        gte: startTime,
        lte: endTime,
      }
    } : {};

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

    const accesses: AccessOperatorResponseInterface[] = [];
    count.map((item) => {
      accesses.push({
        operator: operators.find((i) => i.operatorId === item.operatorId)?.name,
        count: item._count,
      });
    });

    return accesses;
  }

  async getCountAccessesPerHour(startTime?: Date, endTime?: Date) {
    const adjustedTimeQuery = Prisma.sql`DATE_SUB(startTime, INTERVAL 3 HOUR)`;

    const results = await prisma.$queryRaw<
      { hour: number; count: bigint }[]
    >(Prisma.sql`
    SELECT 
      EXTRACT(HOUR FROM ${adjustedTimeQuery}) AS hour, 
      COUNT(*) AS count
    FROM Access
    ${startTime && endTime
        ? Prisma.sql`
      WHERE startTime BETWEEN ${startTime} AND ${endTime}
    `
        : Prisma.sql``
      }
    GROUP BY EXTRACT(HOUR FROM ${adjustedTimeQuery})
    ORDER BY hour
    `);

    if (!results || results.length === 0) {
      throw new ResourceNotFoundError();
    }

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

    return {
      averageAccessesPerHour,
      hourlyCounts,
    };
  }

  async getCountExitsPerHour(startTime?: Date, endTime?: Date) {

    if ((startTime && endTime) && (startTime > endTime || endTime < startTime)) {
      throw new InvalidDateError();
    }

    // Ajustar o fuso horário (UTC -3) e definir o campo de data
    const adjustedTimeQuery = Prisma.sql`DATE_SUB(endTime, INTERVAL 3 HOUR)`;

    const results = await prisma.$queryRaw<
      { hour: number; count: bigint }[]
    >(Prisma.sql`
    SELECT 
      EXTRACT(HOUR FROM ${adjustedTimeQuery}) AS hour, 
      COUNT(*) AS count
    FROM Access
    WHERE endTime IS NOT NULL
    ${startTime && endTime
        ? Prisma.sql`AND startTime BETWEEN ${startTime} AND ${endTime}`
        : Prisma.sql``
      }
    GROUP BY EXTRACT(HOUR FROM ${adjustedTimeQuery})
    ORDER BY hour
    `);

    if (!results) {
      throw new ResourceNotFoundError();
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

    return {
      averageExitsPerHour: parseFloat(averageExitsPerHour.toFixed(2)),
      hourlyCounts,
    }
  }

  async getSchedulingByLobby(startTime?: Date, endTime?: Date) {

    if ((startTime && endTime) && (startTime > endTime || endTime < startTime)) {
      throw new InvalidDateError();
    }

    const whereCondition = startTime && endTime ? {
      startDate: {
        gte: startTime,
        lte: endTime,
      },
    } : {}

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

    const schedulings: AccessResponseInterface[] = [];
    count.map((item) => {
      schedulings.push({
        lobby: lobbies.find((i) => i.lobbyId === item.lobbyId)?.name,
        count: item._count,
      });
    });

    return schedulings;
  }

  async getAccessesByVisitorType(startTime?: Date, endTime?: Date) {

    if ((startTime && endTime) && (startTime > endTime || endTime < startTime)) {
      throw new InvalidDateError();
    }

    const results = await prisma.$queryRaw<
      { visitorType: string; count: bigint }[]
    >(Prisma.sql`
      SELECT 
      vt.description AS visitorType, 
        COUNT(a.accessId) AS count
        FROM Access a
        JOIN Visitor v ON v.visitorId = a.visitorId
        JOIN VisitorType vt ON vt.visitorTypeId = v.visitorTypeId
        ${startTime && endTime
        ? Prisma.sql`
          WHERE startTime BETWEEN ${startTime} AND ${endTime}
        `
        : Prisma.sql``
      }
        GROUP BY vt.description
        `);

    if (!results || results.length === 0) {
      throw new ResourceNotFoundError();
    }

    const accesses: AccessVisitorResponseInterface[] = results.map((result) => ({
      visitorType: result.visitorType,
      count: Number(result.count),
    }));

    return accesses;
  }

  async getLogsByOperator() {
    const currentDate = new Date();
    const date30DaysAgo = new Date(currentDate);
    date30DaysAgo.setDate(date30DaysAgo.getDate() - 30);

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

    const logs: LogsResponseInterface[] = [];
    count.map((item) => {
      logs.push({
        operator: operators.find((i) => i.operatorId === item.operatorId)?.name,
        count: item._count,
      });
    });

    return logs;
  }
}