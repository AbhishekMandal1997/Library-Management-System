import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex space-x-4">
                    <Link to="/" className="hover:text-blue-200">
                        Home
                    </Link>
                    {user?.role === 'admin' && (
                        <Link to="/manage-books" className="hover:text-blue-200">
                            Manage Books
                        </Link>
                    )}
                </div>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <span>Welcome, {user.name}</span>
                            <button
                                onClick={logout}
                                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-blue-200">
                                Login
                            </Link>
                            <Link to="/register" className="hover:text-blue-200">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navigation; 