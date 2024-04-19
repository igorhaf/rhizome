const Objectif = require('../models/Objectif');

exports.createObjectif = async (req, res) => {
    try {
        const newObj = new Objectif(req.body);
        await newObj.save();
        res.status(201).send(newObj);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.updateObjectif = async (req, res) => {
    try {
        const obj = await Objectif.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!obj) {
            return res.status(404).send();
        }
        res.send(obj);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getObjectif = async (req, res) => {
    try {
        const obj = await Objectif.findById(req.params.id);
        if (!obj) {
            return res.status(404).send();
        }
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.deleteObjectif = async (req, res) => {
    try {
        const obj = await Objectif.findByIdAndDelete(req.params.id);
        if (!obj) {
            return res.status(404).send();
        }
        res.send(obj);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.listObjectifs = async (req, res) => {
    try {
        const objs = await Objectif.find({});
        res.send(objs);
    } catch (error) {
        res.status(500).send(error);
    }
};
