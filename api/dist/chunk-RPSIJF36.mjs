import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/deviceModel.ts
var getDeviceModel = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const device = await db_default.deviceModel.findUniqueOrThrow({
      where: { deviceModelId: id }
    });
    if (!device) {
      res.status(404).json({ error: "Modelo n\xE3o encontrado" });
      return;
    }
    res.json(device);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o modelo" });
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
var createDeviceModel = async (req, res) => {
  try {
    const { model, brand, description, isFacial } = req.body;
    const device = await db_default.deviceModel.create({
      data: { model, brand, description, isFacial }
    });
    res.status(201).json(device);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o modelo de dispositivo" });
  }
};
var updateDeviceModel = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { model, brand, description, isFacial } = req.body;
    const device = await db_default.deviceModel.update({
      where: { deviceModelId: id },
      data: { model, brand, description, isFacial }
    });
    res.status(200).json(device);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o modelo de dispositivo" });
  }
};
var deleteDeviceModel = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.deviceModel.delete({
      where: { deviceModelId: id }
    });
    res.json({ message: "Modelo exclu\xEDdo com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o modelo de dispositivo" });
  }
};

export {
  getDeviceModel,
  getDeviceModels,
  createDeviceModel,
  updateDeviceModel,
  deleteDeviceModel
};
