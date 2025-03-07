"use client";
import Image from "next/image";
import { FaRegUserCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import AdminProtectedRoute from "../../pages/RouteProtected/adminRouteProtected";
export default function AdminDashboard() {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminToken");
    }
    router.push("/admin/login");
  };

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-[#03036D] text-white p-6 shadow-lg flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            <p className="text-sm">
              Welcome, Admin! Manage the IELTS Mastery modules below.
            </p>

          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </header>

        {/* Main Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Users Management */}
          <div
            className="bg-white shadow-lg rounded-lg p-5 hover:shadow-xl transition duration-300 cursor-pointer"
            onClick={() => navigateTo("/admin/users")}
          >
            <div className="w-24 h-24 bg-[#03036D] rounded-full flex items-center justify-center mx-auto">
              <FaRegUserCircle className="text-white w-16 h-16" />
            </div>
            <h2 className="text-xl font-bold text-center mt-3 text-gray-800">
              Users Management
            </h2>
            <p className="text-gray-600 text-center">
              View and manage registered users efficiently.
            </p>
          </div>

          {/* Test Management Sections */}
          {[
            {
              title: "Manage Reading Test",
              path: "/admin/tests/reading/main",
              img: "/icons/reading.png",
              desc: "Create and update IELTS reading test materials.",
            },
            {
              title: "Manage Speaking Test",
              path: "/admin/tests/speaking",
              img: "/icons/speaking.png",
              desc: "Add and edit speaking prompts for IELTS tests.",
            },
            {
              title: "Manage Listening Test",
              path: "/admin/tests/listening/main",
              img: "/icons/listening.png",
              desc: "Upload and manage audio-based IELTS tasks.",
            },
            {
              title: "Manage Writing Test",
              path: "/admin/tests/writing/main",
              img: "/icons/writing.png",
              desc: "Oversee and update writing topics and samples.",
            },
          ].map(({ title, path, img, desc }, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-5 hover:shadow-xl transition duration-300 cursor-pointer"
              onClick={() => navigateTo(path)}
            >
              <Image
                src={img}
                alt={title}
                width={80}
                height={80}
                className="mx-auto object-contain"
              />
              <h2 className="text-xl font-bold text-center mt-3 text-gray-800">{title}</h2>
              <p className="text-gray-600 text-center">{desc}</p>
            </div>
          ))}
        </div> {/* ✅ Correctly closed the div here */}
      </div>
    </AdminProtectedRoute>
  );
}
