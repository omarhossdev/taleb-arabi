import "client-only"; // why?? because Dexie lives in the browser so no necessary to import server.
import Dexie, { type EntityTable } from "dexie";
import type { Schedule } from "@/features/schedule/types";

export type LocalSchedule = Schedule & {
  syncStatus: "pending" | "synced";
  deletedAt: number | null;
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