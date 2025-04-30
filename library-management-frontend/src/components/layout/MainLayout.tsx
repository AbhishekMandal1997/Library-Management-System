import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Menu, Bell, LogOut } from 'lucide-react';
import { useState } from 'react';

const MainLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center space-x-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                                    <BookOpen className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    LibraryMS
                                </span>
                            </Link>
                        </div>

                        <div className="hidden md:flex md:items-center md:space-x-4">
                            <nav className="flex space-x-1">
                                <Link
                                    to="/books"
                                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-indigo-600"
                                >
                                    Books
                                </Link>
                                {user?.role === 'admin' && (
                                    <Link
                                        to="/books/new"
                                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-indigo-600"
                                    >
                                        Manage Books
                                    </Link>
                                )}
                            </nav>
                            <div className="flex items-center space-x-4">
                                {!user ? (
                                    <>
                                        <Link
                                            to="/login"
                                            className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-indigo-600"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            className="rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:from-indigo-500 hover:to-purple-500"
                                        >
                                            Register
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <button className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-indigo-600">
                                            <Bell className="h-5 w-5" />
                                            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                                3
                                            </span>
                                        </button>
                                        <div className="relative">
                                            <button
                                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                                className="flex items-center space-x-2 rounded-full p-1 hover:bg-gray-100"
                                            >
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600" />
                                                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                                            </button>
                                            {isProfileMenuOpen && (
                                                <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        <LogOut className="mr-2 h-4 w-4" />
                                                        Sign out
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="md:hidden">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="space-y-1 px-2 pb-3 pt-2">
                            <Link
                                to="/books"
                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                            >
                                Books
                            </Link>
                            {user?.role === 'admin' && (
                                <Link
                                    to="/books/new"
                                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                                >
                                    Manage Books
                                </Link>
                            )}
                            {!user ? (
                                <>
                                    <Link
                                        to="/login"
                                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2 text-base font-medium text-white shadow-sm hover:from-indigo-500 hover:to-purple-500"
                                    >
                                        Register
                                    </Link>
                                </>
                            ) : (
                                <button
                                    onClick={handleLogout}
                                    className="block w-full rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
                                >
                                    Sign out
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </header>

            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
