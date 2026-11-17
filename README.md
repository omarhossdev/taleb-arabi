<div align="center">

# 📚 Taleb-Arabi — طالب عربي

**A free, open-source, offline-first study companion built for students across the Arab world 🌍**

[العربية 🇪🇬](./README.ar.md)  
</div>

---

## 🌟 About The Project

**Taleb-Arabi (طالب عربي)** is an all-in-one smart study platform designed to take the stress out of school. Built with an accessible, distraction-free interface, it helps students organize their time, stay consistent, review flashcards, and track progress—even without an internet connection.

> 🏆 *Developed in preparation for the **Egyptian State Award for Young Innovators 2027 (جائزة الدولة للمبدع الصغير)**.*

---

## ✨ Key Features

- 📅 **Custom Schedule:** Build your own personalized schedule, assign times for homework and lessons, and link tasks directly to your daily routine and focus sessions.
- ✅ **Daily Tasks:** Easily view, edit, or check off tasks generated from your active schedule.
- ⌚ **Focus Time:** Jump into a dedicated study tab focused on one subject at a time. Track your study hours, save time to the database, and see your remaining hours instantly.
- 📝 **Manually Reviewed Summaries:** Access clean, handwritten study summaries reviewed personally for quality and copyright compliance with creator approval.
- 🔔 **Optional Telegram Reminders:** Connect to a free Telegram bot for schedule and exam notifications that you can customize or mute anytime.
- 🎴 **Smart Flashcards:** Add your own flashcards and English vocabulary, review them daily like Anki, and let the built-in robot voice read English words out loud for you.
- 🔥 **Streak & Grade-Level Leaderboard:** Track daily study hours and earn XP! The leaderboard is safely split by grade levels (so Grade 2 students compete with Grade 2, not Grade 12), displaying usernames and XP only with **no personal data exposed**.
- 📶 **Offline-First PWA:** Installable on any phone or desktop home screen with a single tap, keeping all core study tools functional offline.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **Language:** [TypeScript](https://typescriptlang.org)
- **Styling & UI:** [Tailwind CSS](https://tailwindcss.com) & [ShadCN UI](https://shadcn.com)
- **Database & ORM:** [Turso](https://turso.tech) (SQLite) & [Drizzle ORM](https://drizzle.team)
- **Offline:** [Dexie.js](https://dexie.org/)

---

## 🚀 Getting Started

To run a local copy of **Taleb-Arabi**, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/omarhossdev/taleb-arabi/
   cd taleb-arabi
   ```
2. **Install dependencies:** `pnpm install`
3. **Set up environment variables**

Create a .env.local file in the root directory and add your database keys:

```bash
TURSO_DATABASE_URL=your_turso_url
TURSO_AUTH_TOKEN=your_turso_token
AUTH_SECRET=your_auth_secret
```
(You can generate an AUTH_SECRET using `openssl rand -base64 32`)

4. **Push the database schema:** `pnpm db`
5. **Start the development server:** `pnpm dev`

---

## 🤝 Contributing & License

Issues and feature requests are always welcome! Feel free to check the [issues](https://github.com/omarhossdev/taleb-arabi/issues) page.

Distributed under the **MIT License**. See LICENSE for more information.

---

<div align="center">
   Made with ❤️ by <a href="https://github.com/omarhossdev">Omar Hossam (omarhossdev)</a>
</div>
