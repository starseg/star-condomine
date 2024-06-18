import { Request, Response } from "express";
import prisma from "../db";

export const getAllMemberGroups = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const memberGroup = await prisma.memberGroup.findMany({
      orderBy: [{ memberGroupId: "asc" }],
      include: {
        member: {
          select: { name: true },
        },
        group: {
          select: { name: true },
        },
      },
    });
    res.json(memberGroup);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar relações" });
  }
};

export const getMemberGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const memberGroup = await prisma.memberGroup.findUniqueOrThrow({
      where: { memberGroupId: id },
      include: {
        member: {
          select: { name: true },
        },
        group: {
          select: { name: true },
        },
      },
    });
    if (!memberGroup) {
      res.status(404).json({ error: "relação não encontrada" });
      return;
    }
    res.json(memberGroup);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar relação" });
  }
};

export const createMemberGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { memberId, groupId } = req.body;
    const membergroup = await prisma.memberGroup.create({
      data: { memberId, groupId },
    });
    res.status(201).json(membergroup);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar relação" });
  }
};

export const updateMemberGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { memberId, groupId } = req.body;
    const membergroup = await prisma.memberGroup.update({
      where: { memberGroupId: id },
      data: { memberId, groupId },
    });
    res.status(200).json(membergroup);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar relação" });
  }
};

export const deleteMemberGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.memberGroup.delete({
      where: { memberGroupId: id },
    });
    res.json({ message: "relação excluída com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir relação" });
  }
};
