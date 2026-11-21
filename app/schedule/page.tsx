
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

import { weekdays } from "@/features/schedule/constants";
import {
  createSchedule,
  deleteSchedule,
  getSchedules,
  setScheduleActive,
  updateSchedule,
} from "@/features/schedule/schedule-repository";

import type {
  CreateScheduleInput,
  Schedule,
  ScheduleRepeat,
} from "@/features/schedule/types";

import { scheduleSchema } from "@/features/schedule/validation";

type ScheduleForm = CreateScheduleInput;

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const emptyForm = (): ScheduleForm => ({
  title: "",
  startTime: "09:00",
  endTime: "10:00",
  startDate: getToday(),
  repeat: "once",
  daysOfWeek: [],
});

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function repeatLabel(repeat: ScheduleRepeat) {
  switch (repeat) {
    case "once":
      return "مرة واحدة";
    case "daily":
      return "يوميًا";
    case "weekly":
      return "أسبوعيًا";
  }
}

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [form, setForm] = useState<ScheduleForm>(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadSchedules() {
    try {
      const data = await getSchedules();
      setSchedules(data);
    } catch {
      setError("تعذر تحميل جدولك. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSchedules();
  }, []);

  function updateField<K extends keyof ScheduleForm>(
    field: K,
    value: ScheduleForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function toggleWeekday(day: number) {
    setForm((current) => ({
      ...current,
      daysOfWeek: current.daysOfWeek.includes(day)
        ? current.daysOfWeek.filter((item) => item !== day)
        : [...current.daysOfWeek, day].sort((a, b) => a - b),
    }));
  }

  function resetForm() {
    setForm(emptyForm());
    setEditingId(null);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const result = scheduleSchema.safeParse(form);

    if (!result.success) {
      setError(
        result.error.issues[0]?.message ?? "يرجى مراجعة البيانات المدخلة."
      );
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        const updated = await updateSchedule(editingId, result.data);

        if (!updated) {
          setError("لم يتم العثور على هذا الموعد.");
          return;
        }
      } else {
        await createSchedule(result.data);
      }

      await loadSchedules();
      resetForm();
    } catch {
      setError("حدث خطأ أثناء حفظ الموعد. حاول مرة أخرى.");
    } finally {
      setSaving(false);
    }
  }

  function startEditing(schedule: Schedule) {
    setEditingId(schedule.id);

    setForm({
      title: schedule.title,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      startDate: schedule.startDate,
      repeat: schedule.repeat,
      daysOfWeek: [...schedule.daysOfWeek],
    });

    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "هل أنت متأكد أنك تريد حذف هذا الموعد؟"
    );

    if (!confirmed) return;

    try {
      await deleteSchedule(id);

      if (editingId === id) resetForm();

      await loadSchedules();
    } catch {
      setError("تعذر حذف الموعد.");
    }
  }

  async function handleToggleActive(schedule: Schedule) {
    try {
      await setScheduleActive(schedule.id, !schedule.isActive);
      await loadSchedules();
    } catch {
      setError("تعذر تغيير حالة الموعد.");
    }
  }

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <main dir="rtl" className="mx-auto min-h-screen max-w-4xl px-4 py-10 text-gray-900">
      <header className="mb-8">
        <p className="mb-2 text-sm font-medium text-blue-600">
          طالب عربي
        </p>

        <h1 className="text-3xl font-bold">
          جدولي الدراسي 📚
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          نظّم مواعيد مذاكرتك وخلّي يومك أكثر إنتاجية.
        </p>
      </header>

      <section className="mb-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="mb-5 text-xl font-semibold">
          {editingId ? "تعديل الموعد ✏️" : "إضافة موعد جديد ➕"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium">
              اسم المادة
            </label>

            <input
              id="title"
              className={inputClass}
              placeholder="مثال: الرياضيات"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="startDate" className="mb-2 block text-sm font-medium">
                التاريخ
              </label>

              <input
                id="startDate"
                type="date"
                className={inputClass}
                value={form.startDate}
                onChange={(e) => updateField("startDate", e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="startTime" className="mb-2 block text-sm font-medium">
                وقت البداية
              </label>

              <input
                id="startTime"
                type="time"
                className={inputClass}
                value={form.startTime}
                onChange={(e) => updateField("startTime", e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="endTime" className="mb-2 block text-sm font-medium">
                وقت النهاية
              </label>

              <input
                id="endTime"
                type="time"
                className={inputClass}
                value={form.endTime}
                onChange={(e) => updateField("endTime", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="repeat" className="mb-2 block text-sm font-medium">
              التكرار
            </label>

            <select
              id="repeat"
              className={inputClass}
              value={form.repeat}
              onChange={(e) => {
                const repeat = e.target.value as ScheduleRepeat;

                setForm((current) => ({
                  ...current,
                  repeat,
                  daysOfWeek: repeat === "weekly" ? current.daysOfWeek : [],
                }));
              }}
            >
              <option value="once">مرة واحدة</option>
              <option value="daily">كل يوم</option>
              <option value="weekly">كل أسبوع</option>
            </select>
          </div>

          {form.repeat === "weekly" && (
            <div>
              <p className="mb-3 text-sm font-medium">
                اختر أيام التكرار
              </p>

              <div className="flex flex-wrap gap-2">
                {weekdays.map((_, index) => {
                  const arabicDays = [
                    "الأحد",
                    "الإثنين",
                    "الثلاثاء",
                    "الأربعاء",
                    "الخميس",
                    "الجمعة",
                    "السبت",
                  ];

                  const day = arabicDays[index];
                  const selected = form.daysOfWeek.includes(index);

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleWeekday(index)}
                      aria-pressed={selected}
                      className={`rounded-full border px-3 py-2 text-sm transition ${
                        selected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={saving}>
              {saving
                ? "جارٍ الحفظ..."
                : editingId
                  ? "حفظ التعديلات"
                  : "إضافة الموعد"}
            </Button>

            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                إلغاء
              </Button>
            )}
          </div>
        </form>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            مواعيدك الدراسية
          </h2>

          <span className="text-sm text-gray-500">
            {schedules.length} موعد
          </span>
        </div>

        {loading ? (
          <p className="py-8 text-center text-gray-500">
            جارٍ تحميل المواعيد...
          </p>
        ) : schedules.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 px-5 py-12 text-center">
            <p className="text-3xl">📅</p>
            <p className="mt-3 font-medium">لا توجد مواعيد حتى الآن</p>
            <p className="mt-1 text-sm text-gray-500">
              أضف أول موعد دراسي وابدأ تنظيم وقتك!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {schedules.map((schedule) => (
              <article
                key={schedule.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="break-words font-semibold">
                        {schedule.title}
                      </h3>

                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                        {repeatLabel(schedule.repeat)}
                      </span>

                      {!schedule.isActive && (
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                          غير نشط
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-gray-600">
                      📅 {formatDate(schedule.startDate)}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      🕒 {schedule.startTime} – {schedule.endTime}
                    </p>

                    {schedule.repeat === "weekly" && (
                      <p className="mt-2 text-xs text-gray-500">
                        {schedule.daysOfWeek
                          .map((day) => [
                            "الأحد",
                            "الإثنين",
                            "الثلاثاء",
                            "الأربعاء",
                            "الخميس",
                            "الجمعة",
                            "السبت",
                          ][day])
                          .join("، ")}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleActive(schedule)}
                    >
                      {schedule.isActive ? "إيقاف" : "تفعيل"}
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => startEditing(schedule)}
                    >
                      تعديل
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(schedule.id)}
                    >
                      حذف
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
