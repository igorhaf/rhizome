const Tab = require('../models/Tab');

exports.openTab = async (req, res) => {
    try {
        const newTab = new Tab({ name: req.body.name });
        await newTab.save();
        res.status(201).send(newTab);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.closeTab = async (req, res) => {
    try {
        const tab = await Tab.findByIdAndRemove(req.body.id);
        if (!tab) return res.status(404).send('Tab not found.');
        res.send({ message: 'Tab closed' });
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.renameTab = async (req, res) => {
    try {
        const tab = await Tab.findByIdAndUpdate(req.body.id, { name: req.body.newName }, { new: true });
        if (!tab) return res.status(404).send('Tab not found.');
        res.send(tab);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.repositionTab = async (req, res) => {
    try {
        const tab = await Tab.findByIdAndUpdate(req.body.id, { position: req.body.newPosition }, { new: true });
        if (!tab) return res.status(404).send('Tab not found.');
        res.send(tab);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.listTabs = async (req, res) => {
    try {
        const tabs = await Tab.find({});
        res.send(tabs);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getStatus = async (req, res) => {
    try {
        const tabs = await Tab.find({});
        res.send(tabs);
    } catch (error) {
        res.status(500).send(error);
    }
};
