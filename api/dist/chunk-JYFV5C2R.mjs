import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/access.ts
import { subDays } from "date-fns";
var getAllAccess = async (req, res) => {
  try {
    const access = await db_default.access.findMany();
    res.json(access);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os acessos" });
  }
};
var getAccess = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const access = await db_default.access.findUniqueOrThrow({
      where: { accessId: id },
      include: {
        visitor: {
          select: {
            name: true,
            cpf: true,
            visitorType: {
              select: {
                description: true
              }
            }
          }
        },
        member: {
          select: {
            name: true,
            cpf: true
          }
        },
        operator: {
          select: {
            name: true
          }
        }
      }
    });
    if (!access) {
      res.status(404).json({ error: "Acesso n\xE3o encontrado" });
      return;
    }
    res.json(access);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o acesso" });
  }
};
var createAccess = async (req, res) => {
  try {
    const {
      startTime,
      endTime,
      local,
      reason,
      comments,
      memberId,
      lobbyId,
      visitorId,
      operatorId
    } = req.body;
    const access = await db_default.access.create({
      data: {
        startTime,
        endTime,
        local,
        reason,
        comments,
        memberId,
        lobbyId,
        visitorId,
        operatorId
      }
    });
    res.status(201).json(access);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o acesso" });
  }
};
var updateAccess = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const {
      startTime,
      endTime,
      local,
      reason,
      comments,
      status,
      memberId,
      lobbyId,
      visitorId,
      operatorId
    } = req.body;
    const access = await db_default.access.update({
      where: { accessId: id },
      data: {
        startTime,
        endTime,
        local,
        reason,
        comments,
        status,
        memberId,
        lobbyId,
        visitorId,
        operatorId
      }
    });
    res.status(200).json(access);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o acesso" });
  }
};
var deleteAccess = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.access.delete({
      where: { accessId: id }
    });
    res.json({ message: "Acesso exclu\xEDdo com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o acesso" });
  }
};
var getAccessByLobby = async (req, res) => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const oneMonthAgo = subDays(/* @__PURE__ */ new Date(), 31);
    const access = await db_default.access.findMany({
      where: {
        lobbyId: lobby,
        startTime: {
          gte: oneMonthAgo
        }
      },
      include: {
        visitor: {
          select: {
            name: true,
            cpf: true
          }
        },
        member: {
          select: {
            name: true,
            cpf: true
          }
        }
      },
      orderBy: [{ status: "asc" }, { startTime: "desc" }]
    });
    res.json(access);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os acessos" });
  }
};
var getFilteredAccess = async (req, res) => {
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
    const access = await db_default.access.findMany({
      where: whereCondition,
      include: {
        visitor: {
          select: {
            name: true,
            cpf: true
          }
        },
        member: {
          select: {
            name: true,
            cpf: true
          }
        }
      },
      orderBy: [{ status: "asc" }, { startTime: "desc" }]
    });
    if (!access) {
      res.status(404).json({ error: "Nenhum acesso encontrado" });
      return;
    }
    res.json(access);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os acessos" });
  }
};
var generateReport = async (req, res) => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const { from, to } = req.query;
    if (!from || !to) {
      const resultWithoutDate = await db_default.access.findMany({
        where: {
          lobbyId: lobby
        },
        include: {
          visitor: {
            select: {
              name: true
            }
          },
          member: {
            select: {
              name: true
            }
          },
          operator: {
            select: {
              name: true
            }
          }
        },
        orderBy: [{ startTime: "asc" }]
      });
      res.json(resultWithoutDate);
      return;
    }
    const fromObj = from ? new Date(from) : void 0;
    const toObj = to ? new Date(to) : void 0;
    if (fromObj && isNaN(fromObj.getTime()) || toObj && isNaN(toObj.getTime())) {
      res.status(400).json({ error: "As datas fornecidas n\xE3o s\xE3o v\xE1lidas" });
      return;
    }
    const access = await db_default.access.findMany({
      where: {
        lobbyId: lobby,
        ...fromObj && toObj ? {
          startTime: {
            gte: fromObj,
            lte: toObj
          }
        } : {}
      },
      include: {
        visitor: {
          select: {
            name: true
          }
        },
        member: {
          select: {
            name: true
          }
        },
        operator: {
          select: {
            name: true
          }
        },
        lobby: {
          select: {
            name: true
          }
        }
      },
      orderBy: [{ startTime: "asc" }]
    });
    res.json(access);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os acessos" });
  }
};

export {
  getAllAccess,
  getAccess,
  createAccess,
  updateAccess,
  deleteAccess,
  getAccessByLobby,
  getFilteredAccess,
  generateReport
};
