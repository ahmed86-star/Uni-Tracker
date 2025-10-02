import {
  users,
  tasks,
  notes,
  studySessions,
  userPreferences,
  subjects,
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
  type Subject,
  type InsertSubject,
  type UpdateUserProfile,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, count } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(userId: string, profile: UpdateUserProfile): Promise<User | undefined>;
  deleteAllUserData(userId: string): Promise<boolean>;
  
  // Task operations
  getTasks(userId: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, userId: string, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string, userId: string): Promise<boolean>;
  
  // Note operations
  getNotes(userId: string): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: string, userId: string, note: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: string, userId: string): Promise<boolean>;
  
  // Study session operations
  getStudySessions(userId: string, startDate?: Date, endDate?: Date): Promise<StudySession[]>;
  createStudySession(session: InsertStudySession): Promise<StudySession>;
  updateStudySession(id: string, userId: string, session: Partial<InsertStudySession>): Promise<StudySession | undefined>;
  
  // User preferences operations
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  upsertUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  
  // Subject operations
  getSubjects(userId: string): Promise<Subject[]>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  updateSubject(id: string, userId: string, subject: Partial<InsertSubject>): Promise<Subject | undefined>;
  deleteSubject(id: string, userId: string): Promise<boolean>;
  
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

  async updateUserProfile(userId: string, profile: UpdateUserProfile): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async deleteAllUserData(userId: string): Promise<boolean> {
    try {
      // Delete in correct order due to foreign key constraints
      await db.delete(studySessions).where(eq(studySessions.userId, userId));
      await db.delete(notes).where(eq(notes.userId, userId));
      await db.delete(tasks).where(eq(tasks.userId, userId));
      await db.delete(subjects).where(eq(subjects.userId, userId));
      await db.delete(userPreferences).where(eq(userPreferences.userId, userId));
      
      // Reset user profile data but keep the account
      await db
        .update(users)
        .set({ 
          major: null, 
          hobbies: null,
          updatedAt: new Date() 
        })
        .where(eq(users.id, userId));
      
      return true;
    } catch (error) {
      console.error('Error deleting user data:', error);
      return false;
    }
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

  async updateTask(id: string, userId: string, task: Partial<InsertTask>): Promise<Task | undefined> {
    const [updatedTask] = await db
      .update(tasks)
      .set({ ...task, updatedAt: new Date() })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
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

  async updateNote(id: string, userId: string, note: Partial<InsertNote>): Promise<Note | undefined> {
    const [updatedNote] = await db
      .update(notes)
      .set({ ...note, updatedAt: new Date() })
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
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

  async updateStudySession(id: string, userId: string, session: Partial<InsertStudySession>): Promise<StudySession | undefined> {
    const [updatedSession] = await db
      .update(studySessions)
      .set(session)
      .where(and(eq(studySessions.id, id), eq(studySessions.userId, userId)))
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

  async getSubjects(userId: string): Promise<Subject[]> {
    return await db
      .select()
      .from(subjects)
      .where(eq(subjects.userId, userId))
      .orderBy(desc(subjects.createdAt));
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    const [newSubject] = await db.insert(subjects).values(subject).returning();
    return newSubject;
  }

  async updateSubject(id: string, userId: string, subject: Partial<InsertSubject>): Promise<Subject | undefined> {
    const [updatedSubject] = await db
      .update(subjects)
      .set({ ...subject, updatedAt: new Date() })
      .where(and(eq(subjects.id, id), eq(subjects.userId, userId)))
      .returning();
    return updatedSubject;
  }

  async deleteSubject(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(subjects)
      .where(and(eq(subjects.id, id), eq(subjects.userId, userId)));
    return (result.rowCount ?? 0) > 0;
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
