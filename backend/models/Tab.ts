import mongoose, { Document, Schema } from 'mongoose';

interface ITab extends Document {
    name: string;
    position: number;
    status: string;
}

const tabSchema: Schema = new Schema({
    name: { type: String, required: true },
    position: { type: Number, required: true, default: 0 },
    status: { type: String, default: 'open' }
});

export default mongoose.model<ITab>('Tab', tabSchema);
