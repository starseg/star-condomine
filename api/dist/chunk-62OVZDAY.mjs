import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/guest.ts
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
var createTelephone = async (req, res) => {
  try {
    const { number, memberId } = req.body;
    const telephone = await db_default.telephone.create({
      data: { number, memberId }
    });
    res.status(201).json(telephone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o telefone" });
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
var createVisitor = async (req, res) => {
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
      status,
      visitorTypeId,
      lobbyId
    } = req.body;
    const visitor = await db_default.visitor.create({
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
        lobbyId
      }
    });
    res.status(201).json(visitor);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o visitante" });
  }
};
var getVisitorTypes = async (req, res) => {
  try {
    const types = await db_default.visitorType.findMany();
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os tipos" });
  }
};
var getLobby = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const lobby = await db_default.lobby.findUniqueOrThrow({
      where: { lobbyId: id },
      select: {
        code: true
      }
    });
    if (!lobby.code) {
      res.status(404).json({ error: "Portaria n\xE3o encontrada" });
      return;
    }
    const key1 = Number(process.env.LOBBY_CODE_KEY_1);
    const key2 = Number(process.env.LOBBY_CODE_KEY_2);
    const result = lobby.code * key1 - key2;
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar a portaria" });
  }
};

export {
  createMember,
  createTelephone,
  getAddressTypes,
  createVisitor,
  getVisitorTypes,
  getLobby
};
