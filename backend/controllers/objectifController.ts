import { Request, Response } from 'express';
import Objectif from '../models/Objectif';

export const createObjectif = async (req: Request, res: Response): Promise<Response> => {
    try {
        const newObj = new Objectif(req.body);
        await newObj.save();
        return res.status(201).send(newObj);
    } catch (error) {
        return res.status(400).send(error);
    }
};

export const updateObjectif = async (req: Request, res: Response): Promise<Response> => {
    try {
        const obj = await Objectif.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!obj) {
            return res.status(404).send();
        }
        return res.send(obj);
    } catch (error) {
        return res.status(400).send(error);
    }
};

export const getObjectif = async (req: Request, res: Response): Promise<Response> => {
    try {
        const obj = await Objectif.findById(req.params.id);
        if (!obj) {
            return res.status(404).send();
        }
        return res.send(obj);
    } catch (error) {
        return res.status(500).send(error);
    }
};

export const deleteObjectif = async (req: Request, res: Response): Promise<Response> => {
    try {
        const obj = await Objectif.findByIdAndDelete(req.params.id);
        if (!obj) {
            return res.status(404).send();
        }
        return res.send(obj);
    } catch (error) {
        return res.status(500).send(error);
    }
};

export const listObjectifs = async (req: Request, res: Response): Promise<Response> => {
    try {
        const objs = await Objectif.find({});
        return res.send(objs);
    } catch (error) {
        return res.status(500).send(error);
    }
};
