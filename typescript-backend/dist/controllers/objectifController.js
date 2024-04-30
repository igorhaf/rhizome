"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listObjectifs = exports.deleteObjectif = exports.getObjectif = exports.updateObjectif = exports.createObjectif = void 0;
const Objectif_1 = __importDefault(require("../models/Objectif")); // Importar o modelo Objectif apropriado
const createObjectif = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newObj = new Objectif_1.default(req.body);
        yield newObj.save();
        return res.status(201).json(newObj);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
exports.createObjectif = createObjectif;
const updateObjectif = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const obj = yield Objectif_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return obj ? res.json(obj) : res.status(404).json();
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
exports.updateObjectif = updateObjectif;
const getObjectif = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const obj = yield Objectif_1.default.findById(req.params.id);
        return obj ? res.json(obj) : res.status(404).json();
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getObjectif = getObjectif;
const deleteObjectif = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const obj = yield Objectif_1.default.findByIdAndDelete(req.params.id);
        return obj ? res.json(obj) : res.status(404).json();
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.deleteObjectif = deleteObjectif;
const listObjectifs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const objs = yield Objectif_1.default.find({});
        return res.json(objs);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.listObjectifs = listObjectifs;
