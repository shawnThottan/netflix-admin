import mongoose from 'mongoose';

export default mongoose.models.Language || mongoose.model('Language', new mongoose.Schema({ name: String }));