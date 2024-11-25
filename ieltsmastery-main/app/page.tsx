import Image from "next/image";
import Dashboard from "./pages/Dashboard/dashboard";
import LoginPage from "./pages/login/page";
import RegisterPage from "./pages/login/register/page";


export default function Home() {
  return (
    <main>
      <a href="/pages/login">login</a>
     {/* <LoginPage/>
     <RegisterPage/> */}
      <a href="/pages/login/register">register</a>
      <Dashboard />
    </main>
  );
}

