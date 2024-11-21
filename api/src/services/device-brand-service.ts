import { Prisma } from "@prisma/client"
import prisma from "../db"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"

export class DeviceBrandService {
  async getAllBrands() {
    const brands = await prisma.controllerBrand.findMany()
    return brands
  }

  async getBrandById(id: number) {
    const brand = await prisma.controllerBrand.findUnique({
      where: { controllerBrandId: id },
    })

    if (!brand) {
      throw new ResourceNotFoundError()
    }

    return brand
  }

  async createBrand(brandData: Prisma.ControllerBrandUncheckedCreateInput) {
    const brand = await prisma.controllerBrand.create({
      data: brandData,
    })

    return brand
  }

  async updateBrand(id: number, brandData: Prisma.ControllerBrandUncheckedUpdateInput) {
    try {
      const brand = await prisma.controllerBrand.update({
        where: { controllerBrandId: id },
        data: brandData,
      })

      return brand
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ResourceNotFoundError()
      }

      throw error
    }
  }

  async deleteBrand(id: number) {
    try {
      const brand = await prisma.controllerBrand.delete({
        where: { controllerBrandId: id },
      })

      return brand
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new ResourceNotFoundError()
      }

      throw error
    }
  }
}