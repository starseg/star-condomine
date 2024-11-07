import { Request, Response } from 'express';
import { z } from 'zod';
import { DeviceModelService } from '../services/device-model-service';
import { ResourceNotFoundError } from '../services/errors/resource-not-found-error';

const deviceModelSchema = z.object({
  model: z.string(),
  brand: z.string(),
  description: z.string(),
  isFacial: z.enum(["true", "false"]),
})

const deviceModelService = new DeviceModelService();

export async function createDeviceModel(req: Request, res: Response) {
  try {
    const { model, brand, description, isFacial } = deviceModelSchema.parse(req.body);
    const deviceModel = await deviceModelService.createDeviceModel({ model, brand, description, isFacial });

    return res.status(201).json(deviceModel);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    return res.status(500).json({ error: 'Error creating device model' });
  }
}

export async function updateDeviceModel(req: Request, res: Response) {
  try {
    const id = z.coerce.number().parse(req.params.id);
    const { model, brand, description, isFacial } = deviceModelSchema.partial().parse(req.body);
    const updatedDeviceModel = await deviceModelService.updateDeviceModel(id, { model, brand, description, isFacial });
    return res.json(updatedDeviceModel);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Error updating device model' });
  }
}

export async function deleteDeviceModel(req: Request, res: Response) {
  try {
    const id = z.coerce.number().parse(req.params.id);
    const deviceModel = await deviceModelService.deleteDeviceModel(id);
    return res.json(deviceModel);
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    return res.status(500).json({ error: 'Error deleting device model' });
  }
}

export async function getDeviceModels(req: Request, res: Response) {
  try {
    const deviceModels = await deviceModelService.getDeviceModels();
    return res.json(deviceModels);
  } catch (error) {

    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    return res.status(500).json({ error: 'Error fetching device models' });
  }
}

export async function getDeviceModel(req: Request, res: Response) {
  try {
    const id = z.coerce.number().parse(req.params.id);
    const deviceModel = await deviceModelService.getDeviceModel(id);
    return res.json(deviceModel);
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    return res.status(500).json({ error: 'Error fetching device model' });
  }
}