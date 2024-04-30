// src/controllers/graphController.ts
import { Request, Response } from 'express';
import { Graph } from '../models/Graph'; // Importar o modelo Graph apropriado

export const getGraph = async (req: Request, res: Response): Promise<Response> => {
    try {
        const lastGraph = await Graph.findOne().sort({ createdAt: -1 });
        return res.status(200).json(lastGraph || { error: 'Graph not found' });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Unknown error' });
    }
};

export const createGraph = async (req: Request, res: Response): Promise<Response> => {
    try {
        const graph = await Graph.create(req.body);
        return res.status(201).json(graph);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(400).json({ error: 'Unknown error' });
    }
};
