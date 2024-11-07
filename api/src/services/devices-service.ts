import { Prisma, Status } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import prisma from "../db";

export class DevicesService {

  async getDevices() {
    const devices = await prisma.device.findMany({
      include: {
        lobby: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!devices) {
      throw new ResourceNotFoundError();
    }

    return devices;
  }

  async getDeviceById(id: number) {
    const device = await prisma.device.findUnique({
      where: { deviceId: id },
    });

    if (!device) {
      throw new ResourceNotFoundError();
    }

    return device;
  }

  async createDevice(device: Prisma.DeviceUncheckedCreateInput) {
    const newDevice = await prisma.device.create({
      data: device,
    });

    return newDevice;
  }

  async updateDevice(id: number, data: Prisma.DeviceUpdateInput) {
    try {
      const updatedDevice = await prisma.device.update({
        where: { deviceId: id },
        data,
      });

      return updatedDevice;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ResourceNotFoundError();
      }

      throw error;
    }
  }

  async deleteDevice(id: number) {
    try {
      await prisma.device.delete({
        where: { deviceId: id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ResourceNotFoundError();
      }

      throw error
    }
  }

  async getDeviceByLobby(lobbyId: number) {
    const devices = await prisma.device.findMany({
      where: {
        lobbyId,
      },
      include: {
        deviceModel: true,
        lobby: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!devices) {
      throw new ResourceNotFoundError();
    }

    return devices;
  }

  async getFilteredDevices(lobbyId: number, query?: string, status?: Status) {

    try {
      const whereCondition = query || status
        ? {
          OR: [
            { name: { contains: query } },
            { ip: { contains: query } },
            { description: { contains: query } },
            { deviceModel: { model: { contains: query } } },
          ],
          AND: { lobbyId: lobbyId, status: status },
        } : {};


      const devices = await prisma.device.findMany({
        where: whereCondition,
        include: {
          deviceModel: true,
          lobby: {
            select: {
              name: true,
            }
          }
        },
        orderBy: [{ name: "asc" }],
      });

      if (!devices) {
        throw new ResourceNotFoundError();
      }

      return devices;
    } catch (error) {
      console.log(error);
    }
  }
}