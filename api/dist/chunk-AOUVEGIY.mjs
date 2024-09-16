import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/telephone.ts
var getAllTelephones = async (req, res) => {
  try {
    const telephone = await db_default.telephone.findMany();
    res.json(telephone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os telefones" });
  }
};
var getTelephone = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const telephone = await db_default.telephone.findUniqueOrThrow({
      where: { telephoneId: id }
    });
    if (!telephone) {
      res.status(404).json({ error: "Telefone n\xE3o encontrado" });
      return;
    }
    res.json(telephone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o telefone" });
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
var deleteTelephone = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.telephone.delete({
      where: { telephoneId: id }
    });
    res.json({ message: "Telefone exclu\xEDdo com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o telefone" });
  }
};
var getTelephonesByMember = async (req, res) => {
  try {
    const telephone = await db_default.telephone.findMany({
      where: {
        memberId: parseInt(req.params.id, 10)
      }
    });
    res.json(telephone);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os telefones" });
  }
};
var deletePhonesByMember = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.telephone.deleteMany({
      where: { memberId: id }
    });
    res.json({ message: "Telefones exclu\xEDdos com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir os telefones" });
  }
};

export {
  getAllTelephones,
  getTelephone,
  createTelephone,
  deleteTelephone,
  getTelephonesByMember,
  deletePhonesByMember
};
