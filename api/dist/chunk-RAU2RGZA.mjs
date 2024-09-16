import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/lobbyProblem.ts
var getAllLobbyProblems = async (req, res) => {
  try {
    const lobbyProblem = await db_default.lobbyProblem.findMany();
    res.json(lobbyProblem);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os problemas" });
  }
};
var getLobbyProblem = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const lobbyProblem = await db_default.lobbyProblem.findUniqueOrThrow({
      where: { lobbyProblemId: id }
    });
    if (!lobbyProblem) {
      res.status(404).json({ error: "Problema n\xE3o encontrado" });
      return;
    }
    res.json(lobbyProblem);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o problema" });
  }
};
var createLobbyProblem = async (req, res) => {
  try {
    const { title, description, date, lobbyId, operatorId } = req.body;
    const lobbyProblem = await db_default.lobbyProblem.create({
      data: { title, description, date, lobbyId, operatorId }
    });
    res.status(201).json(lobbyProblem);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o problema" });
  }
};
var updateLobbyProblem = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, description, date, status, lobbyId, operatorId } = req.body;
    const lobbyProblem = await db_default.lobbyProblem.update({
      where: { lobbyProblemId: id },
      data: { title, description, date, status, lobbyId, operatorId }
    });
    res.status(200).json(lobbyProblem);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o problema" });
  }
};
var deleteLobbyProblem = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.lobbyProblem.delete({
      where: { lobbyProblemId: id }
    });
    res.json({ message: "Problema exclu\xEDdo com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o problema" });
  }
};
var getProblemsByLobby = async (req, res) => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const lobbyProblem = await db_default.lobbyProblem.findMany({
      where: { lobbyId: lobby },
      include: { operator: true },
      orderBy: [{ status: "asc" }, { date: "desc" }]
    });
    res.json(lobbyProblem);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os problemas" });
  }
};
var getFilteredLobbyProblem = async (req, res) => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const { query } = req.query;
    const whereCondition = query ? {
      OR: [
        { title: { contains: query } },
        { description: { contains: query } }
      ],
      AND: { lobbyId: lobby }
    } : {};
    const lobbyProblem = await db_default.lobbyProblem.findMany({
      where: whereCondition,
      include: { operator: true },
      orderBy: [{ status: "asc" }]
    });
    if (!lobbyProblem) {
      res.status(404).json({ error: "Nenhum problema encontrado" });
      return;
    }
    res.json(lobbyProblem);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os acessos" });
  }
};

export {
  getAllLobbyProblems,
  getLobbyProblem,
  createLobbyProblem,
  updateLobbyProblem,
  deleteLobbyProblem,
  getProblemsByLobby,
  getFilteredLobbyProblem
};
