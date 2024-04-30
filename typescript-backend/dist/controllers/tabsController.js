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
exports.getStatus = exports.listTabs = exports.repositionTab = exports.renameTab = exports.closeTab = exports.openTab = void 0;
const Tab_1 = __importDefault(require("../models/Tab")); // Importar o modelo Tab apropriado
const openTab = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newTab = new Tab_1.default({ name: req.body.name });
        yield newTab.save();
        return res.status(201).json(newTab);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.openTab = openTab;
const closeTab = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tab = yield Tab_1.default.findByIdAndRemove(req.body.id);
        return tab ? res.json({ message: 'Tab closed' }) : res.status(404).json({ message: 'Tab not found' });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.closeTab = closeTab;
const renameTab = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tab = yield Tab_1.default.findByIdAndUpdate(req.body.id, { name: req.body.newName }, { new: true });
        return tab ? res.json(tab) : res.status(404).json({ message: 'Tab not found' });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.renameTab = renameTab;
const repositionTab = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tab = yield Tab_1.default.findByIdAndUpdate(req.body.id, { position: req.body.newPosition }, { new: true });
        return tab ? res.json(tab) : res.status(404).json({ message: 'Tab not found' });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.repositionTab = repositionTab;
const listTabs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tabs = yield Tab_1.default.find({});
        return res.json(tabs);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.listTabs = listTabs;
const getStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tabs = yield Tab_1.default.find({});
        return res.json(tabs);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getStatus = getStatus;
