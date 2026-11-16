import { connection } from "next/server";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export const instant = false

const HomePage = () => {
  return (
    <>
      <h1>طالب ثانوي</h1>
      <a href="/login" className="bg-blue-600 p-3 m-6 text-2xl text-white">تسجيل الدخول</a>
    </>
  )
}

const Dashboard = async () => {
  const session = await auth();

  return (
    <div>
      <p>👋 Hi {session.user?.name}</p>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        <button type="submit">Logout</button>
      </form>
    </div>
  )
}

export default async function Home() {
  await connection();

  const session = await auth();
  
  return session ? <Dashboard /> : <HomePage />;
}