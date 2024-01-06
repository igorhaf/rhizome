const Graph = require('../models/graph');

const GraphController = {
    async createGraph(req, res) {
        try {
            const graph = await Graph.create(req.body);
            return res.status(201).json(graph);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    },
    async getGraph(req, res) {
        try {
            const graph = await Graph.findByPk(req.params.id);
            if (graph) {
                return res.status(200).json(graph);
            }
            return res.status(404).json({ error: 'Graph not found' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    // Adicione métodos adicionais como updateGraph, deleteGraph, etc.
};

module.exports = GraphController;