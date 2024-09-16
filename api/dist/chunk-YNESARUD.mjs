import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/group.ts
var getAllGroups = async (req, res) => {
  try {
    const group = await db_default.group.findMany({
      orderBy: [{ groupId: "asc" }]
    });
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os grupos" });
  }
};
var getGroup = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const group = await db_default.group.findUniqueOrThrow({
      where: { groupId: id }
    });
    if (!group) {
      res.status(404).json({ error: "grupo n\xE3o encontrado" });
      return;
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o grupo" });
  }
};
var getGroupsByLobby = async (req, res) => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const group = await db_default.group.findMany({
      where: { lobbyId: lobby },
      orderBy: [{ groupId: "asc" }]
    });
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os grupos" });
  }
};
var createGroup = async (req, res) => {
  try {
    const { name, lobbyId } = req.body;
    const group = await db_default.group.create({
      data: { name, lobbyId }
    });
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o grupo" });
  }
};
var updateGroup = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, lobbyId } = req.body;
    const group = await db_default.group.update({
      where: { groupId: id },
      data: { name, lobbyId }
    });
    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o grupo" });
  }
};
var deleteGroup = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.group.delete({
      where: { groupId: id }
    });
    res.json({ message: "grupo exclu\xEDdo com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o grupo" });
  }
};

export {
  getAllGroups,
  getGroup,
  getGroupsByLobby,
  createGroup,
  updateGroup,
  deleteGroup
};
