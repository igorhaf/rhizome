// src/models/Graph.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IGraph {
    name: string;
    data: any[];
}

// Adicionando os campos necessários para os métodos findOne e create
export interface IGraphModel extends IGraph, Document {
    createdAt?: Date; // Adicione outros campos padrão do Mongoose aqui, se necessário
}

const GraphSchema: Schema = new Schema({
    name: { type: String, required: true },
    data: { type: Array, required: true }
}, {
    timestamps: true // Isso adicionará os campos createdAt e updatedAt automaticamente
});

export const Graph = mongoose.model<IGraphModel>('Graph', GraphSchema);
