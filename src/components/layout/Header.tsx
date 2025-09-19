import Link from "next/link";
import { Navigation } from "./Navigation";

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link href={"/"} className="text-2xl font-bold text-gray-900">
            Surescalesolutions Admin
          </Link>
          <Navigation />
        </div>
      </div>
    </header>
  );
}
