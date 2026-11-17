import "client-only";
import Dexie, { type EntityTable } from "dexie";

export type LocalSchedule = {
  id: string;
  title: string;
  startDate: string;
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
  timezone: string;
  isRecurring: boolean;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  syncStatus: "pending" | "synced";
}

export class AppDatabase extends Dexie { // create our database class using Dexie
  schedules!: EntityTable<LocalSchedule, "id">; // define a table called schedules like in spreadsheet.

  constructor() {
    super("TalebArabi"); // super() tells Dexie to initialize that database.

    this.version(1).stores({
      schedules: "id, title, startDate, isActive, updatedAt", // fields listed here are indexes, which help Dexie find records faster but they aren't the only fields.
    });
  }
}

export const localDb = new AppDatabase();