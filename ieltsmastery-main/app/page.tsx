import Link from "next/link";
import Dashboard from "./pages/dashboard/page";
import LoginPage from "./pages/login/page";
import RegisterPage from "./pages/register/page";

export default function Home() {
  return (
    <main>
      <Link href="/pages/login">Login</Link>
      {/* <LoginPage />
      <RegisterPage /> */}
      <Link href="/pages/login/register">Register</Link>
      <Dashboard />
    </main>
  );
}
