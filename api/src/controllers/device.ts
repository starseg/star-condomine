import { Request, Response } from "express";
import prisma from "../db";
import { Status } from "@prisma/client";

export const getAllDevices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const device = await prisma.device.findMany({
      include: {
        lobby: {
          select: {
            name: true,
          },
        },
      },
    });
    res.json(device);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os dispositivos" });
  }
};

export const getDevice = async (req: Request, res: Response): Promise<void> => {
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
    const {
      name,
      ip,
      ramal,
      description,
      status,
      login,
      password,
      deviceModelId,
      lobbyId,
    } = req.body;
    const device = await prisma.device.create({
      data: {
        name,
        ip,
        ramal,
        description,
        status,
        login,
        password,
        deviceModelId,
        lobbyId,
      },
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
    const {
      name,
      ip,
      ramal,
      description,
      status,
      login,
      password,
      deviceModelId,
      lobbyId,
    } = req.body;
    const device = await prisma.device.update({
      where: { deviceId: id },
      data: {
        name,
        ip,
        ramal,
        description,
        status,
        login,
        password,
        deviceModelId,
        lobbyId,
      },
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

export const getDeviceByLobby = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lobby = parseInt(req.params.lobby, 10);

    const device = await prisma.device.findMany({
      where: {
        lobbyId: lobby,
      },
      include: {
        deviceModel: true,
        lobby: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!device) {
      res.status(404).json({ error: "Dispositivos não encontrados" });
      return;
    }
    res.json(device);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os dispositivos" });
  }
};

export const getFilteredDevices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const { query, status } = req.query;

    const whereCondition = query || status
      ? {
        OR: [
          { name: { contains: query as string } },
          { ip: { contains: query as string } },
          { description: { contains: query as string } },
          { deviceModel: { model: { contains: query as string } } },
        ],
        AND: { lobbyId: lobby, status: status as Status },
      }
      : {};
    const device = await prisma.device.findMany({
      where: whereCondition,
      include: {
        deviceModel: true,
        lobby: {
          select: {
            name: true,
          }
        }
      },
      orderBy: [{ name: "asc" }],
    });
    if (!device) {
      res.status(404).json({ error: "Nenhum veículo encontrado" });
      return;
    }
    res.json(device);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os veículos" });
  }
};

// MODELOS DE DISPOSITIVO
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
