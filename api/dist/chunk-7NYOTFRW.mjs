import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/generalData.ts
import { Prisma } from "@prisma/client";
var count = async (req, res) => {
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
      solvedProblems
    ] = await Promise.all([
      db_default.lobby.count(),
      db_default.member.count(),
      db_default.visitor.count(),
      db_default.access.count(),
      db_default.scheduling.count(),
      db_default.vehicle.count(),
      db_default.device.count(),
      db_default.lobbyProblem.count(),
      db_default.lobbyProblem.count({
        where: {
          status: "INACTIVE"
        }
      })
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
      solvedProblems
    };
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os dados" });
  }
};
var accessesByLobby = async (req, res) => {
  try {
    const count2 = await db_default.access.groupBy({
      by: ["lobbyId"],
      _count: true
    });
    const lobbies = await db_default.lobby.findMany({
      select: {
        lobbyId: true,
        name: true
      }
    });
    const accesses = [];
    count2.map((item) => {
      accesses.push({
        lobby: lobbies.find((i) => i.lobbyId === item.lobbyId)?.name,
        count: item._count
      });
    });
    res.json(accesses);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os dados" });
  }
};
var problemsByLobby = async (req, res) => {
  try {
    const count2 = await db_default.lobbyProblem.groupBy({
      by: ["lobbyId"],
      _count: true
    });
    const lobbies = await db_default.lobby.findMany({
      select: {
        lobbyId: true,
        name: true
      }
    });
    const problems = [];
    count2.map((item) => {
      problems.push({
        lobby: lobbies.find((i) => i.lobbyId === item.lobbyId)?.name,
        count: item._count
      });
    });
    res.json(problems);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os dados" });
  }
};
var accessesByOperator = async (req, res) => {
  try {
    const count2 = await db_default.access.groupBy({
      by: ["operatorId"],
      _count: true
    });
    const operators = await db_default.operator.findMany({
      select: {
        operatorId: true,
        name: true
      }
    });
    const accesses = [];
    count2.map((item) => {
      accesses.push({
        operator: operators.find((i) => i.operatorId === item.operatorId)?.name,
        count: item._count
      });
    });
    res.json(accesses);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os dados" });
  }
};
var countAccessesPerHour = async (req, res) => {
  try {
    const adjustedTimeQuery = Prisma.sql`DATE_SUB(startTime, INTERVAL 3 HOUR)`;
    const results = await db_default.$queryRaw(Prisma.sql`
      SELECT 
        EXTRACT(HOUR FROM ${adjustedTimeQuery}) as hour, 
        COUNT(*) as count
      FROM Access
      GROUP BY EXTRACT(HOUR FROM ${adjustedTimeQuery})
      ORDER BY hour
    `);
    const totalAccesses = results.reduce(
      (sum, record) => sum + Number(record.count),
      0
    );
    const numberOfHours = results.length;
    const averageAccessesPerHour = numberOfHours > 0 ? totalAccesses / numberOfHours : 0;
    res.json({
      averageAccessesPerHour,
      hourlyCounts: results.map((result) => ({
        ...result,
        count: Number(result.count)
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

export {
  count,
  accessesByLobby,
  problemsByLobby,
  accessesByOperator,
  countAccessesPerHour
};
