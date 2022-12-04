import mongoose, { Schema } from 'mongoose';

export default mongoose.models.Theatre || mongoose.model('Theatre', new mongoose.Schema({ name: String, city: { type: Schema.Types.ObjectId, ref: 'City' } }));