import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllVisitors = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const visitor = await prisma.visitor.findMany();
    res.json(visitor);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os visitantes" });
  }
};

export const getVisitor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const visitor = await prisma.visitor.findUniqueOrThrow({
      where: { visitorId: id },
    });
    if (!visitor) {
      res.status(404).json({ error: "Visitante não encontrado" });
      return;
    }
    res.json(visitor);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o visitante" });
  }
};

export const createVisitor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      profileUrl,
      name,
      rg,
      cpf,
      phone,
      startDate,
      endDate,
      company,
      relation,
      visitorTypeId,
    } = req.body;
    const visitor = await prisma.visitor.create({
      data: {
        profileUrl,
        name,
        rg,
        cpf,
        phone,
        startDate,
        endDate,
        company,
        relation,
        visitorTypeId,
      },
    });
    res.status(201).json(visitor);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o visitante" });
  }
};

export const updateVisitor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const {
      profileUrl,
      name,
      rg,
      cpf,
      phone,
      startDate,
      endDate,
      company,
      relation,
      status,
      visitorTypeId,
    } = req.body;
    const visitor = await prisma.visitor.update({
      where: { visitorId: id },
      data: {
        profileUrl,
        name,
        rg,
        cpf,
        phone,
        startDate,
        endDate,
        company,
        relation,
        status,
        visitorTypeId,
      },
    });
    res.status(200).json(visitor);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o visitante" });
  }
};

export const deleteVisitor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.visitor.delete({
      where: { visitorId: id },
    });
    res.json({ message: "Visitante excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o visitante" });
  }
};
