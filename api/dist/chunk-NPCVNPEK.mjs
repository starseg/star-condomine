import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/scheduling.ts
var getAllSchedules = async (req, res) => {
  try {
    const scheduling = await db_default.scheduling.findMany();
    res.json(scheduling);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os agendamentos" });
  }
};
var getScheduling = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const scheduling = await db_default.scheduling.findUniqueOrThrow({
      where: { schedulingId: id },
      include: {
        visitor: {
          select: {
            name: true,
            cpf: true,
            rg: true
          }
        },
        member: {
          select: {
            name: true,
            cpf: true,
            rg: true
          }
        },
        operator: {
          select: {
            name: true
          }
        }
      }
    });
    if (!scheduling) {
      res.status(404).json({ error: "Agendamento n\xE3o encontrado" });
      return;
    }
    res.json(scheduling);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o agendamento" });
  }
};
var createScheduling = async (req, res) => {
  try {
    const {
      reason,
      location,
      startDate,
      endDate,
      comments,
      visitorId,
      lobbyId,
      memberId,
      operatorId
    } = req.body;
    const scheduling = await db_default.scheduling.create({
      data: {
        reason,
        location,
        startDate,
        endDate,
        comments,
        visitorId,
        lobbyId,
        memberId,
        operatorId
      }
    });
    res.status(201).json(scheduling);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o agendamento" });
  }
};
var updateScheduling = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const {
      reason,
      location,
      startDate,
      endDate,
      comments,
      status,
      visitorId,
      lobbyId,
      memberId,
      operatorId
    } = req.body;
    const scheduling = await db_default.scheduling.update({
      where: { schedulingId: id },
      data: {
        reason,
        location,
        startDate,
        endDate,
        comments,
        status,
        visitorId,
        lobbyId,
        memberId,
        operatorId
      }
    });
    res.status(200).json(scheduling);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o agendamento" });
  }
};
var deleteScheduling = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.scheduling.delete({
      where: { schedulingId: id }
    });
    res.json({ message: "Agendamento exclu\xEDdo com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o agendamento" });
  }
};
var getSchedulingsByLobby = async (req, res) => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const scheduling = await db_default.scheduling.findMany({
      where: { lobbyId: lobby },
      include: {
        visitor: {
          select: {
            name: true,
            cpf: true,
            rg: true
          }
        },
        member: {
          select: {
            name: true,
            cpf: true,
            rg: true
          }
        }
      },
      orderBy: [{ status: "asc" }, { endDate: "desc" }, { startDate: "desc" }]
    });
    res.json(scheduling);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os acessos" });
  }
};
var getFilteredSchedulings = async (req, res) => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const { query } = req.query;
    const whereCondition = query ? {
      OR: [
        { visitor: { name: { contains: query } } },
        { member: { name: { contains: query } } }
      ],
      AND: { lobbyId: lobby }
    } : {};
    const scheduling = await db_default.scheduling.findMany({
      where: whereCondition,
      include: {
        visitor: {
          select: {
            name: true,
            cpf: true,
            rg: true
          }
        },
        member: {
          select: {
            name: true,
            cpf: true,
            rg: true
          }
        }
      },
      orderBy: [{ status: "asc" }, { endDate: "asc" }, { startDate: "desc" }]
    });
    if (!scheduling) {
      res.status(404).json({ error: "Nenhum acesso encontrado" });
      return;
    }
    res.json(scheduling);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os acessos" });
  }
};
var getActiveSchedulingsByVisitor = async (req, res) => {
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  try {
    const visitor = parseInt(req.params.visitor, 10);
    const scheduling = await db_default.scheduling.findMany({
      where: { visitorId: visitor, status: "ACTIVE", endDate: { gte: today } }
    });
    res.json(scheduling);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os agendamentos" });
  }
};

export {
  getAllSchedules,
  getScheduling,
  createScheduling,
  updateScheduling,
  deleteScheduling,
  getSchedulingsByLobby,
  getFilteredSchedulings,
  getActiveSchedulingsByVisitor
};
