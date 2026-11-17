
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#faf7f6]">

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">

        <Header />

        <main className="flex-1 p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
