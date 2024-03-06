import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
