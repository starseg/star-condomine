import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/accessRuleTimeZone.ts
var getAllAccessRuleTimeZones = async (req, res) => {
  try {
    const accessRuleTimeZone = await db_default.accessRuleTimeZone.findMany({
      orderBy: [{ accessRuleTimeZoneId: "asc" }],
      include: {
        timeZone: {
          select: { name: true }
        },
        accessRule: {
          select: { name: true }
        }
      }
    });
    res.json(accessRuleTimeZone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os grupos" });
  }
};
var getAccessRuleTimeZone = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const accessRuleTimeZone = await db_default.accessRuleTimeZone.findUniqueOrThrow({
      where: { accessRuleTimeZoneId: id },
      include: {
        timeZone: {
          select: { name: true }
        },
        accessRule: {
          select: { name: true }
        }
      }
    });
    if (!accessRuleTimeZone) {
      res.status(404).json({ error: "grupo n\xE3o encontrado" });
      return;
    }
    res.json(accessRuleTimeZone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o grupo" });
  }
};
var getAccessRuleTimeZonesByLobby = async (req, res) => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const accessRuleTimeZone = await db_default.accessRuleTimeZone.findMany({
      include: {
        timeZone: {
          select: { name: true }
        },
        accessRule: {
          select: { name: true }
        }
      },
      where: {
        accessRule: {
          lobbyId: lobby
        },
        timeZone: {
          lobbyId: lobby
        }
      }
    });
    if (!accessRuleTimeZone) {
      res.status(404).json({ error: "grupo n\xE3o encontrado" });
      return;
    }
    res.json(accessRuleTimeZone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o grupo" });
  }
};
var createAccessRuleTimeZone = async (req, res) => {
  try {
    const { accessRuleId, timeZoneId } = req.body;
    const accessRuleTimeZone = await db_default.accessRuleTimeZone.create({
      data: { accessRuleId, timeZoneId }
    });
    res.status(201).json(accessRuleTimeZone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o grupo" });
  }
};
var updateAccessRuleTimeZone = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { accessRuleId, timeZoneId } = req.body;
    const accessRuleTimeZone = await db_default.accessRuleTimeZone.update({
      where: { accessRuleTimeZoneId: id },
      data: { accessRuleId, timeZoneId }
    });
    res.status(200).json(accessRuleTimeZone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o grupo" });
  }
};
var deleteAccessRuleTimeZone = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.accessRuleTimeZone.delete({
      where: { accessRuleTimeZoneId: id }
    });
    res.json({ message: "grupo exclu\xEDdo com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o grupo" });
  }
};

export {
  getAllAccessRuleTimeZones,
  getAccessRuleTimeZone,
  getAccessRuleTimeZonesByLobby,
  createAccessRuleTimeZone,
  updateAccessRuleTimeZone,
  deleteAccessRuleTimeZone
};
