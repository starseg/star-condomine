import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/groupAccessRule.ts
var getAllGroupAccessRules = async (req, res) => {
  try {
    const groupAccessRule = await db_default.groupAccessRule.findMany({
      orderBy: [{ groupAccessRuleId: "asc" }],
      include: {
        group: {
          select: { name: true }
        },
        accessRule: {
          select: { name: true }
        }
      }
    });
    res.json(groupAccessRule);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os grupos" });
  }
};
var getGroupAccessRule = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const groupAccessRule = await db_default.groupAccessRule.findUniqueOrThrow({
      where: { groupAccessRuleId: id },
      include: {
        group: {
          select: { name: true }
        },
        accessRule: {
          select: { name: true }
        }
      }
    });
    if (!groupAccessRule) {
      res.status(404).json({ error: "grupo n\xE3o encontrado" });
      return;
    }
    res.json(groupAccessRule);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o grupo" });
  }
};
var getGroupAccessRulesByLobby = async (req, res) => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const groupAccessRule = await db_default.groupAccessRule.findMany({
      include: {
        group: { select: { name: true } },
        accessRule: { select: { name: true } }
      },
      where: {
        group: { lobbyId: lobby },
        accessRule: { lobbyId: lobby }
      }
    });
    if (!groupAccessRule) {
      res.status(404).json({ error: "grupo n\xE3o encontrado" });
      return;
    }
    res.json(groupAccessRule);
  } catch (error) {
    res.status(500).json({ error });
  }
};
var createGroupAccessRule = async (req, res) => {
  try {
    const { accessRuleId, groupId } = req.body;
    const groupAccessRule = await db_default.groupAccessRule.create({
      data: { accessRuleId, groupId }
    });
    res.status(201).json(groupAccessRule);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o grupo" });
  }
};
var updateGroupAccessRule = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { accessRuleId, groupId } = req.body;
    const groupAccessRule = await db_default.groupAccessRule.update({
      where: { groupAccessRuleId: id },
      data: { accessRuleId, groupId }
    });
    res.status(200).json(groupAccessRule);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o grupo" });
  }
};
var deleteGroupAccessRule = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.groupAccessRule.delete({
      where: { groupAccessRuleId: id }
    });
    res.json({ message: "grupo exclu\xEDdo com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o grupo" });
  }
};

export {
  getAllGroupAccessRules,
  getGroupAccessRule,
  getGroupAccessRulesByLobby,
  createGroupAccessRule,
  updateGroupAccessRule,
  deleteGroupAccessRule
};
