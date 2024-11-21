import { Request, Response } from 'express';
import { z } from 'zod';
import { DeviceBrandService } from '../services/device-brand-service';
import { ResourceNotFoundError } from '../services/errors/resource-not-found-error';

const deviceBrandSchema = z.object({
  name: z.string(),
  iconUrl: z.string().url(),
})

const deviceBrandService = new DeviceBrandService()

export async function getAllDeviceBrands(req: Request, res: Response) {
  try {
    const deviceBrands = await deviceBrandService.getAllBrands()
    res.json(deviceBrands)
  } catch (error) {
    res.status(500).json({ message: "Error getting device brands", error })
  }
}

export async function getDeviceBrand(req: Request, res: Response) {
  try {
    const id = z.coerce.number().parse(req.params.id)
    const deviceBrand = await deviceBrandService.getBrandById(id)
    return res.json(deviceBrand)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    return res.status(500).json({ message: "Error getting device brand", error });
  }
}

export async function createDeviceBrand(req: Request, res: Response) {
  try {
    const { name, iconUrl } = deviceBrandSchema.parse(req.body)
    const deviceBrand = await deviceBrandService.createBrand({ name, iconUrl })
    res.status(201).json(deviceBrand)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ message: "Error creating device brand", error })
  }
}

export async function updateDeviceBrand(req: Request, res: Response) {
  try {
    const id = z.coerce.number().parse(req.params.id)
    const { name, iconUrl } = deviceBrandSchema.parse(req.body)
    const deviceBrand = await deviceBrandService.updateBrand(id, { name, iconUrl })
    res.status(200).json(deviceBrand)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    return res.status(500).json({ message: "Error updating device brand", error });
  }
}

export async function deleteDeviceBrand(req: Request, res: Response) {
  try {
    const id = z.coerce.number().parse(req.params.id)
    await deviceBrandService.deleteBrand(id)
    return res.status(204).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    return res.status(500).json({ message: "Error deleting device brand", error });
  }
}