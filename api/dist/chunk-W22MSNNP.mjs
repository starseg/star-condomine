import {
  isValidURL
} from "./chunk-3K56DYEE.mjs";
import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/visitor.ts
var getAllVisitors = async (req, res) => {
  try {
    const visitor = await db_default.visitor.findMany();
    res.json(visitor);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os visitantes" });
  }
};
var getVisitor = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const visitor = await db_default.visitor.findUniqueOrThrow({
      where: { visitorId: id },
      include: {
        visitorType: true,
        access: {
          include: { member: { select: { name: true } } }
        },
        scheduling: {
          include: { member: { select: { name: true } } }
        }
      }
    });
    if (!visitor) {
      res.status(404).json({ error: "Visitante n\xE3o encontrado" });
      return;
    }
    res.json(visitor);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o visitante" });
  }
};
var getVisitorPhoto = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const visitor = await db_default.visitor.findUniqueOrThrow({
      where: { visitorId: id },
      select: { profileUrl: true }
    });
    if (!visitor) {
      res.status(404).json({ error: "Visitante n\xE3o encontrado" });
      return;
    }
    const url = visitor.profileUrl;
    if (url && isValidURL(url)) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Falha ao buscar a imagem");
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString("base64");
        res.json({ base64 });
      } catch (error) {
        res.status(500).json({ error: "Erro ao converter imagem" });
      }
    } else {
      res.status(400).json({ error: "URL inv\xE1lida ou n\xE3o encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o visitante" });
  }
};
var createVisitor = async (req, res) => {
  try {
    const {
      profileUrl,
      documentUrl,
      name,
      rg,
      cpf,
      phone,
      startDate,
      endDate,
      relation,
      comments,
      visitorTypeId,
      lobbyId
    } = req.body;
    const visitor = await db_default.visitor.create({
      data: {
        profileUrl,
        documentUrl,
        name,
        rg,
        cpf,
        phone,
        startDate,
        endDate,
        relation,
        comments,
        visitorTypeId,
        lobbyId
      }
    });
    res.status(201).json(visitor);
  } catch (error) {
    res.status(500).json(error);
  }
};
var updateVisitor = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const {
      profileUrl,
      documentUrl,
      name,
      rg,
      cpf,
      phone,
      startDate,
      endDate,
      relation,
      comments,
      status,
      visitorTypeId
    } = req.body;
    const visitor = await db_default.visitor.update({
      where: { visitorId: id },
      data: {
        profileUrl,
        documentUrl,
        name,
        rg,
        cpf,
        phone,
        startDate,
        endDate,
        relation,
        comments,
        status,
        visitorTypeId
      }
    });
    res.status(200).json(visitor);
  } catch (error) {
    res.status(500).json(error);
  }
};
var deleteVisitor = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.visitor.delete({
      where: { visitorId: id }
    });
    res.json({ message: "Visitante exclu\xEDdo com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o visitante" });
  }
};
var getVisitorTypes = async (req, res) => {
  try {
    const types = await db_default.visitorType.findMany();
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os tipos" });
  }
};
var getVisitorsByLobby = async (req, res) => {
  try {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const lobby = parseInt(req.params.lobby, 10);
    const visitor = await db_default.visitor.findMany({
      include: {
        visitorType: true,
        access: {
          select: {
            endTime: true
          },
          where: {
            endTime: null
          }
        },
        lobby: {
          select: {
            exitControl: true
          }
        },
        scheduling: {
          select: {
            schedulingId: true
          },
          where: {
            status: "ACTIVE",
            startDate: {
              lte: /* @__PURE__ */ new Date()
            },
            endDate: {
              gte: today
            }
          }
        }
      },
      where: { lobbyId: lobby },
      orderBy: [{ status: "asc" }, { name: "asc" }]
    });
    res.json(visitor);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os visitantes" });
  }
};
var getFilteredVisitors = async (req, res) => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const { query } = req.query;
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const whereCondition = query ? {
      OR: [
        { cpf: { contains: query } },
        { rg: { contains: query } },
        { name: { contains: query } }
      ],
      AND: { lobbyId: lobby }
    } : {};
    const visitor = await db_default.visitor.findMany({
      where: whereCondition,
      include: {
        visitorType: true,
        access: {
          select: {
            endTime: true
          },
          where: {
            endTime: null
          }
        },
        lobby: {
          select: {
            exitControl: true
          }
        },
        scheduling: {
          select: {
            schedulingId: true
          },
          where: {
            status: "ACTIVE",
            startDate: {
              lte: /* @__PURE__ */ new Date()
            },
            endDate: {
              gte: today
            }
          }
        }
      },
      orderBy: [{ status: "asc" }, { name: "asc" }]
    });
    if (!visitor) {
      res.status(404).json({ error: "Nenhum visitante encontrado" });
      return;
    }
    res.json(visitor);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os visitantes" });
  }
};

export {
  getAllVisitors,
  getVisitor,
  getVisitorPhoto,
  createVisitor,
  updateVisitor,
  deleteVisitor,
  getVisitorTypes,
  getVisitorsByLobby,
  getFilteredVisitors
};
