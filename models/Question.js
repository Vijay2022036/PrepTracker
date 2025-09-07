import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    link: { type: String },
    completed: { type: Boolean, default: false },
    forReview: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);