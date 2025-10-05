import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertNoteSchema, insertStudySessionSchema, insertUserPreferencesSchema, insertSubjectSchema, updateUserProfileSchema } from "@shared/schema";
import { z } from "zod";

const DEMO_USER_ID = 'demo-user';

export async function registerRoutes(app: Express): Promise<Server> {
  // Stub auth routes (authentication disabled)
  app.get('/api/login', (req, res) => {
    res.redirect('/');
  });

  app.get('/api/logout', (req, res) => {
    res.redirect('/');
  });

  // Auth routes
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      let user = await storage.getUser(userId);
      if (!user) {
        user = await storage.upsertUser({
          id: userId,
          email: 'demo@unitracker.app',
          firstName: 'Demo',
          lastName: 'User',
        });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Task routes
  app.get('/api/tasks', async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const tasks = await storage.getTasks(userId);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post('/api/tasks', async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const taskData = insertTaskSchema.parse({ ...req.body, userId });
      const task = await storage.createTask(taskData);
      res.json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(400).json({ message: "Failed to create task" });
    }
  });

  app.put('/api/tasks/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = DEMO_USER_ID;
      const taskData = insertTaskSchema.omit({ userId: true }).partial().parse(req.body);
      const task = await storage.updateTask(id, userId, taskData);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(400).json({ message: "Failed to update task" });
    }
  });

  app.delete('/api/tasks/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = DEMO_USER_ID;
      const deleted = await storage.deleteTask(id, userId);
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Note routes
  app.get('/api/notes', async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const notes = await storage.getNotes(userId);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  app.post('/api/notes', async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const noteData = insertNoteSchema.parse({ ...req.body, userId });
      const note = await storage.createNote(noteData);
      res.json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(400).json({ message: "Failed to create note" });
    }
  });

  app.put('/api/notes/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = DEMO_USER_ID;
      const noteData = insertNoteSchema.omit({ userId: true }).partial().parse(req.body);
      const note = await storage.updateNote(id, userId, noteData);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      console.error("Error updating note:", error);
      res.status(400).json({ message: "Failed to update note" });
    }
  });

  app.delete('/api/notes/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = DEMO_USER_ID;
      const deleted = await storage.deleteNote(id, userId);
      if (!deleted) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json({ message: "Note deleted successfully" });
    } catch (error) {
      console.error("Error deleting note:", error);
      res.status(500).json({ message: "Failed to delete note" });
    }
  });

  // Study session routes
  app.get('/api/study-sessions', async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const { startDate, endDate } = req.query;
      
      let start, end;
      if (startDate) start = new Date(startDate as string);
      if (endDate) end = new Date(endDate as string);
      
      const sessions = await storage.getStudySessions(userId, start, end);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching study sessions:", error);
      res.status(500).json({ message: "Failed to fetch study sessions" });
    }
  });

  app.post('/api/study-sessions', async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const sessionData = insertStudySessionSchema.parse({ ...req.body, userId });
      const session = await storage.createStudySession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating study session:", error);
      res.status(400).json({ message: "Failed to create study session" });
    }
  });

  app.put('/api/study-sessions/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = DEMO_USER_ID;
      const sessionData = insertStudySessionSchema.omit({ userId: true }).partial().parse(req.body);
      const session = await storage.updateStudySession(id, userId, sessionData);
      if (!session) {
        return res.status(404).json({ message: "Study session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error("Error updating study session:", error);
      res.status(400).json({ message: "Failed to update study session" });
    }
  });

  // User preferences routes
  app.get('/api/preferences', async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const preferences = await storage.getUserPreferences(userId);
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching preferences:", error);
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  app.put('/api/preferences', async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const preferencesData = insertUserPreferencesSchema.parse({ ...req.body, userId });
      const preferences = await storage.upsertUserPreferences(preferencesData);
      res.json(preferences);
    } catch (error) {
      console.error("Error updating preferences:", error);
      res.status(400).json({ message: "Failed to update preferences" });
    }
  });

  // Stats routes
  app.get('/api/stats', async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Profile routes
  app.put('/api/profile', async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const profileData = updateUserProfileSchema.parse(req.body);
      const user = await storage.updateUserProfile(userId, profileData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(400).json({ message: "Failed to update profile" });
    }
  });

  // Subject routes
  app.get('/api/subjects', async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const subjects = await storage.getSubjects(userId);
      res.json(subjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      res.status(500).json({ message: "Failed to fetch subjects" });
    }
  });

  app.post('/api/subjects', async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const subjectData = insertSubjectSchema.parse({ ...req.body, userId });
      const subject = await storage.createSubject(subjectData);
      res.json(subject);
    } catch (error) {
      console.error("Error creating subject:", error);
      res.status(400).json({ message: "Failed to create subject" });
    }
  });

  app.put('/api/subjects/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = DEMO_USER_ID;
      const subjectData = insertSubjectSchema.omit({ userId: true }).partial().parse(req.body);
      const subject = await storage.updateSubject(id, userId, subjectData);
      if (!subject) {
        return res.status(404).json({ message: "Subject not found" });
      }
      res.json(subject);
    } catch (error) {
      console.error("Error updating subject:", error);
      res.status(400).json({ message: "Failed to update subject" });
    }
  });

  app.delete('/api/subjects/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = DEMO_USER_ID;
      const deleted = await storage.deleteSubject(id, userId);
      if (!deleted) {
        return res.status(404).json({ message: "Subject not found" });
      }
      res.json({ message: "Subject deleted successfully" });
    } catch (error) {
      console.error("Error deleting subject:", error);
      res.status(500).json({ message: "Failed to delete subject" });
    }
  });

  // Data reset routes
  app.post('/api/data/reset', async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const success = await storage.deleteAllUserData(userId);
      
      if (!success) {
        return res.status(500).json({ message: "Failed to reset data" });
      }
      
      res.json({ message: "All data reset successfully" });
    } catch (error) {
      console.error("Error resetting data:", error);
      res.status(500).json({ message: "Failed to reset data" });
    }
  });

  // Demo data routes (kept for backward compatibility)
  app.post('/api/demo/clear', async (req: any, res) => {
    try {
      const userId = DEMO_USER_ID;
      const success = await storage.deleteAllUserData(userId);
      
      if (!success) {
        return res.status(500).json({ message: "Failed to clear demo data" });
      }
      
      res.json({ message: "Demo data cleared successfully" });
    } catch (error) {
      console.error("Error clearing demo data:", error);
      res.status(500).json({ message: "Failed to clear demo data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
