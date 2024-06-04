import { Request, Response } from "express";
import prisma from "../db";

export const getAllBrands = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const device = await prisma.controllerBrand.findMany();
    res.json(device);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as marcas" });
  }
};

export const getBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const controllerBrand = await prisma.controllerBrand.findUniqueOrThrow({
      where: { controllerBrandId: id },
    });
    if (!controllerBrand) {
      res.status(404).json({ error: "Marca não encontrada" });
      return;
    }
    res.json(controllerBrand);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar a marca" });
  }
};

export const createBrand = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, iconUrl } = req.body;
    const controllerBrand = await prisma.controllerBrand.create({
      data: { name, iconUrl },
    });
    res.status(201).json(controllerBrand);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar a marca" });
  }
};

export const updateBrand = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, iconUrl } = req.body;
    const controllerBrand = await prisma.controllerBrand.update({
      where: { controllerBrandId: id },
      data: { name, iconUrl },
    });
    res.status(200).json(controllerBrand);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar a marca" });
  }
};

export const deleteBrand = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.controllerBrand.delete({
      where: { controllerBrandId: id },
    });
    res.json({ message: "Marca excluída com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir a marca" });
  }
};
