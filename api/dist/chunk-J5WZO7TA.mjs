import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/areaAccessRule.ts
var getAllAreaAccessRules = async (req, res) => {
  try {
    const areaAccessRule = await db_default.areaAccessRule.findMany({
      orderBy: [{ areaAccessRuleId: "asc" }],
      include: {
        lobby: {
          select: { name: true }
        },
        accessRule: {
          select: { name: true }
        }
      }
    });
    res.json(areaAccessRule);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os grupos" });
  }
};
var getAreaAccessRule = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const areaAccessRule = await db_default.areaAccessRule.findUniqueOrThrow({
      where: { areaAccessRuleId: id },
      include: {
        lobby: {
          select: { name: true }
        },
        accessRule: {
          select: { name: true }
        }
      }
    });
    if (!areaAccessRule) {
      res.status(404).json({ error: "grupo n\xE3o encontrado" });
      return;
    }
    res.json(areaAccessRule);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o grupo" });
  }
};
var createAreaAccessRule = async (req, res) => {
  try {
    const { accessRuleId, areaId } = req.body;
    const areaAccessRule = await db_default.areaAccessRule.create({
      data: { accessRuleId, areaId }
    });
    res.status(201).json(areaAccessRule);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o grupo" });
  }
};
var updateAreaAccessRule = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { accessRuleId, areaId } = req.body;
    const areaAccessRule = await db_default.areaAccessRule.update({
      where: { areaAccessRuleId: id },
      data: { accessRuleId, areaId }
    });
    res.status(200).json(areaAccessRule);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o grupo" });
  }
};
var deleteAreaAccessRule = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.areaAccessRule.delete({
      where: { areaAccessRuleId: id }
    });
    res.json({ message: "grupo exclu\xEDdo com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o grupo" });
  }
};

export {
  getAllAreaAccessRules,
  getAreaAccessRule,
  createAreaAccessRule,
  updateAreaAccessRule,
  deleteAreaAccessRule
};
