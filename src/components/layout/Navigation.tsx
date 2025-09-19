"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { FiLogOut } from "react-icons/fi";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard" },
  { href: "/case-studies", label: "Case Studies" },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    router.push("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center space-x-8">
      <nav className="hidden md:flex space-x-8">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? "text-blue-600 font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Menu */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleLogout}
          className="cursor-pointer flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          title="Logout">
          <FiLogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
}
