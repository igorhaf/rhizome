import { Request, Response } from 'express';
import Graph from '../models/graph';

export const getGraph = async (req: Request, res: Response): Promise<Response> => {
    try {
        const lastGraph = await Graph.findOne({ order: [['createdAt', 'DESC']] });
        if (lastGraph) {
            return res.status(200).json(lastGraph);
        }
        return res.status(200).json({ error: 'Graph not found' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const createGraph = async (req: Request, res: Response): Promise<Response> => {
    try {
        const graph = await Graph.create(req.body);
        return res.status(201).json(graph);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
