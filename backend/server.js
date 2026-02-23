const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Google Gemini AI Integration
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;

const { User, Skill, Progress, Quiz, QuizAttempt, Post, Circle } = require('./models/Schemas');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alme_db';

const { seedData } = require('./seed');

const connectDB = async () => {
    try {
        console.log(`📡 Attempting to connect to: ${MONGODB_URI}`);
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ Connected to Persistent MongoDB (ALME Database)');
        await seedIfEmpty();
    } catch (err) {
        console.error('❌ Persistent MongoDB Connection Failed:', err.message);
        console.log('🔄 falling back — Starting Embedded MongoDB (Memory Server)...');
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const fs = require('fs');
            const path = require('path');

            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            await mongoose.connect(uri);

            console.log('✅ Embedded MongoDB Connected (Warning: Data will be lost on restart)');
            console.log('📡 Compass Connection String for Temp DB:', uri);

            // Save URI for user access
            fs.writeFileSync(path.join(__dirname, '../MONGO_URI.txt'), uri);
            fs.writeFileSync(path.join(__dirname, '../launch_compass.bat'), `@echo off\necho Connecting to: ${uri}\nstart "" "${uri}"\npause`);

            console.log('📄 Connection details saved to MONGO_URI.txt and launch_compass.bat');

            // Auto-seed for memory server
            await seedData(true);
        } catch (error) {
            console.error('❌ Failed to start Embedded MongoDB:', error.message);
            process.exit(1);
        }
    }
};

const seedIfEmpty = async () => {
    const quizCount = await Quiz.countDocuments();
    const bookCount = await Book.countDocuments();
    const circleCount = await Circle.countDocuments();
    const postCount = await Post.countDocuments();

    if (quizCount === 0 || bookCount === 0 || circleCount === 0 || postCount === 0) {
        console.log('🌱 Database missing some data, auto-seeding...');
        await seedData(true);
    }
};

// --- AI REPLY GENERATOR ---
const generateAIReply = async (postContent) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
            console.log('⚠️ No Gemini API key found, using fallback reply');
            return getFallbackReply(postContent);
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `You are ALME AI, an intelligent academic assistant on a learning platform. A student/researcher posted the following on the network:

"${postContent}"

Provide a helpful, concise, and educational response (max 3-4 sentences). If it's a question, answer it clearly. If it's a topic/keyword, give a brief informative explanation. Be friendly and encouraging. Do NOT use markdown formatting.`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();
        console.log('🤖 AI Reply generated successfully');
        return response;
    } catch (err) {
        console.error('❌ Gemini AI Error:', err.message);
        return getFallbackReply(postContent);
    }
};

const getFallbackReply = (content) => {
    const lower = content.toLowerCase().trim();
    if (lower.includes('javascript') || lower.includes('js')) {
        return 'JavaScript is a versatile programming language primarily used for web development. It enables interactive web pages and is an essential part of web applications alongside HTML and CSS. Keep exploring and building projects!';
    } else if (lower.includes('python')) {
        return 'Python is a high-level, interpreted programming language known for its simplicity and readability. It is widely used in data science, AI, web development, and automation. A great language to master!';
    } else if (lower.includes('java')) {
        return 'Java is a robust, object-oriented programming language used for building enterprise applications, Android apps, and large-scale systems. Its "write once, run anywhere" philosophy makes it highly portable.';
    } else if (lower.includes('react')) {
        return 'React is a popular JavaScript library for building user interfaces, especially single-page applications. It uses a component-based architecture and virtual DOM for efficient rendering.';
    } else if (lower.includes('ai') || lower.includes('machine learning') || lower.includes('ml')) {
        return 'AI and Machine Learning are transforming how we interact with technology. From natural language processing to computer vision, the possibilities are endless. Keep learning and experimenting!';
    } else {
        return `Great topic! "${content}" is an interesting area of study. Keep exploring and sharing your insights with the community. The ALME platform is here to support your learning journey!`;
    }
};

connectDB();

// --- AUTH ROUTES ---

app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, role: role || 'student' });

        // Seed initial progress for new student users
        if (user.role === 'student') {
            const skills = await Skill.find();
            if (skills.length > 0) {
                const progressData = skills.map(skill => ({
                    user: user._id,
                    skill: skill._id,
                    status: skill.dependencies.length === 0 ? 'in-progress' : 'locked'
                }));
                await Progress.insertMany(progressData);
            }
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        if (user.status === 'blocked') {
            return res.status(403).json({ error: 'Your account has been blocked by the administrator. Please contact support.' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 0. Demo Mock Route (Gets first student)
app.get('/api/student/dashboard/mock', async (req, res) => {
    try {
        const user = await User.findOne({ role: 'student' });
        if (!user) return res.status(404).json({ error: 'No student found. Please run seed script.' });

        const progress = await Progress.find({ user: user._id }).populate('skill');
        const completedSkillIds = progress.filter(p => p.status === 'completed').map(p => p.skill._id.toString());
        const nextRecommended = progress.find(p =>
            p.status === 'locked' &&
            p.skill.dependencies.every(dep => completedSkillIds.includes(dep.toString()))
        );

        res.json({
            user,
            progress,
            recommendation: nextRecommended ? nextRecommended.skill.name : 'Mastery Achieved!',
            overallCompletion: Math.round((progress.filter(p => p.status === 'completed').length / progress.length) * 100),
            weakSpot: "JS Loops",
            forecast: "April 2026",
            progressOverTime: [
                { date: '12 Feb', p: 10 }, { date: '14 Feb', p: 15 }, { date: '16 Feb', p: 22 }, { date: '18 Feb', p: 35 }
            ]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 1. Get Student Dashboard Data
app.get('/api/quiz/mock', async (req, res) => {
    try {
        const quiz = await Quiz.findOne().populate('relatedSkill');
        res.json(quiz);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/student/:userId/dashboard', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        const progress = await Progress.find({ user: userId }).populate('skill');
        const attempts = await QuizAttempt.find({ user: userId }).populate({
            path: 'quiz',
            populate: { path: 'relatedSkill' }
        });

        // 1. Calculate Weak Spot (Lowest scoring skill)
        // Calculate Weak Spot
        let weakSpot = "Take a quiz!";
        if (attempts.length > 0) {
            const skillScores = {};
            attempts.forEach(att => {
                const skillName = att.quiz?.relatedSkill?.name || "General Fundamentals";
                if (!skillScores[skillName]) skillScores[skillName] = { total: 0, count: 0 };
                skillScores[skillName].total += att.score;
                skillScores[skillName].count += 1;
            });
            const averages = Object.keys(skillScores).map(name => ({
                name,
                avg: skillScores[name].total / skillScores[name].count
            }));
            const lowest = averages.reduce((prev, curr) => prev.avg < curr.avg ? prev : curr);
            weakSpot = lowest.name; // Always show the lowest skill as weight spot
        }

        // 2. Identify Next Recommended Skill
        const completedSkillIds = progress.filter(p => p.status === 'completed').map(p => p.skill._id.toString());
        const nextRecommended = progress.find(p =>
            p.status === 'locked' &&
            p.skill.dependencies.every(dep => completedSkillIds.includes(dep.toString()))
        );

        const progressOverTime = [
            { date: '12 Feb', p: 10 },
            { date: '14 Feb', p: 18 },
            { date: '16 Feb', p: 25 },
            { date: '18 Feb', p: Math.round((progress.filter(p => p.status === 'completed').length / progress.length) * 100) || 30 }
        ];

        // 4. Forecast Logic
        const completionRate = progress.filter(p => p.status === 'completed').length;
        const forecastDate = completionRate > 0 ? "April 2026" : "May 2026";

        // 5. Get Detailed Attempts with Quiz info
        const detailedAttempts = await QuizAttempt.find({ user: userId })
            .populate({
                path: 'quiz',
                select: 'title category difficulty',
                populate: { path: 'relatedSkill', select: 'name' }
            })
            .sort({ attemptedAt: -1 });

        console.log(`[DASHBOARD] User: ${user.name} (${userId}), Attempts found: ${detailedAttempts.length}`);

        res.json({
            user,
            progress,
            recommendation: nextRecommended ? nextRecommended.skill.name : 'Mastery Achieved!',
            overallCompletion: Math.round((progress.filter(p => p.status === 'completed').length / progress.length) * 100),
            weakSpot,
            forecast: forecastDate,
            joinedCircles: user.joinedCircles || [],
            progressOverTime,
            attempts: detailedAttempts
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Submit Quiz (Rule Engine Integration)
app.post('/api/quiz/submit', async (req, res) => {
    const { userId, quizId, score, timeSpent } = req.body;

    // AI Rule Engine Implementation:
    // Admin defined: Score < 50 -> Remedial, Score > 80 -> Fast track
    let feedback = "";
    if (score < 50) {
        feedback = "Our AI suggests revisiting the fundamentals of this topic. Remedial content unlocked.";
    } else if (score >= 80) {
        feedback = "Excellent! You've mastered this topic. Fast-tracking the next module.";
    } else {
        feedback = "Good progress. Keep practicing.";
    }

    try {
        const attempt = await QuizAttempt.create({ user: userId, quiz: quizId, score, timeSpent, feedback });
        console.log(`[QUIZ] Submitted: User ${userId}, Quiz ${quizId}, Score ${score}`);
        res.json({ success: true, feedback, attempt });
    } catch (err) {
        console.error('[QUIZ] Submit Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// --- HEALTH CHECK ---
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// Get all quizzes (Student view)
app.get('/api/quizzes', async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate('relatedSkill');
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- NETWORK & SOCIAL ROUTES ---

// Get all posts
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new post (with AI auto-reply)
app.post('/api/posts', async (req, res) => {
    try {
        const post = await Post.create(req.body);

        // Generate AI Reply asynchronously
        const aiReply = await generateAIReply(post.content);
        post.aiReply = aiReply;
        await post.save();

        console.log(`📝 Post created with AI reply for: "${post.content.substring(0, 50)}..."`);
        res.json(post);
    } catch (err) {
        console.error('Post creation error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get all circles
app.get('/api/circles', async (req, res) => {
    try {
        const circles = await Circle.find();
        res.json(circles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Join a circle
app.post('/api/users/:id/circles/join', async (req, res) => {
    try {
        const { circleName } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User session invalid. Please log in again.' });

        if (!user.joinedCircles.includes(circleName)) {
            user.joinedCircles.push(circleName);
            await user.save();

            // Increment member count in circle
            await Circle.findOneAndUpdate({ name: circleName }, { $inc: { members: 1 } });
        }
        res.json({ success: true, joinedCircles: user.joinedCircles });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ADMIN ROUTES ---

// 3. Admin: Platform Stats
app.get('/api/admin/stats', async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalQuizzes = await Quiz.countDocuments();
        const totalAttempts = await QuizAttempt.countDocuments();
        const atRisk = await QuizAttempt.countDocuments({ score: { $lt: 50 } });
        const totalBooks = await Book.countDocuments();
        const totalCircles = await Circle.countDocuments();
        const totalPosts = await Post.countDocuments();

        res.json({
            totalStudents,
            totalQuizzes,
            totalAttempts,
            totalBooks,
            totalCircles,
            totalPosts,
            activeNow: Math.floor(totalStudents * 0.15),
            completionRate: 72.4, // Keep as baseline for now or calculate from progress
            atRisk
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// User Management
app.get('/api/admin/users', async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password');
        const usersWithProgress = await Promise.all(students.map(async (student) => {
            const progress = await Progress.find({ user: student._id });
            const total = progress.length;
            const completed = progress.filter(p => p.status === 'completed').length;
            const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

            return {
                ...student._doc,
                progress: completionPercentage
            };
        }));
        res.json(usersWithProgress);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.patch('/api/admin/users/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Quiz Management
app.get('/api/admin/quizzes', async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate('relatedSkill');
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/quizzes', async (req, res) => {
    try {
        const quiz = await Quiz.create(req.body);
        res.json(quiz);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/quizzes/:id', async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(quiz);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/quizzes/:id', async (req, res) => {
    try {
        await Quiz.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Skill (Course) Management
app.get('/api/admin/skills', async (req, res) => {
    try {
        const skills = await Skill.find();
        res.json(skills);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/skills', async (req, res) => {
    try {
        const skill = await Skill.create(req.body);
        res.json(skill);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/skills/:id', async (req, res) => {
    try {
        const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(skill);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/skills/:id', async (req, res) => {
    try {
        await Skill.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Book Management
const { Book } = require('./models/Schemas');

app.get('/api/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/books', async (req, res) => {
    try {
        const book = await Book.create(req.body);
        res.json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/books/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/books/:id', async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Network (Post) Management
app.get('/api/admin/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/posts/:id', async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Circle Management
app.get('/api/admin/circles', async (req, res) => {
    try {
        const circles = await Circle.find();
        res.json(circles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/circles', async (req, res) => {
    try {
        const circle = await Circle.create(req.body);
        res.json(circle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/circles/:id', async (req, res) => {
    try {
        const circle = await Circle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(circle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/circles/:id', async (req, res) => {
    try {
        await Circle.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Unified Search (Skills & Quizzes)
app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.json([]);

        const regex = new RegExp(query, 'i');

        // Parallel search for efficiency
        const [skills, quizzes] = await Promise.all([
            Skill.find({ $or: [{ name: regex }, { category: regex }] }).limit(5),
            Quiz.find({ title: regex }).limit(5)
        ]);

        const results = [
            ...skills.map(s => ({ id: s._id, title: s.name, type: 'skill', info: s.category })),
            ...quizzes.map(q => ({ id: q._id, title: q.title, type: 'quiz', info: 'Quiz' }))
        ];

        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
