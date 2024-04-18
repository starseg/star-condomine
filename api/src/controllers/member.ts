import { Request, Response } from "express";
import prisma from "../db";

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

export const getMembersByLobby = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const member = await prisma.member.findMany({
      where: { lobbyId: lobby },
      include: {
        addressType: true,
        telephone: true,
      },
      orderBy: [{ name: "asc" }],
    });
    if (!member) {
      res.status(404).json({ error: "Nenhum membro não encontrado" });
      return;
    }
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
      include: {
        addressType: true,
        telephone: true,
      },
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

export const getAddressTypes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const address = await prisma.addressType.findMany();
    res.json(address);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os tipos de endereço" });
  }
};

export const getFilteredMembers = async (
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
            { address: { contains: query as string } },
          ],
          AND: { lobbyId: lobby },
        }
      : {};
    const member = await prisma.member.findMany({
      where: whereCondition,
      include: {
        addressType: true,
        telephone: true,
      },
    });
    if (!member) {
      res.status(404).json({ error: "Nenhum membro encontrado" });
      return;
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os membros" });
  }
};

export const countMembers = async (
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
            { address: { contains: query as string } },
          ],
          AND: { lobbyId: lobby },
        }
      : {};
    const member = await prisma.member.count({
      where: whereCondition,
    });

    res.json(member);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os membros" });
  }
};

export const getTagsByMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const member = await prisma.member.findUniqueOrThrow({
      where: { memberId: id },
      include: {
        tag: true,
      },
    });
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as tags" });
  }
};
