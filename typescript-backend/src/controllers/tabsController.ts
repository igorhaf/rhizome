// src/controllers/tabsController.ts
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import  Tab  from '../models/Tab'; // Importar o modelo Tab apropriado

export const openTab = async (req: Request, res: Response): Promise<Response> => {
    try {
        const newTab = new Tab({ name: req.body.name });
        await newTab.save();
        return res.status(201).json(newTab);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Unknown error' });
    }
};

export const closeTab = async (req: Request, res: Response): Promise<Response> => {
    if (!mongoose.isValidObjectId(req.body.id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }
    try {
        const tab = await Tab.findById(req.body.id); // Encontra o documento pelo ID
        if (!tab) {
            return res.status(404).json({ message: 'Tab not found' });
        }
        await tab.deleteOne(); // Remove o documento encontrado
        return res.json({ message: 'Tab closed' });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Unknown error' });
    }
};

export const renameTab = async (req: Request, res: Response): Promise<Response> => {
    try {
        const tab = await Tab.findByIdAndUpdate(req.body.id, { name: req.body.newName }, { new: true });
        return tab ? res.json(tab) : res.status(404).json({ message: 'Tab not found' });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Unknown error' });
    }
};

export const repositionTab = async (req: Request, res: Response): Promise<Response> => {
    try {
        const tab = await Tab.findByIdAndUpdate(req.body.id, { position: req.body.newPosition }, { new: true });
        return tab ? res.json(tab) : res.status(404).json({ message: 'Tab not found' });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Unknown error' });
    }
};

export const listTabs = async (req: Request, res: Response): Promise<Response> => {
    try {
        const tabs = await Tab.find({});
        return res.json(tabs);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Unknown error' });
    }
};

export const getStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
        const tabs = await Tab.find({});
        return res.json(tabs);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Unknown error' });
    }
};
