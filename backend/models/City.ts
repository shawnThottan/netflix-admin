import mongoose from 'mongoose';

export default mongoose.models.City || mongoose.model('City', new mongoose.Schema({ name: String }));