import { Outlet } from "react-router-dom";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import "@/assets/styles/layout/MainLayout.scss";

export function MainLayout() {
  return (
    <div className="main-layout">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
