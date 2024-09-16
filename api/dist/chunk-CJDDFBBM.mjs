import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/lobbyCalendar.ts
var getAllLobbyCalendars = async (req, res) => {
  try {
    const lobbyCalendar = await db_default.lobbyCalendar.findMany();
    res.json(lobbyCalendar);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as datas" });
  }
};
var getLobbyCalendar = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const lobbyCalendar = await db_default.lobbyCalendar.findUniqueOrThrow({
      where: { lobbyCalendarId: id }
    });
    if (!lobbyCalendar) {
      res.status(404).json({ error: "data n\xE3o encontrada" });
      return;
    }
    res.json(lobbyCalendar);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar a data" });
  }
};
var createLobbyCalendar = async (req, res) => {
  try {
    const { description, date, lobbyId } = req.body;
    const lobbyCalendar = await db_default.lobbyCalendar.create({
      data: { description, date, lobbyId }
    });
    res.status(201).json(lobbyCalendar);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar a data" });
  }
};
var updateLobbyCalendar = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { description, date, lobbyId } = req.body;
    const lobbyCalendar = await db_default.lobbyCalendar.update({
      where: { lobbyCalendarId: id },
      data: { description, date, lobbyId }
    });
    res.status(200).json(lobbyCalendar);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar a data" });
  }
};
var deleteLobbyCalendar = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.lobbyCalendar.delete({
      where: { lobbyCalendarId: id }
    });
    res.json({ message: "data exclu\xEDda com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir a data" });
  }
};
var getCalendarByLobby = async (req, res) => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const lobbyCalendar = await db_default.lobbyCalendar.findMany({
      where: { lobbyId: lobby },
      orderBy: [{ date: "asc" }]
    });
    res.json(lobbyCalendar);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o calend\xE1rio" });
  }
};
var getTodaysHoliday = async (req, res) => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const lobbyCalendar = await db_default.lobbyCalendar.findMany({
      where: {
        lobbyId: lobby,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1e3)
        }
      }
    });
    res.json(lobbyCalendar);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar a data" });
  }
};
var getFilteredCalendar = async (req, res) => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const { query } = req.query;
    const whereCondition = query ? {
      OR: [{ description: { contains: query } }],
      AND: { lobbyId: lobby }
    } : {};
    const lobbyCalendar = await db_default.lobbyCalendar.findMany({
      where: whereCondition,
      orderBy: [{ date: "asc" }]
    });
    if (!lobbyCalendar) {
      res.status(404).json({ error: "Nenhuma data encontrada" });
      return;
    }
    res.json(lobbyCalendar);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as datas" });
  }
};

export {
  getAllLobbyCalendars,
  getLobbyCalendar,
  createLobbyCalendar,
  updateLobbyCalendar,
  deleteLobbyCalendar,
  getCalendarByLobby,
  getTodaysHoliday,
  getFilteredCalendar
};
