import { Request, Response } from "express";
import prisma from "../db";
import { subDays } from "date-fns";

export const getAllAccess = async (
  req: Request,
  res: Response
): Promise<void> => {
  // #swagger.summary = 'Get all access',
  // #swagger.tags = ['Access']

  try {
    const access = await prisma.access.findMany();
    res.json(access);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os acessos" });
  }
};

export const getAccess = async (req: Request, res: Response): Promise<void> => {
  // #swagger.summary = 'Get one access',
  // #swagger.tags = ['Access']

  try {
    const id = parseInt(req.params.id, 10);
    const access = await prisma.access.findUniqueOrThrow({
      where: { accessId: id },
      include: {
        visitor: {
          select: {
            name: true,
            cpf: true,
            visitorType: {
              select: {
                description: true,
              },
            },
          },
        },
        member: {
          select: {
            name: true,
            cpf: true,
          },
        },
        operator: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!access) {
      res.status(404).json({ error: "Acesso não encontrado" });
      return;
    }
    res.json(access);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o acesso" });
  }
};

export const createAccess = async (
  req: Request,
  res: Response
): Promise<void> => {
  // #swagger.summary = 'Create new access',
  // #swagger.tags = ['Access']

  try {
    const {
      startTime,
      endTime,
      local,
      reason,
      comments,
      memberId,
      lobbyId,
      visitorId,
      operatorId,
    } = req.body;
    const access = await prisma.access.create({
      data: {
        startTime,
        endTime,
        local,
        reason,
        comments,
        memberId,
        lobbyId,
        visitorId,
        operatorId,
      },
    });
    res.status(201).json(access);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o acesso" });
  }
};

export const updateAccess = async (
  req: Request,
  res: Response
): Promise<void> => {
  // #swagger.summary = 'Update one access',
  // #swagger.tags = ['Access']

  try {
    const id = parseInt(req.params.id, 10);
    const {
      startTime,
      endTime,
      local,
      reason,
      comments,
      status,
      memberId,
      lobbyId,
      visitorId,
      operatorId,
    } = req.body;
    const access = await prisma.access.update({
      where: { accessId: id },
      data: {
        startTime,
        endTime,
        local,
        reason,
        comments,
        status,
        memberId,
        lobbyId,
        visitorId,
        operatorId,
      },
    });
    res.status(200).json(access);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o acesso" });
  }
};

export const deleteAccess = async (
  req: Request,
  res: Response
): Promise<void> => {
  // #swagger.summary = 'Delete one access',
  // #swagger.tags = ['Access']

  try {
    const id = parseInt(req.params.id, 10);
    await prisma.access.delete({
      where: { accessId: id },
    });
    res.json({ message: "Acesso excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o acesso" });
  }
};

export const getAccessByLobby = async (
  req: Request,
  res: Response
): Promise<void> => {
  // #swagger.summary = 'Get Acess By Lobby',
  // #swagger.tags = ['Access']

  try {
    const lobby = parseInt(req.params.lobby, 10);
    const oneMonthAgo = subDays(new Date(), 31);

    const access = await prisma.access.findMany({
      where: {
        lobbyId: lobby,
        startTime: {
          gte: oneMonthAgo,
        },
      },
      include: {
        visitor: {
          select: {
            name: true,
            cpf: true,
            visitorType: {
              select: {
                description: true,
              },
            },
          },
        },
        member: {
          select: {
            name: true,
            cpf: true,
          },
        },
      },
      orderBy: [{ status: "asc" }, { startTime: "desc" }],
    });
    res.json(access);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os acessos" });
  }
};

export const getFilteredAccess = async (
  req: Request,
  res: Response
): Promise<void> => {
  // #swagger.summary = 'Get filtered access',
  // #swagger.tags = ['Access']

  try {
    const lobby = parseInt(req.params.lobby, 10);
    const { query } = req.query;

    const whereCondition = query
      ? {
          OR: [
            { visitor: { name: { contains: query as string } } },
            { member: { name: { contains: query as string } } },
          ],
          AND: { lobbyId: lobby },
        }
      : {};
    const access = await prisma.access.findMany({
      where: whereCondition,
      include: {
        visitor: {
          select: {
            name: true,
            cpf: true,
            visitorType: {
              select: {
                description: true,
              },
            },
          },
        },
        member: {
          select: {
            name: true,
            cpf: true,
          },
        },
      },
      orderBy: [{ status: "asc" }, { startTime: "desc" }],
    });
    if (!access) {
      res.status(404).json({ error: "Nenhum acesso encontrado" });
      return;
    }
    res.json(access);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os acessos" });
  }
};

export const generateReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  // #swagger.summary = 'Generate a report',
  // #swagger.tags = ['Access']

  try {
    const lobby = parseInt(req.params.lobby, 10);
    const { from, to } = req.query;

    if (!from || !to) {
      const resultWithoutDate = await prisma.access.findMany({
        where: {
          lobbyId: lobby,
        },
        include: {
          visitor: {
            select: {
              name: true,
            },
          },
          member: {
            select: {
              name: true,
            },
          },
          operator: {
            select: {
              name: true,
            },
          },
        },
        orderBy: [{ startTime: "asc" }],
      });
      res.json(resultWithoutDate);
      return;
    }

    const fromObj = from ? new Date(from as string) : undefined;
    const toObj = to ? new Date(to as string) : undefined;

    // Certifique-se de que as datas são válidas, se fornecidas
    if (
      (fromObj && isNaN(fromObj.getTime())) ||
      (toObj && isNaN(toObj.getTime()))
    ) {
      res.status(400).json({ error: "As datas fornecidas não são válidas" });
      return;
    }

    const access = await prisma.access.findMany({
      where: {
        lobbyId: lobby,
        ...(fromObj && toObj
          ? {
              startTime: {
                gte: fromObj,
                lte: toObj,
              },
            }
          : {}),
      },
      include: {
        visitor: {
          select: {
            name: true,
          },
        },
        member: {
          select: {
            name: true,
          },
        },
        operator: {
          select: {
            name: true,
          },
        },
        lobby: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [{ startTime: "asc" }],
    });
    res.json(access);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os acessos" });
  }
};
