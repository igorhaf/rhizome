// src/models/Objectif.ts
import mongoose, { Schema, Document, model } from 'mongoose';

interface IConditional {
    variable: string;
    comparison: string;
    value: string;
}

interface IObjectif extends Document {
    objectName: string;
    conditionals: IConditional[];
    complexConditional: string;
    localLog: boolean;
    globalLog: boolean;
    alertEmails: string[];
}

const ObjectifSchema = new Schema<IObjectif>({
    objectName: { type: String, default: '' },
    conditionals: [{
        variable: { type: String, default: '' },
        comparison: { type: String, default: '' },
        value: { type: String, default: '' }
    }],
    complexConditional: { type: String, default: '' },
    localLog: { type: Boolean, default: false },
    globalLog: { type: Boolean, default: false },
    alertEmails: [{ type: String }]
});

const Objectif = model<IObjectif>('Objectif', ObjectifSchema);

export default Objectif;
