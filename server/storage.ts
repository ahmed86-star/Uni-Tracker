import {
  users,
  tasks,
  notes,
  studySessions,
  userPreferences,
  type User,
  type UpsertUser,
  type Task,
  type InsertTask,
  type Note,
  type InsertNote,
  type StudySession,
  type InsertStudySession,
  type UserPreferences,
  type InsertUserPreferences,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, count } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Task operations
  getTasks(userId: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string, userId: string): Promise<boolean>;
  
  // Note operations
  getNotes(userId: string): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: string, note: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: string, userId: string): Promise<boolean>;
  
  // Study session operations
  getStudySessions(userId: string, startDate?: Date, endDate?: Date): Promise<StudySession[]>;
  createStudySession(session: InsertStudySession): Promise<StudySession>;
  updateStudySession(id: string, session: Partial<InsertStudySession>): Promise<StudySession | undefined>;
  
  // User preferences operations
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  upsertUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  
  // Stats operations
  getUserStats(userId: string): Promise<{
    todayStudyTime: number;
    completedTasksToday: number;
    totalTasksToday: number;
    currentStreak: number;
    focusScore: number;
    weeklyStudyTime: { day: string; hours: number }[];
    subjectProgress: { subject: string; hours: number; tasksCompleted: number }[];
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getTasks(userId: string): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt));
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db.insert(tasks).values(task).returning();
    return newTask;
  }

  async updateTask(id: string, task: Partial<InsertTask>): Promise<Task | undefined> {
    const [updatedTask] = await db
      .update(tasks)
      .set({ ...task, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return updatedTask;
  }

  async deleteTask(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  async getNotes(userId: string): Promise<Note[]> {
    return await db
      .select()
      .from(notes)
      .where(eq(notes.userId, userId))
      .orderBy(desc(notes.updatedAt));
  }

  async createNote(note: InsertNote): Promise<Note> {
    const [newNote] = await db.insert(notes).values(note).returning();
    return newNote;
  }

  async updateNote(id: string, note: Partial<InsertNote>): Promise<Note | undefined> {
    const [updatedNote] = await db
      .update(notes)
      .set({ ...note, updatedAt: new Date() })
      .where(eq(notes.id, id))
      .returning();
    return updatedNote;
  }

  async deleteNote(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }

  async getStudySessions(userId: string, startDate?: Date, endDate?: Date): Promise<StudySession[]> {
    if (startDate && endDate) {
      return await db
        .select()
        .from(studySessions)
        .where(
          and(
            eq(studySessions.userId, userId),
            gte(studySessions.startTime, startDate),
            lte(studySessions.startTime, endDate)
          )
        )
        .orderBy(desc(studySessions.startTime));
    }
    
    return await db
      .select()
      .from(studySessions)
      .where(eq(studySessions.userId, userId))
      .orderBy(desc(studySessions.startTime));
  }

  async createStudySession(session: InsertStudySession): Promise<StudySession> {
    const [newSession] = await db.insert(studySessions).values(session).returning();
    return newSession;
  }

  async updateStudySession(id: string, session: Partial<InsertStudySession>): Promise<StudySession | undefined> {
    const [updatedSession] = await db
      .update(studySessions)
      .set(session)
      .where(eq(studySessions.id, id))
      .returning();
    return updatedSession;
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const [preferences] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    return preferences;
  }

  async upsertUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const [upsertedPreferences] = await db
      .insert(userPreferences)
      .values(preferences)
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: {
          ...preferences,
          updatedAt: new Date(),
        },
      })
      .returning();
    return upsertedPreferences;
  }

  async getUserStats(userId: string): Promise<{
    todayStudyTime: number;
    completedTasksToday: number;
    totalTasksToday: number;
    currentStreak: number;
    focusScore: number;
    weeklyStudyTime: { day: string; hours: number }[];
    subjectProgress: { subject: string; hours: number; tasksCompleted: number }[];
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's study sessions
    const todaySessions = await this.getStudySessions(userId, today, tomorrow);
    const todayStudyTime = todaySessions.reduce((total, session) => total + (session.duration || 0), 0);

    // Get today's tasks
    const todayTasks = await db
      .select()
      .from(tasks)
      .where(
        and(
          eq(tasks.userId, userId),
          gte(tasks.createdAt, today),
          lte(tasks.createdAt, tomorrow)
        )
      );

    const completedTasksToday = todayTasks.filter(task => task.status === 'done').length;
    const totalTasksToday = todayTasks.length;

    // Calculate weekly study time (mock calculation for now)
    const weeklyStudyTime = [
      { day: 'Mon', hours: 3.5 },
      { day: 'Tue', hours: 4.2 },
      { day: 'Wed', hours: 2.8 },
      { day: 'Thu', hours: 4.0 },
      { day: 'Fri', hours: 3.3 },
      { day: 'Sat', hours: 2.1 },
      { day: 'Sun', hours: 1.4 },
    ];

    // Calculate subject progress (simplified)
    const subjectProgress = [
      { subject: 'Mathematics', hours: 8.5, tasksCompleted: 12 },
      { subject: 'Physics', hours: 6.2, tasksCompleted: 8 },
      { subject: 'Chemistry', hours: 5.4, tasksCompleted: 6 },
    ];

    return {
      todayStudyTime,
      completedTasksToday,
      totalTasksToday,
      currentStreak: 14, // Mock value
      focusScore: 87, // Mock value
      weeklyStudyTime,
      subjectProgress,
    };
  }
}

export const storage = new DatabaseStorage();
