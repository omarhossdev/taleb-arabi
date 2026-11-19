// This file handles CRUD
import "client-only";

import { localDb, type LocalSchedule } from "@/lib/offline/db";
import type {
  CreateScheduleInput,
  UpdateScheduleInput,
} from "./types"

export async function createSchedule(
  input: CreateScheduleInput
): Promise<LocalSchedule> {
  const now = Date.now();

  const schedule: LocalSchedule = {
    ...input,
    id: crypto.randomUUID(),
    isActive: true,
    createdAt: now,
    updatedAt: now,
    syncStatus: 'pending',
    deletedAt: null,
  };

  await localDb.schedules.add(schedule) // add the schedule to the local dB
  return schedule
}

export async function getSchedules(): Promise<LocalSchedule[]> {
  const schedules = await localDb.schedules.toArray();

  return schedules
    .filter((schedule) => schedule.deletedAt === null)
    .sort((a, b) => (
      `${a.startDate} ${a.startTime}`.localeCompare(
        `${b.startDate} ${b.startTime}`
      )
    )
  );
}

export async function getScheduleById(
  id: string
): Promise<LocalSchedule | undefined> {
  const schedule = await localDb.schedules.get(id);

  if (!schedule || schedule.deletedAt !== null) { // if the db can't find a schedule with that ID or that schedule has been deleted.
    return undefined;
  }

  return schedule;
}

export async function updateSchedule(
  id: string,
  input: UpdateScheduleInput,
): Promise<LocalSchedule | undefined> {

  const existing = await getScheduleById(id)

  if (!existing) return undefined;

  await localDb.schedules.update(id, {
    ...input,
    updatedAt: Date.now(),
    syncStatus: "pending"
  });

  return getScheduleById(id)
}

export async function deleteSchedule(id: string): Promise<boolean> {
  const existing = await getScheduleById(id)

  if (!existing) return false;

  await localDb.schedules.update(id, {
    deletedAt: Date.now(),
    updatedAt: Date.now(),
    syncStatus: "pending",
  });

  return true;
}
