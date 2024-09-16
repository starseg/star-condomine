import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/timeSpan.ts
var getAllTimeSpans = async (req, res) => {
  try {
    const timeSpan = await db_default.timeSpan.findMany({
      orderBy: [{ timeSpanId: "asc" }],
      include: { timeZone: true }
    });
    res.json(timeSpan);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os TimeSpans" });
  }
};
var getTimeSpan = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const timeSpan = await db_default.timeSpan.findUniqueOrThrow({
      where: { timeSpanId: id },
      include: { timeZone: true }
    });
    if (!timeSpan) {
      res.status(404).json({ error: "TimeSpan n\xE3o encontrado" });
      return;
    }
    res.json(timeSpan);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o TimeSpan" });
  }
};
var getTimeSpansByLobby = async (req, res) => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const timeSpan = await db_default.timeSpan.findMany({
      include: { timeZone: true },
      where: { lobbyId: lobby },
      orderBy: [{ timeSpanId: "asc" }]
    });
    res.json(timeSpan);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os TimeZones" });
  }
};
var createTimeSpan = async (req, res) => {
  try {
    const {
      start,
      end,
      sun,
      mon,
      tue,
      wed,
      thu,
      fri,
      sat,
      hol1,
      hol2,
      hol3,
      timeZoneId,
      lobbyId
    } = req.body;
    const timeSpan = await db_default.timeSpan.create({
      data: {
        start,
        end,
        sun,
        mon,
        tue,
        wed,
        thu,
        fri,
        sat,
        hol1,
        hol2,
        hol3,
        timeZoneId,
        lobbyId
      }
    });
    res.status(201).json(timeSpan);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o TimeSpan" });
  }
};
var updateTimeSpan = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const {
      start,
      end,
      sun,
      mon,
      tue,
      wed,
      thu,
      fri,
      sat,
      hol1,
      hol2,
      hol3,
      timeZoneId,
      lobbyId
    } = req.body;
    const timeSpan = await db_default.timeSpan.update({
      where: { timeSpanId: id },
      data: {
        start,
        end,
        sun,
        mon,
        tue,
        wed,
        thu,
        fri,
        sat,
        hol1,
        hol2,
        hol3,
        timeZoneId,
        lobbyId
      }
    });
    res.status(200).json(timeSpan);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o timeSpan" });
  }
};
var deleteTimeSpan = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.timeSpan.delete({
      where: { timeSpanId: id }
    });
    res.json({ message: "timeSpan exclu\xEDdo com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o timeSpan" });
  }
};

export {
  getAllTimeSpans,
  getTimeSpan,
  getTimeSpansByLobby,
  createTimeSpan,
  updateTimeSpan,
  deleteTimeSpan
};
