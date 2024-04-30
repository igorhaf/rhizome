import mongoose, { Schema, Document, model } from 'mongoose';

interface ITab extends Document {
    name: string;
    position: number;
    status: string;
}

const tabSchema = new Schema<ITab>({
    name: { type: String, required: true },
    position: { type: Number, required: true, default: 0 },
    status: { type: String, default: 'open' }
});

const Tab = model<ITab>('Tab', tabSchema);

export default Tab;
