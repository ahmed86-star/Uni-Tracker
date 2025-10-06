# 📚 Uni Tracker

<div align="center">

**Your Modern Productivity Companion for University Life**

A comprehensive student productivity application designed to help university students manage tasks, track study sessions, organize notes, and monitor academic progress.

[🚀 Live Demo](#) • [📖 Documentation](#features) • [🐛 Report Bug](https://github.com/ahmed86-star/Uni-Tracker/issues) • [✨ Request Feature](https://github.com/ahmed86-star/Uni-Tracker/issues)

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

---

## ✨ Features

### 🎯 **Smart Focus Timers**
- **Pomodoro Timer** - Classic 25-minute focus sessions with break intervals
- **Study Timer** - Flexible countdown for any duration
- **Countdown Timer** - Set custom time for specific tasks
- Real-time session tracking and statistics

### 📋 **Task Management**
- **Kanban Board** - Drag-and-drop interface with three columns (To Do, In Progress, Done)
- **Priority Levels** - Mark tasks as High, Medium, or Low priority
- **Due Dates** - Set deadlines and get visual reminders
- **Subject Tagging** - Organize tasks by subject/course
- **Progress Tracking** - Monitor task completion rates

### 📝 **Quick Notes**
- Create and organize notes with titles and content
- Tag-based organization (General, Formulas, Reading, Projects)
- Search and filter capabilities
- Edit and delete notes seamlessly

### 📊 **Progress Analytics**
- **Daily Stats** - Track study time and task completion
- **Weekly Breakdown** - Visualize hours studied per day
- **Subject Progress** - Monitor performance across courses
- **Achievements** - Unlock milestones as you progress
- **Study Streaks** - Maintain consistency with streak tracking

### 📚 **Subject Management**
- Create subjects with custom emoji icons and colors
- Set weekly study hour targets
- Track progress per subject
- Visual progress indicators

### ✨ **Motivation & Inspiration**
- Rotating motivational quotes
- Science-backed study tips
- Daily inspiration to stay motivated

### 👤 **Student Profile**
- Customize with your major/field of study
- Add hobbies and interests
- Complete data reset option

### 🎨 **User Experience**
- **Dark Mode** - Toggle between light and dark themes
- **Interactive Guided Tour** - 14-step walkthrough for new users with detailed instructions
- **Responsive Design** - Works perfectly on all devices
- **Smooth Animations** - Polished UI with delightful interactions

---

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first styling
- **shadcn/ui** - Beautiful component library
- **Wouter** - Lightweight routing
- **TanStack Query** - Server state management
- **Framer Motion** - Smooth animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety on the server
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** - Robust relational database
- **Zod** - Schema validation

### Development Tools
- **ESBuild** - Fast bundling
- **Drizzle Kit** - Database migrations
- **React Hook Form** - Form management
- **Date-fns** - Date utilities

---

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (or use Railway/Neon)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/ahmed86-star/Uni-Tracker.git
   cd Uni-Tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # The app uses DATABASE_URL automatically
   # For local development, it works in demo mode without a database
   ```

4. **Run database migrations** (if using a database)
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:5000
   ```

---

## 🌐 Deployment

### Deploy to Railway

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create Railway Project**
   - Go to [Railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your `Uni-Tracker` repository

3. **Add PostgreSQL Database**
   - In Railway dashboard: Click "+ New" → "Database" → "PostgreSQL"
   - Railway auto-generates `DATABASE_URL`

4. **Run Database Migration**
   ```bash
   railway run npm run db:push
   ```

5. **Deploy!** 🚀
   - Railway automatically deploys your app
   - Access via the generated `.railway.app` domain

### Environment Variables
Railway automatically sets:
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 5000)

Optional:
- `NODE_ENV=production` - For production optimizations

---

## 📖 Usage Guide

### Getting Started

1. **Launch the App** - The guided tour will appear on first visit
2. **Complete the Tour** - Learn about all features in 14 interactive steps
3. **Create Your First Task** - Navigate to Tasks and click "New Task"
4. **Start a Study Session** - Use any of the three timer types
5. **Track Your Progress** - View statistics in the Stats tab

### Interactive Guided Tour

The app includes a comprehensive 14-step interactive tour covering:

1. **Welcome & Overview** - Introduction to Uni Tracker
2. **Main Navigation Tabs** - Dashboard, Subjects, Motivation, Profile, Stats
3. **Today's Study Time** - Real-time study tracking
4. **Task Progress** - Completion statistics
5. **Focus Timers** - Pomodoro, Study, and Countdown timers
6. **Task Management** - Kanban board and organization
7. **Quick Notes** - Note-taking system
8. **Statistics Dashboard** - Progress visualization
9. **Subjects Management** - Course organization
10. **Motivation Page** - Quotes and study tips
11. **Profile Section** - Personal customization
12. **Dark Mode** - Theme switching
13. **Authentication Status** - Current demo mode
14. **Final Summary** - Next steps

Each step includes:
- ✅ Clear title with emoji
- ✅ Detailed explanation
- ✅ 3-5 step-by-step instructions
- ✅ Visual progress bar
- ✅ Previous/Next navigation
- ✅ Auto-scroll to relevant sections

### Key Workflows

#### 📝 Creating a Task
1. Click "Tasks" in navigation or scroll to Tasks section
2. Click "New Task" button
3. Fill in title, description, priority, and due date
4. Drag the task card to move it between columns

#### ⏱️ Using Timers
1. Scroll to the Timers section
2. Choose Pomodoro (25 min), Study Timer, or Countdown
3. Click play to start the timer
4. Sessions are automatically tracked in your stats

#### 📚 Managing Subjects
1. Click the "Subjects" tab
2. Add a new subject with emoji, color, and weekly target
3. Track progress for each subject
4. Update or delete subjects as needed

#### 📊 Viewing Statistics
1. Click the "Stats" tab
2. View weekly study time breakdown
3. Check subject progress
4. Monitor your achievements and streaks

---

## 🛠️ Development

### Project Structure
```
uni-tracker/
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities and helpers
├── server/               # Backend Express server
│   ├── routes.ts        # API route definitions
│   ├── storage.ts       # Database abstraction layer
│   └── index.ts         # Server entry point
├── shared/              # Shared types and schemas
│   └── schema.ts        # Drizzle database schema
└── package.json         # Dependencies and scripts
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Run production server
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio

### Database Schema

The app uses PostgreSQL with the following tables:
- **users** - User profiles and authentication
- **tasks** - Task management with status and priority
- **notes** - Quick notes with tagging
- **study_sessions** - Timer session tracking
- **subjects** - Subject/course management
- **user_preferences** - User settings and preferences

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 🐛 Known Issues & Roadmap

### Current Status
- ✅ Demo mode fully functional
- ✅ All features working
- ✅ Interactive guided tour
- ✅ Railway deployment ready
- ⚠️ Authentication coming soon

### Upcoming Features
- 🔐 Full user authentication
- 📱 Mobile app (React Native)
- 🔔 Push notifications for deadlines
- 📅 Google Calendar integration
- 🎯 Goal setting and tracking
- 👥 Study group collaboration
- 📈 Advanced analytics and insights
- 🔊 Focus sounds (ambient audio)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Ahmed**
- GitHub: [@ahmed86-star](https://github.com/ahmed86-star)
- Repository: [Uni-Tracker](https://github.com/ahmed86-star/Uni-Tracker)

---

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by productivity tools for students
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide React](https://lucide.dev)
- Deployed on [Railway](https://railway.app)

---

## 📸 Screenshots

### Dashboard Overview
The main dashboard provides quick access to all features with today's stats at a glance.

### Task Management
Kanban-style board with drag-and-drop functionality for seamless task organization.

### Focus Timers
Three timer types to match your study style - Pomodoro, Study Timer, and Countdown.

### Progress Tracking
Beautiful charts and statistics to visualize your productivity journey.

### Guided Tour
Interactive 14-step walkthrough with detailed instructions for new users.

---

<div align="center">

**Made with ❤️ for students, by students**

⭐ Star this repo if you find it helpful!

[Back to Top ↑](#-uni-tracker)

</div>
