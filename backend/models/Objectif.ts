import mongoose, { Document, Schema } from 'mongoose';

interface IConditionals {
    variable: string;
    comparison: string;
    value: string;
}

interface IObjectif extends Document {
    objectName: string;
    conditionals: IConditionals[];
    complexConditional: string;
    localLog: boolean;
    globalLog: boolean;
    alertEmails: string[];
}

const ObjectifSchema: Schema = new Schema({
    objectName: String,
    conditionals: [{
        variable: String,
        comparison: String,
        value: String
    }],
    complexConditional: String,
    localLog: Boolean,
    globalLog: Boolean,
    alertEmails: [String]
});

export default mongoose.model<IObjectif>('Objectif', ObjectifSchema);
