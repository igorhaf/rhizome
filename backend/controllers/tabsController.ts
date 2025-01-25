import { Request, Response } from 'express';
import Tab from '../models/Tab';

export const openTab = async (req: Request, res: Response): Promise<Response> => {
    try {
        const newTab = new Tab({ name: req.body.name });
        await newTab.save();
        return res.status(201).send(newTab);
    } catch (error) {
        return res.status(500).send(error);
    }
};

export const closeTab = async (req: Request, res: Response): Promise<Response> => {
    try {
        const tab = await Tab.findByIdAndRemove(req.body.id);
        if (!tab) return res.status(404).send('Tab not found.');
        return res.send({ message: 'Tab closed' });
    } catch (error) {
        return res.status(500).send(error);
    }
};

export const renameTab = async (req: Request, res: Response): Promise<Response> => {
    try {
        const tab = await Tab.findByIdAndUpdate(req.body.id, { name: req.body.newName }, { new: true });
        if (!tab) return res.status(404).send('Tab not found.');
        return res.send(tab);
    } catch (error) {
        return res.status(500).send(error);
    }
};

export const repositionTab = async (req: Request, res: Response): Promise<Response> => {
    try {
        const tab = await Tab.findByIdAndUpdate(req.body.id, { position: req.body.newPosition }, { new: true });
        if (!tab) return res.status(404).send('Tab not found.');
        return res.send(tab);
    } catch (error) {
        return res.status(500).send(error);
    }
};

export const listTabs = async (req: Request, res: Response): Promise<Response> => {
    try {
        const tabs = await Tab.find({});
        return res.send(tabs);
    } catch (error) {
        return res.status(500).send(error);
    }
};

export const getStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
        const tabs = await Tab.find({});
        return res.send(tabs);
    } catch (error) {
        return res.status(500).send(error);
    }
};
