import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertTaskSchema, insertNoteSchema, insertStudySessionSchema, insertUserPreferencesSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Task routes
  app.get('/api/tasks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tasks = await storage.getTasks(userId);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post('/api/tasks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const taskData = insertTaskSchema.parse({ ...req.body, userId });
      const task = await storage.createTask(taskData);
      res.json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(400).json({ message: "Failed to create task" });
    }
  });

  app.put('/api/tasks/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const taskData = insertTaskSchema.partial().parse(req.body);
      const task = await storage.updateTask(id, taskData);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(400).json({ message: "Failed to update task" });
    }
  });

  app.delete('/api/tasks/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
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
  app.get('/api/notes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notes = await storage.getNotes(userId);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  app.post('/api/notes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const noteData = insertNoteSchema.parse({ ...req.body, userId });
      const note = await storage.createNote(noteData);
      res.json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(400).json({ message: "Failed to create note" });
    }
  });

  app.put('/api/notes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const noteData = insertNoteSchema.partial().parse(req.body);
      const note = await storage.updateNote(id, noteData);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      console.error("Error updating note:", error);
      res.status(400).json({ message: "Failed to update note" });
    }
  });

  app.delete('/api/notes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
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
  app.get('/api/study-sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  app.post('/api/study-sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionData = insertStudySessionSchema.parse({ ...req.body, userId });
      const session = await storage.createStudySession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating study session:", error);
      res.status(400).json({ message: "Failed to create study session" });
    }
  });

  app.put('/api/study-sessions/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const sessionData = insertStudySessionSchema.partial().parse(req.body);
      const session = await storage.updateStudySession(id, sessionData);
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
  app.get('/api/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const preferences = await storage.getUserPreferences(userId);
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching preferences:", error);
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  app.put('/api/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const preferencesData = insertUserPreferencesSchema.parse({ ...req.body, userId });
      const preferences = await storage.upsertUserPreferences(preferencesData);
      res.json(preferences);
    } catch (error) {
      console.error("Error updating preferences:", error);
      res.status(400).json({ message: "Failed to update preferences" });
    }
  });

  // Stats routes
  app.get('/api/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Demo data routes
  app.post('/api/demo/clear', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Clear all user data (tasks, notes, sessions)
      const userTasks = await storage.getTasks(userId);
      for (const task of userTasks) {
        await storage.deleteTask(task.id, userId);
      }
      
      const userNotes = await storage.getNotes(userId);
      for (const note of userNotes) {
        await storage.deleteNote(note.id, userId);
      }
      
      // Update preferences to mark demo data as cleared
      await storage.upsertUserPreferences({ 
        userId, 
        demoDataCleared: true 
      });
      
      res.json({ message: "Demo data cleared successfully" });
    } catch (error) {
      console.error("Error clearing demo data:", error);
      res.status(500).json({ message: "Failed to clear demo data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
