import { Link, useLocation } from "react-router-dom";
import {
  Book,
  Users,
  BookOpenCheck,
  PlusCircle,
  Settings,
  ChevronRight,
} from "lucide-react";

const navigation = [
  { name: "Books", href: "/books", icon: Book },
  { name: "Users", href: "/users", icon: Users },
  { name: "Borrowings", href: "/borrowings", icon: BookOpenCheck },
  { name: "Add Book", href: "/books/new", icon: PlusCircle },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="hidden w-64 bg-white/50 backdrop-blur-sm border-r border-gray-200 md:block">
      <div className="flex h-full flex-col">
        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                  }`}
                >
                  <div
                    className={`mr-3 flex h-6 w-6 items-center justify-center rounded-md ${
                      isActive
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                        : "bg-gray-100 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                  </div>
                  {item.name}
                  <ChevronRight
                    className={`ml-auto h-4 w-4 transition-transform ${
                      isActive ? "text-indigo-600" : "text-gray-400"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600" />
            <div>
              <p className="text-sm font-medium text-gray-700">Admin</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
