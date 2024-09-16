import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/controllerBrand.ts
var getAllBrands = async (req, res) => {
  try {
    const device = await db_default.controllerBrand.findMany();
    res.json(device);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as marcas" });
  }
};
var getBrand = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const controllerBrand = await db_default.controllerBrand.findUniqueOrThrow({
      where: { controllerBrandId: id }
    });
    if (!controllerBrand) {
      res.status(404).json({ error: "Marca n\xE3o encontrada" });
      return;
    }
    res.json(controllerBrand);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar a marca" });
  }
};
var createBrand = async (req, res) => {
  try {
    const { name, iconUrl } = req.body;
    const controllerBrand = await db_default.controllerBrand.create({
      data: { name, iconUrl }
    });
    res.status(201).json(controllerBrand);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar a marca" });
  }
};
var updateBrand = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, iconUrl } = req.body;
    const controllerBrand = await db_default.controllerBrand.update({
      where: { controllerBrandId: id },
      data: { name, iconUrl }
    });
    res.status(200).json(controllerBrand);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar a marca" });
  }
};
var deleteBrand = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.controllerBrand.delete({
      where: { controllerBrandId: id }
    });
    res.json({ message: "Marca exclu\xEDda com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir a marca" });
  }
};

export {
  getAllBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand
};
