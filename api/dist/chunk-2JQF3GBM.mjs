import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/accessRule.ts
var getAllAccessRules = async (req, res) => {
  try {
    const accessRule = await db_default.accessRule.findMany({
      orderBy: [{ accessRuleId: "asc" }]
    });
    res.json(accessRule);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as regras de acesso" });
  }
};
var getAccessRule = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const accessRule = await db_default.accessRule.findUniqueOrThrow({
      where: { accessRuleId: id }
    });
    if (!accessRule) {
      res.status(404).json({ error: "regra de acesso n\xE3o encontrada" });
      return;
    }
    res.json(accessRule);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar a regra de acesso" });
  }
};
var getAccessRulesByLobby = async (req, res) => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const accessRule = await db_default.accessRule.findMany({
      where: { lobbyId: lobby },
      orderBy: [{ accessRuleId: "asc" }]
    });
    res.json(accessRule);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar regras de acesso" });
  }
};
var createAccessRule = async (req, res) => {
  try {
    const { name, type, priority, lobbyId } = req.body;
    const accessRule = await db_default.accessRule.create({
      data: { name, type, priority, lobbyId }
    });
    res.status(201).json(accessRule);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar a regra de acesso" });
  }
};
var updateAccessRule = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, type, priority, lobbyId } = req.body;
    const accessRule = await db_default.accessRule.update({
      where: { accessRuleId: id },
      data: { name, type, priority, lobbyId }
    });
    res.status(200).json(accessRule);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar a regra de acesso" });
  }
};
var deleteAccessRule = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.accessRule.delete({
      where: { accessRuleId: id }
    });
    res.json({ message: "regra de acesso exclu\xEDda com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir a regra de acesso" });
  }
};

export {
  getAllAccessRules,
  getAccessRule,
  getAccessRulesByLobby,
  createAccessRule,
  updateAccessRule,
  deleteAccessRule
};
