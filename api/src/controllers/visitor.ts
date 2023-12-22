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
      include: { visitorType: true },
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
      relation,
      visitorTypeId,
      lobbyId,
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
        relation,
        visitorTypeId,
        lobbyId,
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

export const getVisitorTypes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const types = await prisma.visitorType.findMany();
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os tipos" });
  }
};

export const getVisitorsByLobby = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const visitor = await prisma.visitor.findMany({
      where: { lobbyId: lobby },
      include: { visitorType: true },
      orderBy: [{ status: "asc" }, { name: "asc" }],
    });
    res.json(visitor);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os visitantes" });
  }
};

export const getFilteredVisitors = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const { query } = req.query;

    const whereCondition = query
      ? {
          OR: [
            { cpf: { contains: query as string } },
            { name: { contains: query as string } },
          ],
          AND: { lobbyId: lobby },
        }
      : {};
    const visitor = await prisma.visitor.findMany({
      where: whereCondition,
      include: { visitorType: true },
      orderBy: [{ status: "asc" }, { name: "asc" }],
    });
    if (!visitor) {
      res.status(404).json({ error: "Nenhum visitante encontrado" });
      return;
    }
    res.json(visitor);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os visitantes" });
  }
};
