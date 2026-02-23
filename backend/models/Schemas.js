const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' },
    skillLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    avatar: { type: String },
    joinedCircles: [{ type: String }],
    joinedAt: { type: Date, default: Date.now }
});

const SkillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String },
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    difficulty: { type: Number, min: 1, max: 10 },
    content: { type: String }
});

const ProgressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
    masteryPercentage: { type: Number, default: 0 },
    status: { type: String, enum: ['locked', 'in-progress', 'completed'], default: 'locked' },
    lastAccessed: { type: Date, default: Date.now }
});

const QuizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    relatedSkill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
    questions: [{
        questionText: String,
        options: [String],
        correctOption: Number,
        difficulty: Number
    }],
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'] }
});

const QuizAttemptSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
    score: { type: Number },
    timeSpent: { type: Number }, // in seconds
    feedback: { type: String },
    attemptedAt: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
    user: { type: String, required: true },
    role: { type: String },
    avatar: { type: String },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    topic: { type: String },
    color: { type: String },
    aiReply: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

const CircleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    members: { type: Number, default: 0 },
    icon: { type: String },
    description: { type: String },
    suggested: { type: Boolean, default: false }
});

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String },
    category: { type: String },
    rating: { type: Number, default: 0 },
    pages: { type: Number },
    description: { type: String },
    image: { type: String },
    content: { type: String }
});

module.exports = {
    User: mongoose.model('User', UserSchema),
    Skill: mongoose.model('Skill', SkillSchema),
    Progress: mongoose.model('Progress', ProgressSchema),
    Quiz: mongoose.model('Quiz', QuizSchema),
    QuizAttempt: mongoose.model('QuizAttempt', QuizAttemptSchema),
    Post: mongoose.model('Post', PostSchema),
    Circle: mongoose.model('Circle', CircleSchema),
    Book: mongoose.model('Book', BookSchema)
};
