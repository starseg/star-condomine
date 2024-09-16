import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/device.ts
var getAllDevices = async (req, res) => {
  try {
    const device = await db_default.device.findMany({
      include: {
        lobby: {
          select: {
            name: true
          }
        }
      }
    });
    res.json(device);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os dispositivos" });
  }
};
var getDevice = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const device = await db_default.device.findUniqueOrThrow({
      where: { deviceId: id }
    });
    if (!device) {
      res.status(404).json({ error: "Dispositivo n\xE3o encontrado" });
      return;
    }
    res.json(device);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o dispositivo" });
  }
};
var createDevice = async (req, res) => {
  try {
    const {
      name,
      ip,
      ramal,
      description,
      login,
      password,
      deviceModelId,
      lobbyId
    } = req.body;
    const device = await db_default.device.create({
      data: {
        name,
        ip,
        ramal,
        description,
        login,
        password,
        deviceModelId,
        lobbyId
      }
    });
    res.status(201).json(device);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o dispositivo" });
  }
};
var updateDevice = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const {
      name,
      ip,
      ramal,
      description,
      login,
      password,
      deviceModelId,
      lobbyId
    } = req.body;
    const device = await db_default.device.update({
      where: { deviceId: id },
      data: {
        name,
        ip,
        ramal,
        description,
        login,
        password,
        deviceModelId,
        lobbyId
      }
    });
    res.status(200).json(device);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o dispositivo" });
  }
};
var deleteDevice = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.device.delete({
      where: { deviceId: id }
    });
    res.json({ message: "Dispositivo exclu\xEDdo com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o dispositivo" });
  }
};
var getDeviceByLobby = async (req, res) => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const device = await db_default.device.findMany({
      where: { lobbyId: lobby },
      include: {
        deviceModel: true,
        lobby: {
          select: {
            name: true
          }
        }
      }
    });
    if (!device) {
      res.status(404).json({ error: "Dispositivos n\xE3o encontrados" });
      return;
    }
    res.json(device);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os dispositivos" });
  }
};
var getFilteredDevices = async (req, res) => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const { query } = req.query;
    const whereCondition = query ? {
      OR: [
        { name: { contains: query } },
        { ip: { contains: query } },
        { description: { contains: query } },
        { deviceModel: { model: { contains: query } } }
      ],
      AND: { lobbyId: lobby }
    } : {};
    const device = await db_default.device.findMany({
      where: whereCondition,
      include: {
        deviceModel: true
      },
      orderBy: [{ name: "asc" }]
    });
    if (!device) {
      res.status(404).json({ error: "Nenhum ve\xEDculo encontrado" });
      return;
    }
    res.json(device);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os ve\xEDculos" });
  }
};
var getDeviceModels = async (req, res) => {
  try {
    const device = await db_default.deviceModel.findMany();
    res.json(device);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os modelos" });
  }
};

export {
  getAllDevices,
  getDevice,
  createDevice,
  updateDevice,
  deleteDevice,
  getDeviceByLobby,
  getFilteredDevices,
  getDeviceModels
};
