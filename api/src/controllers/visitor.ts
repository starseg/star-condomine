import { Request, Response } from "express";
import prisma from "../db";

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
      include: {
        visitorType: true,
        access: {
          include: { member: { select: { name: true } } },
        },
        scheduling: {
          include: { member: { select: { name: true } } },
        },
      },
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
      documentUrl,
      name,
      rg,
      cpf,
      phone,
      startDate,
      endDate,
      relation,
      comments,
      visitorTypeId,
      lobbyId,
    } = req.body;
    const visitor = await prisma.visitor.create({
      data: {
        profileUrl,
        documentUrl,
        name,
        rg,
        cpf,
        phone,
        startDate,
        endDate,
        relation,
        comments,
        visitorTypeId,
        lobbyId,
      },
    });
    res.status(201).json(visitor);
  } catch (error) {
    res.status(500).json(error);
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
      documentUrl,
      name,
      rg,
      cpf,
      phone,
      startDate,
      endDate,
      relation,
      comments,
      status,
      visitorTypeId,
    } = req.body;
    const visitor = await prisma.visitor.update({
      where: { visitorId: id },
      data: {
        profileUrl,
        documentUrl,
        name,
        rg,
        cpf,
        phone,
        startDate,
        endDate,
        relation,
        comments,
        status,
        visitorTypeId,
      },
    });
    res.status(200).json(visitor);
  } catch (error) {
    res.status(500).json(error);
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lobby = parseInt(req.params.lobby, 10);
    const visitor = await prisma.visitor.findMany({
      include: {
        visitorType: true,
        access: {
          select: {
            endTime: true,
          },
          where: {
            endTime: null,
          },
        },
        lobby: {
          select: {
            exitControl: true,
          },
        },
        scheduling: {
          select: {
            schedulingId: true,
          },
          where: {
            status: "ACTIVE",
            startDate: {
              lte: new Date(),
            },
            endDate: {
              gte: today,
            },
          },
        },
      },
      where: { lobbyId: lobby },
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const whereCondition = query
      ? {
          OR: [
            { cpf: { contains: query as string } },
            { rg: { contains: query as string } },
            { name: { contains: query as string } },
          ],
          AND: { lobbyId: lobby },
        }
      : {};
    const visitor = await prisma.visitor.findMany({
      where: whereCondition,
      include: {
        visitorType: true,
        access: {
          select: {
            endTime: true,
          },
          where: {
            endTime: null,
          },
        },
        lobby: {
          select: {
            exitControl: true,
          },
        },
        scheduling: {
          select: {
            schedulingId: true,
          },
          where: {
            status: "ACTIVE",
            startDate: {
              lte: new Date(),
            },
            endDate: {
              gte: today,
            },
          },
        },
      },
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
