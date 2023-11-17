import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllMembers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const member = await prisma.member.findMany();
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os membros" });
  }
};

export const getMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const member = await prisma.member.findUniqueOrThrow({
      where: { memberId: id },
    });
    if (!member) {
      res.status(404).json({ error: "Membro não encontrado" });
      return;
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o membro" });
  }
};

export const createMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      type,
      profileUrl,
      name,
      rg,
      cpf,
      email,
      comments,
      faceAccess,
      biometricAccess,
      remoteControlAccess,
      passwordAccess,
      address,
      addressTypeId,
      accessPeriod,
      position,
      lobbyId,
    } = req.body;
    const member = await prisma.member.create({
      data: {
        type,
        profileUrl,
        name,
        rg,
        cpf,
        email,
        comments,
        faceAccess,
        biometricAccess,
        remoteControlAccess,
        passwordAccess,
        address,
        addressTypeId,
        accessPeriod,
        position,
        lobbyId,
      },
    });
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o membro" });
  }
};

export const updateMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const {
      type,
      profileUrl,
      name,
      rg,
      cpf,
      email,
      comments,
      status,
      faceAccess,
      biometricAccess,
      remoteControlAccess,
      passwordAccess,
      address,
      addressTypeId,
      accessPeriod,
      position,
      lobbyId,
    } = req.body;
    const member = await prisma.member.update({
      where: { memberId: id },
      data: {
        type,
        profileUrl,
        name,
        rg,
        cpf,
        email,
        comments,
        status,
        faceAccess,
        biometricAccess,
        remoteControlAccess,
        passwordAccess,
        address,
        addressTypeId,
        accessPeriod,
        position,
        lobbyId,
      },
    });
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o membro" });
  }
};

export const deleteMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.member.delete({
      where: { memberId: id },
    });
    res.json({ message: "Membro excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o membro" });
  }
};
