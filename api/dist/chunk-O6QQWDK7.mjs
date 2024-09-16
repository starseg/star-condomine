import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/schedulingList.ts
var getAllSchedulingLists = async (req, res) => {
  try {
    const schedulingList = await db_default.schedulingList.findMany({
      include: {
        lobby: {
          select: {
            name: true
          }
        },
        member: {
          select: {
            name: true
          }
        },
        operator: {
          select: {
            name: true
          }
        }
      },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }]
    });
    res.json(schedulingList);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os agendamentos" });
  }
};
var getSchedulingList = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const schedulingList = await db_default.schedulingList.findUniqueOrThrow({
      where: { schedulingListId: id },
      include: {
        member: {
          select: {
            name: true
          }
        },
        operator: {
          select: {
            name: true
          }
        },
        lobby: {
          select: {
            name: true
          }
        }
      }
    });
    if (!schedulingList) {
      res.status(404).json({ error: "Lista n\xE3o encontrada" });
      return;
    }
    res.json(schedulingList);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar a lista" });
  }
};
var createSchedulingList = async (req, res) => {
  try {
    const { description, url, lobbyId, memberId, operatorId } = req.body;
    const schedulingList = await db_default.schedulingList.create({
      data: {
        description,
        url,
        lobbyId,
        memberId,
        operatorId
      }
    });
    res.status(201).json(schedulingList);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar a lista" });
  }
};
var updateSchedulingList = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { description, url, status, lobbyId, memberId, operatorId } = req.body;
    const schedulingList = await db_default.schedulingList.update({
      where: { schedulingListId: id },
      data: {
        description,
        url,
        status,
        lobbyId,
        memberId,
        operatorId
      }
    });
    res.status(200).json(schedulingList);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar a lista" });
  }
};
var deleteSchedulingList = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.schedulingList.delete({
      where: { schedulingListId: id }
    });
    res.json({ message: "Lista exclu\xEDda com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir a lista" });
  }
};
var getFilteredSchedulingLists = async (req, res) => {
  try {
    const { query } = req.query;
    const whereCondition = query ? {
      OR: [
        { description: { contains: query } },
        { operator: { name: { contains: query } } },
        { member: { name: { contains: query } } },
        { lobby: { name: { contains: query } } }
      ]
    } : {};
    const schedulingList = await db_default.schedulingList.findMany({
      where: whereCondition,
      include: {
        operator: {
          select: {
            name: true
          }
        },
        member: {
          select: {
            name: true
          }
        },
        lobby: {
          select: {
            name: true
          }
        }
      },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }]
    });
    if (!schedulingList) {
      res.status(404).json({ error: "Nenhum acesso encontrado" });
      return;
    }
    res.json(schedulingList);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os acessos" });
  }
};

export {
  getAllSchedulingLists,
  getSchedulingList,
  createSchedulingList,
  updateSchedulingList,
  deleteSchedulingList,
  getFilteredSchedulingLists
};
