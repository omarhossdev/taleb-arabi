import { z } from "zod";

export const scheduleSchema = z
  .object({
    title: z.string().trim().min(1, "اسم المادة مطلوب").max(100),

    startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),

    endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),

    startDate: z.iso.date(),

    repeat: z.enum(["once", "daily", "weekly"]),

    daysOfWeek: z.array(z.number().int().min(0).max(6)), // 0 = Sunday, 6 = Saturday (week system in JavaScript)

  })
  .refine(
    (data) => data.endTime > data.startTime,
    {
      message: "وقت النهاية يجب أن يكون بعد وقت البداية",
      path: ["endTime"],
    }
  )
  .refine(
    (data) => data.repeat !== "weekly" || data.daysOfWeek.length > 0,
    {
      message: "اختر يومًا واحدًا على الأقل",
      path: ["daysOfWeek"],
    }
  )
  .refine(
    (data) => data.repeat === "weekly" || data.daysOfWeek.length === 0,
    {
      message: "الأيام المحددة تستخدم مع التكرار الأسبوعي فقط",
      path: ["daysOfWeek"]
    }
  )
  .refine(
    (data) => new Set(data.daysOfWeek).size === data.daysOfWeek.length,
    {
      message: "اليوم الاسبوعي لا يمكن ان يتم اختياره اكثر من مرة",
      path: ["daysOfWeek"],
    }
  );

export type ValidatedSchedule = z.infer<typeof scheduleSchema>;
