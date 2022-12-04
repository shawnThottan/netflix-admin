import mongoose, { Schema } from 'mongoose';

export default mongoose.models.Movie || mongoose.model('Movie', new mongoose.Schema({
    name: String,
    language: { type: Schema.Types.ObjectId, ref: 'Language' },
    cast: [String],
    genre: String,
    theatres: [{ type: Schema.Types.ObjectId, ref: 'Theatre' }]
}));