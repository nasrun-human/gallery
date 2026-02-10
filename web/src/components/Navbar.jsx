import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { LogOut, Upload, Heart, Home, User, Plus } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600';
    const isMobileActive = (path) => location.pathname === path ? 'text-indigo-600 scale-110 transition-transform' : 'text-gray-400';

    return (
        <>
            {/* Desktop Navbar */}
            <nav className="hidden sm:block fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-2">
                            <Link to="/" className="flex items-center gap-2 group">
                                <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:rotate-6 transition-transform">
                                    <div className="w-5 h-5 border-2 border-white rounded-md"></div>
                                </div>
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                    GalleryPro
                                </span>
                            </Link>
                        </div>
                        
                        {user ? (
                            <div className="flex items-center space-x-6">
                                <Link to="/" className={`flex items-center space-x-1 font-medium transition-colors ${isActive('/')}`}>
                                    <Home className="w-5 h-5" />
                                    <span>Home</span>
                                </Link>
                                <Link to="/saved" className={`flex items-center space-x-1 font-medium transition-colors ${isActive('/saved')}`}>
                                    <Heart className="w-5 h-5" />
                                    <span>Saved</span>
                                </Link>
                                <Link 
                                    to="/upload" 
                                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all hover:shadow-lg flex items-center gap-2"
                                >
                                    <Upload className="w-4 h-4" />
                                    <span>Upload</span>
                                </Link>
                                <div className="flex items-center space-x-4 pl-6 border-l border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                                            {user.username[0].toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 hidden lg:block">{user.username}</span>
                                    </div>
                                    <button 
                                        onClick={handleLogout}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Log in</Link>
                                <Link to="/register" className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all hover:shadow-lg">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            
            {/* Spacer for Fixed Desktop Nav */}
            <div className="h-16 hidden sm:block"></div>

            {/* Mobile Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 sm:hidden z-50 flex justify-around py-3 pb-safe shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)]">
                <Link to="/" className={`flex flex-col items-center gap-1 w-16 ${isMobileActive('/')}`}>
                    <Home className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Home</span>
                </Link>
                
                <Link to="/upload" className="relative -top-5">
                    <div className="bg-gray-900 text-white p-4 rounded-full shadow-xl shadow-indigo-500/20 active:scale-95 transition-transform border-4 border-white">
                        <Plus className="w-6 h-6" />
                    </div>
                </Link>
                
                <Link to="/saved" className={`flex flex-col items-center gap-1 w-16 ${isMobileActive('/saved')}`}>
                    <Heart className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Saved</span>
                </Link>
            </div>
            
            {/* Spacer for Mobile Bottom Nav */}
            <div className="h-24 sm:hidden"></div>
        </>
    );
};

export default Navbar;
