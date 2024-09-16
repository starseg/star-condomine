import {
  isValidURL
} from "./chunk-3K56DYEE.mjs";
import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/member.ts
var getAllMembers = async (req, res) => {
  try {
    const member = await db_default.member.findMany();
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os membros" });
  }
};
var getMembersByLobby = async (req, res) => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const member = await db_default.member.findMany({
      where: { lobbyId: lobby },
      include: {
        addressType: true,
        telephone: true,
        MemberGroup: {
          select: {
            groupId: true,
            group: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: [{ status: "asc" }, { name: "asc" }]
    });
    if (!member) {
      res.status(404).json({ error: "Nenhum membro n\xE3o encontrado" });
      return;
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os membros" });
  }
};
var getMember = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const member = await db_default.member.findUniqueOrThrow({
      where: { memberId: id },
      include: {
        addressType: true,
        telephone: true,
        access: {
          include: { visitor: { select: { name: true } } }
        },
        scheduling: {
          include: { visitor: { select: { name: true } } }
        },
        MemberGroup: {
          select: {
            groupId: true,
            group: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });
    if (!member) {
      res.status(404).json({ error: "Membro n\xE3o encontrado" });
      return;
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o membro" });
  }
};
var getMemberPhoto = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const member = await db_default.member.findUniqueOrThrow({
      where: { memberId: id },
      select: { profileUrl: true }
    });
    if (!member) {
      res.status(404).json({ error: "Membro n\xE3o encontrado" });
      return;
    }
    const url = member.profileUrl;
    if (url && isValidURL(url)) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Falha ao buscar a imagem");
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString("base64");
        res.json({ base64 });
      } catch (error) {
        res.status(500).json({ error: "Erro ao converter imagem" });
      }
    } else {
      res.status(400).json({ error: "URL inv\xE1lida ou n\xE3o encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o membro" });
  }
};
var createMember = async (req, res) => {
  try {
    const {
      type,
      profileUrl,
      documentUrl,
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
      lobbyId
    } = req.body;
    const member = await db_default.member.create({
      data: {
        type,
        profileUrl,
        documentUrl,
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
        lobbyId
      }
    });
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o membro" });
  }
};
var updateMember = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const {
      type,
      profileUrl,
      documentUrl,
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
      lobbyId
    } = req.body;
    const member = await db_default.member.update({
      where: { memberId: id },
      data: {
        type,
        profileUrl,
        documentUrl,
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
        lobbyId
      }
    });
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o membro" });
  }
};
var deleteMember = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.member.delete({
      where: { memberId: id }
    });
    res.json({ message: "Membro exclu\xEDdo com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o membro" });
  }
};
var getAddressTypes = async (req, res) => {
  try {
    const address = await db_default.addressType.findMany();
    res.json(address);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os tipos de endere\xE7o" });
  }
};
var getFilteredMembers = async (req, res) => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const { query } = req.query;
    const whereCondition = query ? {
      OR: [
        { cpf: { contains: query } },
        { rg: { contains: query } },
        { name: { contains: query } },
        { address: { contains: query } }
      ],
      AND: { lobbyId: lobby }
    } : {};
    const member = await db_default.member.findMany({
      where: whereCondition,
      include: {
        addressType: true,
        telephone: true
      }
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
var countMembers = async (req, res) => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const { query } = req.query;
    const whereCondition = query ? {
      OR: [
        { cpf: { contains: query } },
        { name: { contains: query } },
        { address: { contains: query } }
      ],
      AND: { lobbyId: lobby }
    } : {};
    const member = await db_default.member.count({
      where: whereCondition
    });
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os membros" });
  }
};
var getTagsByMember = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const member = await db_default.member.findUniqueOrThrow({
      where: { memberId: id },
      include: {
        tag: true
      }
    });
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as tags" });
  }
};

export {
  getAllMembers,
  getMembersByLobby,
  getMember,
  getMemberPhoto,
  createMember,
  updateMember,
  deleteMember,
  getAddressTypes,
  getFilteredMembers,
  countMembers,
  getTagsByMember
};
