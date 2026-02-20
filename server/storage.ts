import { db } from "./db";
import { memories, type Memory, type InsertMemory } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getMemory(key: string): Promise<Memory | undefined>;
  getAllMemories(): Promise<Memory[]>;
  upsertMemory(memory: InsertMemory): Promise<Memory>;
}

export class DatabaseStorage implements IStorage {
  async getMemory(key: string): Promise<Memory | undefined> {
    const [memory] = await db.select().from(memories).where(eq(memories.key, key));
    return memory;
  }

  async getAllMemories(): Promise<Memory[]> {
    return await db.select().from(memories);
  }

  async upsertMemory(insertMemory: InsertMemory): Promise<Memory> {
    const [memory] = await db.insert(memories)
      .values(insertMemory)
      .onConflictDoUpdate({
        target: memories.key,
        set: { value: insertMemory.value }
      })
      .returning();
    return memory;
  }
}

export const storage = new DatabaseStorage();
