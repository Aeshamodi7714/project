# ALME: Autonomous Learning Management Ecosystem

ALME is a next-generation intelligent LMS designed to adapt to student learning paths automatically using AI-driven analytics.

## 🚀 Vision
To provide a seamless, adaptive, and highly visual learning experience for students while giving administrators deep, actionable insights into student performance and risk levels.

## 🛠️ Tech Stack
- **Frontend**: React.js (Vite), Recharts (Analytics), Framer Motion (Animations), Lucide (Icons)
- **Backend**: Node.js, Express.js (JWT, Bcrypt)
- **Database**: MongoDB (Mongoose)
- **Styling**: Modern CSS with Glassmorphism and CSS Variables

## 📂 Structure
- `/frontend`: React application with Login, Register, Student, and Admin panels.
- `/backend`: Express server with Auth logic and MongoDB schemas.

## 🟢 Student Panel Features
1. **Smart Overview**: Adaptive skill level, progress, AI next topic, and weak skill alerts.
2. **Learning Velocity**: Line/Area chart of progress over time.
3. **Skill Radar**: Proficiency visualization across HTML, CSS, JS, React, Node.
4. **Quiz Trends**: Bar chart of historical performance.
5. **Effort Correlation**: Scatter graph comparing hours spent vs scoring.
6. **Adaptive Skill Tree**: Visual dependency graph (Green/Yellow/Grey).
7. **AI Quiz**: Dynamically generated quizzes with instant AI feedback.
8. **Peer Network**: Skill-based study groups and discussion systems.
9. **Logic Suggestions**: Automated ecosystem recommendations.

## ⚡ How to Run

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally)

### 2. Installation
Run this in the root folder:
```bash
npm run install-all
```

### 3. Initialize Data (Seeding)
```bash
npm run seed
```

### 4. Start Application
```bash
npm run dev
```

The application will start with a **Login Page**. If you don't have an account, click **Register** to create a new profile with an automated learning path.
