import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllVehicles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const vehicle = await prisma.vehicle.findMany();
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os veículos" });
  }
};

export const getVehicle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const vehicle = await prisma.vehicle.findUniqueOrThrow({
      where: { vehicleId: id },
    });
    if (!vehicle) {
      res.status(404).json({ error: "Veículo não encontrado" });
      return;
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o veículo" });
  }
};

export const createVehicle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { licensePlate, brand, model, color, tag, comments, vehicleTypeId, memberId } = req.body;
    const vehicle = await prisma.vehicle.create({
      data: { licensePlate, brand, model, color, tag, comments, vehicleTypeId, memberId },
    });
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o veículo" });
  }
};

export const updateVehicle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { licensePlate, brand, model, color, tag, comments, vehicleTypeId, memberId } = req.body;
    const vehicle = await prisma.vehicle.update({
      where: { vehicleId: id },
      data: { licensePlate, brand, model, color, tag, comments, vehicleTypeId, memberId },
    });
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o veículo" });
  }
};

export const deleteVehicle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.vehicle.delete({
      where: { vehicleId: id },
    });
    res.json({ message: "Veículo excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o veículo" });
  }
};
