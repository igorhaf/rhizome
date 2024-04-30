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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGraph = exports.getGraph = void 0;
const Graph_1 = require("../models/Graph"); // Importar o modelo Graph apropriado
const getGraph = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lastGraph = yield Graph_1.Graph.findOne().sort({ createdAt: -1 });
        return res.status(200).json(lastGraph || { error: 'Graph not found' });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getGraph = getGraph;
const createGraph = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const graph = yield Graph_1.Graph.create(req.body);
        return res.status(201).json(graph);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
exports.createGraph = createGraph;
