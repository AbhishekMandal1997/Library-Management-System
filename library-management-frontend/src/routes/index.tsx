import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Login from '../pages/Login';
import Register from '../pages/Register';
import MainLayout from '../components/layout/MainLayout';
import Books from '../pages/Books';
import AddEditBook from '../pages/AddEditBook';
import Home from '../pages/Home';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    return user ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    return user?.role === 'admin' ? <>{children}</> : <Navigate to="/" />;
};

const AppRoutes: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes */}
                <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
                    <Route index element={<Home />} />
                    <Route path="books">
                        <Route index element={<Books />} />
                        <Route path="new" element={<AdminRoute><AddEditBook /></AdminRoute>} />
                        <Route path=":id" element={<AdminRoute><AddEditBook /></AdminRoute>} />
                    </Route>
                </Route>
            </Routes>
            <Toaster position="top-right" />
        </div>
    );
};

export default AppRoutes; 