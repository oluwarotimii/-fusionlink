"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  BookOpen, 
  Tag, 
  KeyRound, 
  Settings, 
  LogOut, 
  Menu,
  X 
} from "lucide-react";
import Link from "next/link";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const router = useRouter();
  const pathname = usePathname();

  // Set the active view based on the current path
  useEffect(() => {
    if (pathname.includes('/admin/courses')) {
      setActiveView('courses');
    } else if (pathname.includes('/admin/categories')) {
      setActiveView('categories');
    } else if (pathname.includes('/admin/change-password')) {
      setActiveView('change-password');
    } else if (pathname.includes('/admin/settings')) {
      setActiveView('settings');
    } else {
      setActiveView('dashboard');
    }
  }, [pathname]);

  const handleNavigation = (path: string, view: string) => {
    router.push(path);
    setActiveView(view);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/admin/login");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, path: "/admin/dashboard" },
    { id: "courses", label: "Courses", icon: BookOpen, path: "/admin/dashboard/courses" },
    { id: "categories", label: "Categories", icon: Tag, path: "/admin/dashboard/categories" },
    { id: "change-password", label: "Change Password", icon: KeyRound, path: "/admin/dashboard/change-password" },
    { id: "settings", label: "Settings", icon: Settings, path: "/admin/dashboard/settings" },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h1 className="text-xl font-bold">Admin Portal</h1>
          <button 
            className="lg:hidden text-slate-300 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item.path, item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? "bg-slate-700 text-white" 
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="bg-white border-b lg:hidden">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold text-slate-900">
              {activeView === 'dashboard' && 'Dashboard'}
              {activeView === 'courses' && 'Manage Courses'}
              {activeView === 'categories' && 'Manage Categories'}
              {activeView === 'change-password' && 'Change Password'}
              {activeView === 'settings' && 'Settings'}
            </h1>
            <button 
              className="text-slate-600 hover:text-slate-900"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Desktop header */}
        <header className="hidden lg:block bg-white border-b">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-bold text-slate-900">
              {activeView === 'dashboard' && 'Dashboard'}
              {activeView === 'courses' && 'Manage Courses'}
              {activeView === 'categories' && 'Manage Categories'}
              {activeView === 'change-password' && 'Change Password'}
              {activeView === 'settings' && 'Settings'}
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}