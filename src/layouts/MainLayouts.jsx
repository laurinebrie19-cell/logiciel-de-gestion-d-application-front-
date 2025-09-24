import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Sidebar from "../components/SideBar";
import Footer from "../components/Footer";

import ScrollToTop from "./ScroolToUp";

const MainLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      if (isMobileView) {
        setSidebarOpen(false);
      }
    };

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 relative pb-[88px]">
      {" "}
      {/* Ajout du padding-bottom */}
      <Header isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {isMobile && (
              <div
                className="fixed inset-0 bg-black/20 z-30"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            <Sidebar
              isOpen={isSidebarOpen}
              isMobile={isMobile}
              onClose={() => setSidebarOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
      <div
        className={`pt-16 ${
          isSidebarOpen ? "md:ml-64" : ""
        } transition-all duration-300`}
      >
        <div className="container mx-auto px-4 py-8">
          <Outlet />
        </div>
      </div>
      <Footer isSidebarOpen={isSidebarOpen} />
      <AnimatePresence>
        {showScrollTop && <ScrollToTop show={showScrollTop} />}
      </AnimatePresence>
    </div>
  );
};

export default MainLayout;
