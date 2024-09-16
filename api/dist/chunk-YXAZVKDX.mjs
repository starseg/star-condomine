import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/lobby.ts
var getAllLobbies = async (req, res) => {
  try {
    const lobby = await db_default.lobby.findMany({
      orderBy: [{ name: "asc" }],
      include: {
        device: true,
        lobbyProblem: true,
        ControllerBrand: true
      }
    });
    res.json(lobby);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as portarias" });
  }
};
var getFilteredLobbies = async (req, res) => {
  try {
    const { query } = req.query;
    const whereCondition = query ? {
      OR: [
        { name: { contains: query } },
        { city: { contains: query } },
        { state: { contains: query } }
      ]
    } : {};
    const lobbies = await db_default.lobby.findMany({
      where: whereCondition,
      include: {
        device: true,
        lobbyProblem: true,
        ControllerBrand: true
      },
      orderBy: [{ name: "asc" }]
    });
    res.json(lobbies);
  } catch (error) {
    console.error("Erro na busca da portaria:", error);
    res.status(500).json({ error: "Erro na busca da portaria" });
  }
};
var getLobby = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const lobby = await db_default.lobby.findUniqueOrThrow({
      where: { lobbyId: id },
      include: {
        ControllerBrand: true,
        device: true
      }
    });
    if (!lobby) {
      res.status(404).json({ error: "Portaria n\xE3o encontrada" });
      return;
    }
    res.json(lobby);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar a portaria" });
  }
};
var createLobby = async (req, res) => {
  try {
    const {
      cnpj,
      name,
      responsible,
      telephone,
      schedules,
      exitControl,
      procedures,
      datasheet,
      cep,
      state,
      city,
      neighborhood,
      street,
      number,
      complement,
      code,
      type,
      controllerBrandId
    } = req.body;
    const lobby = await db_default.lobby.create({
      data: {
        cnpj,
        name,
        responsible,
        telephone,
        schedules,
        exitControl,
        procedures,
        datasheet,
        cep,
        state,
        city,
        neighborhood,
        street,
        number,
        complement,
        code,
        type,
        controllerBrandId
      }
    });
    res.status(201).json(lobby);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar a portaria" });
  }
};
var updateLobby = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const {
      cnpj,
      name,
      responsible,
      telephone,
      schedules,
      exitControl,
      procedures,
      datasheet,
      cep,
      state,
      city,
      neighborhood,
      street,
      number,
      complement,
      code,
      type,
      controllerBrandId
    } = req.body;
    const lobby = await db_default.lobby.update({
      where: { lobbyId: id },
      data: {
        cnpj,
        name,
        responsible,
        telephone,
        schedules,
        exitControl,
        procedures,
        datasheet,
        cep,
        state,
        city,
        neighborhood,
        street,
        number,
        complement,
        code,
        type,
        controllerBrandId
      }
    });
    res.status(200).json(lobby);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar a portaria" });
  }
};
var deleteLobby = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.lobby.delete({
      where: { lobbyId: id }
    });
    res.json({ message: "Portaria exclu\xEDda com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir a portaria" });
  }
};

export {
  getAllLobbies,
  getFilteredLobbies,
  getLobby,
  createLobby,
  updateLobby,
  deleteLobby
};
