import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllTelephones = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const telephone = await prisma.telephone.findMany();
    res.json(telephone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os telefones" });
  }
};

export const getTelephone = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const telephone = await prisma.telephone.findUniqueOrThrow({
      where: { telephoneId: id },
    });
    if (!telephone) {
      res.status(404).json({ error: "Telefone não encontrado" });
      return;
    }
    res.json(telephone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o telefone" });
  }
};

export const createTelephone = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { number, memberId } = req.body;
    const telephone = await prisma.telephone.create({
      data: { number, memberId },
    });
    res.status(201).json(telephone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o telefone" });
  }
};

export const deleteTelephone = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.telephone.delete({
      where: { telephoneId: id },
    });
    res.json({ message: "Telefone excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o telefone" });
  }
};

export const getTelephonesByMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const telephone = await prisma.telephone.findMany({
      where: {
        memberId: parseInt(req.params.id, 10),
      },
    });
    res.json(telephone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os telefones" });
  }
};
