export type ScheduleRepeat = "once" | "daily" | "weekly";

export type Schedule = { // complete saved schedule.
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  
  startDate: string;
  repeat: ScheduleRepeat;

  // sunday = 0, saturday = 6
  daysOfWeek: number[];

  isActive: boolean;

  createdAt: number;
  updatedAt: number;
}

const weekdays = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

export type CreateScheduleInput = Omit< 
  Schedule,
  "id" | "isActive" | "createdAt" | "updatedAt"
>; // data needed to create one.

// Omit makes CreateScheduleInput contains everything except id, isActive... Why? Because when creating a schedule, the application generates these data automatically 

export type UpdateScheduleInput = Partial<CreateScheduleInput>

// Partial makes properties optional so you can e.g. edit the title only or time only etc.. without sending the entire schedule again.