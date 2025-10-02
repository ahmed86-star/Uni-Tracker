# 📚 Uni Tracker

A comprehensive student productivity application for managing tasks, tracking study sessions, organizing notes, and monitoring academic progress.

## ✨ Features

- **Smart Timers**: Pomodoro, Study Timer, and Countdown with session tracking
- **Task Management**: Kanban board with drag-and-drop functionality
- **Calendar View**: Visualize tasks and study sessions by date
- **Quick Notes**: Create, edit, and organize study notes
- **Statistics Dashboard**: Track study time, completed tasks, and streaks
- **Focus Sounds**: Built-in ambient sounds (Rain, Fireplace, Wind, Cafe, Forest, White Noise)
- **Dark Mode**: Toggle between light and dark themes
- **Google Authentication**: Secure sign-in with Replit Auth

## 🚀 Deployment

### Deploy to Vercel (No Domain Required)

See [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) for complete step-by-step instructions.

**Quick Start:**
```bash
npm i -g vercel
vercel login
vercel
```

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📦 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, PostgreSQL (Neon)
- **Authentication**: Replit Auth (Google, GitHub, Email)
- **Database**: Drizzle ORM
- **Deployment**: Vercel

## 🎯 Key Technologies

- React Query for data fetching
- DND Kit for drag-and-drop
- Web Audio API for focus sounds
- React Joyride for guided tours
- Recharts for statistics visualization

## 🔧 Configuration

### Environment Variables

```env
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_secure_random_string
```

### Database Setup

The app uses PostgreSQL. On first run, tables are automatically created.

## 📝 License

MIT

---

Made with ❤️ for students everywhere
