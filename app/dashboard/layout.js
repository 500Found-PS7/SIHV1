"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "../components/dashboard/sidebar";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative min-h-screen bg-[#0A0A0B]">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container - Fixed width container */}
      <div className="fixed top-0 left-0 bottom-0 z-50 w-72">
        {/* Animated Sidebar */}
        <motion.div 
          className="absolute top-0 left-0 bottom-0 w-full bg-[#1C1C1E] overflow-hidden"
          animate={{ 
            width: isSidebarOpen ? "100%" : isMobile ? "0%" : "80px",
            x: isMobile && !isSidebarOpen ? "-100%" : "0%"
          }}
          transition={{ 
            type: "spring",
            damping: 25,
            stiffness: 120,
            mass: 0.8
          }}
        >
          <Sidebar 
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </motion.div>
      </div>

      {/* Main Content */}
      <motion.div
        className="min-h-screen"
        animate={{ 
          marginLeft: isMobile ? 0 : (isSidebarOpen ? "288px" : "80px")
        }}
        transition={{ 
          type: "spring",
          damping: 25,
          stiffness: 120,
          mass: 0.8
        }}
      >
        <main className="py-6">
          <div className="px-6">
            {children}
          </div>
        </main>
      </motion.div>
    </div>
  );
} 