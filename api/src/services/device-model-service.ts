import { Prisma } from '@prisma/client';
import prisma from '../db'
import { ResourceNotFoundError } from './errors/resource-not-found-error';

export class DeviceModelService {
  async getDeviceModels() {
    const device = await prisma.deviceModel.findMany();
    return device;
  }

  async getDeviceModel(id: number) {
    const device = await prisma.deviceModel.findUniqueOrThrow({
      where: { deviceModelId: id },
    });

    if (!device) {
      throw new ResourceNotFoundError();
    }

    return device;
  }

  async createDeviceModel(deviceModel: Prisma.DeviceModelUncheckedCreateInput) {
    const device = await prisma.deviceModel.create({
      data: deviceModel,
    });

    return device;
  }

  async updateDeviceModel(id: number, data: Prisma.DeviceModelUpdateInput) {
    try {
      const device = await prisma.deviceModel.update({
        where: { deviceModelId: id },
        data,
      });

      return device;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ResourceNotFoundError();
      }

      throw error;
    }
  }

  async deleteDeviceModel(id: number) {
    try {
      const deviceModel = await prisma.deviceModel.delete({
        where: { deviceModelId: id },
      });

      return deviceModel;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ResourceNotFoundError();
      }

      throw error;
    }
  }
}