import { Request, Response } from "express";
import prisma from "../db";

export const getDeviceModel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const device = await prisma.deviceModel.findUniqueOrThrow({
      where: { deviceModelId: id },
    });
    if (!device) {
      res.status(404).json({ error: "Modelo não encontrado" });
      return;
    }
    res.json(device);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o modelo" });
  }
};

export const getDeviceModels = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const device = await prisma.deviceModel.findMany();
    res.json(device);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os modelos" });
  }
};

export const createDeviceModel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { model, brand, description } = req.body;
    const device = await prisma.deviceModel.create({
      data: { model, brand, description },
    });
    res.status(201).json(device);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o modelo de dispositivo" });
  }
};

export const updateDeviceModel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { model, brand, description } = req.body;
    const device = await prisma.deviceModel.update({
      where: { deviceModelId: id },
      data: { model, brand, description },
    });
    res.status(200).json(device);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar o modelo de dispositivo" });
  }
};

export const deleteDeviceModel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.deviceModel.delete({
      where: { deviceModelId: id },
    });
    res.json({ message: "Modelo excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o modelo de dispositivo" });
  }
};
