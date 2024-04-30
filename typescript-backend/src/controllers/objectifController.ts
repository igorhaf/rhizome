// src/controllers/objectifController.ts
import { Request, Response } from 'express';
import Objectif from '../models/Objectif'; // Importar o modelo Objectif apropriado

export const createObjectif = async (req: Request, res: Response): Promise<Response> => {
    try {
        const newObj = new Objectif(req.body);
        await newObj.save();
        return res.status(201).json(newObj);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(400).json({ error: 'Unknown error' });
    }
};

export const updateObjectif = async (req: Request, res: Response): Promise<Response> => {
    try {
        const obj = await Objectif.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return obj ? res.json(obj) : res.status(404).json();
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(400).json({ error: 'Unknown error' });
    }
};

export const getObjectif = async (req: Request, res: Response): Promise<Response> => {
    try {
        const obj = await Objectif.findById(req.params.id);
        return obj ? res.json(obj) : res.status(404).json();
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Unknown error' });
    }
};

export const deleteObjectif = async (req: Request, res: Response): Promise<Response> => {
    try {
        const obj = await Objectif.findByIdAndDelete(req.params.id);
        return obj ? res.json(obj) : res.status(404).json();
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Unknown error' });
    }
};

export const listObjectifs = async (req: Request, res: Response): Promise<Response> => {
    try {
        const objs = await Objectif.find({});
        return res.json(objs);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Unknown error' });
    }
};
