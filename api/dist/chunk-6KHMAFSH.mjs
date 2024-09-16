import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/timeZone.ts
var getAllTimeZones = async (req, res) => {
  try {
    const timeZone = await db_default.timeZone.findMany({
      orderBy: [{ timeZoneId: "asc" }]
    });
    res.json(timeZone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os TimeZones" });
  }
};
var getTimeZonesByLobby = async (req, res) => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const timeZone = await db_default.timeZone.findMany({
      where: { lobbyId: lobby },
      orderBy: [{ timeZoneId: "asc" }]
    });
    res.json(timeZone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os TimeZones" });
  }
};
var getTimeZone = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const timeZone = await db_default.timeZone.findUniqueOrThrow({
      where: { timeZoneId: id }
    });
    if (!timeZone) {
      res.status(404).json({ error: "TimeZone n\xE3o encontrado" });
      return;
    }
    res.json(timeZone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o TimeZone" });
  }
};
var createTimeZone = async (req, res) => {
  try {
    const { name, lobbyId } = req.body;
    const timeZone = await db_default.timeZone.create({
      data: { name, lobbyId }
    });
    res.status(201).json(timeZone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o TimeZone" });
  }
};
var updateTimeZone = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, lobbyId } = req.body;
    const timeZone = await db_default.timeZone.update({
      where: { timeZoneId: id },
      data: { name, lobbyId }
    });
    res.status(200).json(timeZone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o timeZone" });
  }
};
var deleteTimeZone = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.timeZone.delete({
      where: { timeZoneId: id }
    });
    res.json({ message: "timeZone exclu\xEDdo com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o timeZone" });
  }
};

export {
  getAllTimeZones,
  getTimeZonesByLobby,
  getTimeZone,
  createTimeZone,
  updateTimeZone,
  deleteTimeZone
};
