import {
  db_default
} from "./chunk-BXWGZ4DM.mjs";

// src/controllers/vehicle.ts
var getAllVehicles = async (req, res) => {
  try {
    const vehicle = await db_default.vehicle.findMany({
      include: {
        member: true,
        vehicleType: true
      }
    });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os ve\xEDculos" });
  }
};
var getVehicle = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const vehicle = await db_default.vehicle.findUniqueOrThrow({
      where: { vehicleId: id }
    });
    if (!vehicle) {
      res.status(404).json({ error: "Ve\xEDculo n\xE3o encontrado" });
      return;
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o ve\xEDculo" });
  }
};
var createVehicle = async (req, res) => {
  try {
    const {
      licensePlate,
      brand,
      model,
      color,
      tag,
      comments,
      vehicleTypeId,
      memberId,
      lobbyId
    } = req.body;
    const vehicle = await db_default.vehicle.create({
      data: {
        licensePlate,
        brand,
        model,
        color,
        tag,
        comments,
        vehicleTypeId,
        memberId,
        lobbyId
      }
    });
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar o ve\xEDculo" });
  }
};
var updateVehicle = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const {
      licensePlate,
      brand,
      model,
      color,
      tag,
      comments,
      vehicleTypeId,
      memberId
    } = req.body;
    const vehicle = await db_default.vehicle.update({
      where: { vehicleId: id },
      data: {
        licensePlate,
        brand,
        model,
        color,
        tag,
        comments,
        vehicleTypeId,
        memberId
      }
    });
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o ve\xEDculo" });
  }
};
var deleteVehicle = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await db_default.vehicle.delete({
      where: { vehicleId: id }
    });
    res.json({ message: "Ve\xEDculo exclu\xEDdo com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir o ve\xEDculo" });
  }
};
var getVehiclesByOwner = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const vehicle = await db_default.vehicle.findMany({
      where: { memberId: id },
      include: {
        vehicleType: true
      }
    });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os ve\xEDculos" });
  }
};
var getVehicleTypes = async (req, res) => {
  try {
    const vehicleType = await db_default.vehicleType.findMany();
    res.json(vehicleType);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os ve\xEDculos" });
  }
};
var getVehiclesByLobby = async (req, res) => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const vehicle = await db_default.vehicle.findMany({
      where: { lobbyId: lobby },
      include: {
        member: true,
        vehicleType: true,
        lobby: {
          select: {
            name: true
          }
        }
      }
    });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os ve\xEDculos" });
  }
};
var getFilteredVehicles = async (req, res) => {
  try {
    const lobby = parseInt(req.params.lobby, 10);
    const { query } = req.query;
    const whereCondition = query ? {
      OR: [
        { licensePlate: { contains: query } },
        { model: { contains: query } },
        { brand: { contains: query } },
        { member: { name: { contains: query } } }
      ],
      AND: { lobbyId: lobby }
    } : {};
    const vehicle = await db_default.vehicle.findMany({
      where: whereCondition,
      include: {
        member: {
          select: {
            name: true
          }
        },
        vehicleType: true
      },
      orderBy: [{ licensePlate: "asc" }]
    });
    if (!vehicle) {
      res.status(404).json({ error: "Nenhum ve\xEDculo encontrado" });
      return;
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os ve\xEDculos" });
  }
};

export {
  getAllVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehiclesByOwner,
  getVehicleTypes,
  getVehiclesByLobby,
  getFilteredVehicles
};
