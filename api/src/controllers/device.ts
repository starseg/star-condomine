import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllDevices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const device = await prisma.device.findMany();
    res.json(device);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os dispositivos" });
  }
};

export const getDevice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const device = await prisma.device.findUniqueOrThrow({
      where: { deviceId: id },
    });
    if (!device) {
      res.status(404).json({ error: "Dispositivo não encontrado" });
      return;
    }
    res.json(device);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o dispositivo" });
  }
};

export const createDevice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, ip, ramal, description, deviceModelId, lobbyId } = req.body;
    const device = await prisma.device.create({
      data: { name, ip, ramal, description, deviceModelId, lobbyId },
    });
    res.status(201).json(device);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o dispositivo" });
  }
};

export const updateDevice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { name, ip, ramal, description, deviceModelId, lobbyId } = req.body;
    const device = await prisma.device.update({
      where: { deviceId: id },
      data: { name, ip, ramal, description, deviceModelId, lobbyId },
    });
    res.status(200).json(device);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o dispositivo" });
  }
};

export const deleteDevice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.device.delete({
      where: { deviceId: id },
    });
    res.json({ message: "Dispositivo excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o dispositivo" });
  }
};
