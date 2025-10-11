import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import {
    Building,
    Building2,
    Home,
    Layers,
    Calendar,
    Play,
    Users,
    Settings,
    Menu,
    X,
    User,
    LogOut,
    ChevronDown,
    FileText,
    ClipboardList,
    Moon,
    Sun,
    MapPin,
    Package
} from 'lucide-react';

const MainLayout = ({ children, auth }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const { url } = usePage();
    const { isDark, toggleTheme, colors } = useTheme();

    const navigationItems = [
        {
            name: 'Painel',
            href: '/dashboard',
            icon: Home,
            current: url === '/dashboard'
        },
        {
            name: 'Atividades',
            href: '/activities',
            icon: ClipboardList,
            current: url === '/activities'
        },
        {
            name: 'Registros',
            href: '/registros',
            icon: Play,
            current: url === '/registros'
        },
        {
            name: 'Catálogo',
            href: '/catalog',
            icon: Layers,
            current: url === '/catalog'
        },
        {
            name: 'Torres',
            href: '/torres',
            icon: Building2,
            current: url === '/torres'
        },
        {
            name: 'Ambientes',
            href: '/ambientes',
            icon: MapPin,
            current: url === '/ambientes'
        },
        {
            name: 'Itens',
            href: '/items',
            icon: Package,
            current: url === '/items'
        },
        {
            name: 'Parâmetros',
            href: '/parameters',
            icon: Settings,
            current: url === '/parameters',
            requiresRole: 'master'
        }
    ];

    const handleLogout = () => {
        // Here would be the logout API call
        window.location.href = '/login';
    };

    return (
        <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'dark bg-slate-900' : 'bg-gray-50'}`}>
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                </div>
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 bg-gradient-to-br from-blue-900 via-blue-950 to-indigo-950 shadow-lg transform transition-all duration-300 ease-in-out ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 ${
                sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
            } w-64`}>
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-16 items-center justify-between px-6 bg-blue-900/50">
                        <Link href="/dashboard" className={`flex items-center gap-3 ${sidebarCollapsed ? 'lg:justify-center lg:w-full' : ''}`}>
                            <Building className="w-8 h-8 text-white flex-shrink-0" />
                            <span className={`text-white font-bold text-lg ${sidebarCollapsed ? 'lg:hidden' : ''}`}>BuildingMgmt</span>
                        </Link>

                        {/* Mobile close button */}
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-white hover:text-gray-200"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Desktop collapse button - Right edge pill shape */}
                    <div className="hidden lg:block relative h-0">
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="absolute -right-3 top-2 w-6 h-12 bg-gradient-to-br from-blue-900 via-blue-950 to-indigo-950 rounded-r-full flex items-center justify-center text-white hover:bg-blue-800/80 transition-all border border-blue-800/30 shadow-lg"
                        >
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${sidebarCollapsed ? '-rotate-90' : 'rotate-90'}`} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 px-4 pt-2 pb-4">
                        {navigationItems
                            .filter(item => !item.requiresRole || auth?.user?.role === item.requiresRole)
                            .map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                            item.current
                                                ? 'bg-white/20 text-white border-r-4 border-white'
                                                : 'text-blue-100 hover:bg-white/10 hover:text-white'
                                        } ${sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
                                        title={sidebarCollapsed ? item.name : ''}
                                    >
                                        <Icon className={`w-5 h-5 flex-shrink-0 ${item.current ? 'text-white' : 'text-blue-200'}`} />
                                        <span className={sidebarCollapsed ? 'lg:hidden' : ''}>{item.name}</span>
                                    </Link>
                                );
                            })}
                    </nav>

                    {/* Theme Toggle */}
                    <div className="px-4 pb-2">
                        <button
                            onClick={toggleTheme}
                            className={`flex w-full items-center gap-3 px-4 py-3 text-sm text-blue-100 hover:bg-white/10 hover:text-white rounded-lg transition-colors duration-200 ${
                                sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''
                            }`}
                            title={sidebarCollapsed ? (isDark ? 'Modo Claro' : 'Modo Escuro') : ''}
                        >
                            {isDark ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
                            <span className={sidebarCollapsed ? 'lg:hidden' : ''}>{isDark ? 'Modo Claro' : 'Modo Escuro'}</span>
                        </button>
                    </div>

                    {/* User info */}
                    {auth?.user && (
                        <div className="border-t border-blue-800/40 p-4">
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className={`flex w-full items-center gap-3 px-4 py-3 text-sm text-blue-100 hover:bg-white/10 hover:text-white rounded-lg transition-colors duration-200 ${
                                        sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''
                                    }`}
                                    title={sidebarCollapsed ? auth.user.name : ''}
                                >
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                    <div className={`flex-1 text-left ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                                        <div className="font-medium text-white">{auth.user.name}</div>
                                        <div className="text-xs text-blue-200">{auth.user.email}</div>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''} ${sidebarCollapsed ? 'lg:hidden' : ''}`} />
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-blue-950 border border-blue-800/50 rounded-lg shadow-lg">
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-blue-100 hover:bg-white/10 hover:text-white rounded-lg transition-colors duration-200"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sair
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main content */}
            <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
                {/* Top bar */}
                <div className={`sticky top-0 z-10 ${colors.topbar} shadow-sm border-b ${colors.border}`}>
                    <div className="flex h-16 items-center justify-between px-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className={`lg:hidden ${colors.text.secondary} hover:text-gray-900`}
                            >
                                <Menu className="w-6 h-6" />
                            </button>

                            {/* Search bar */}
                            <div className="hidden md:block">
                                <input
                                    type="text"
                                    placeholder="Buscar pedidos, ID de rastreamento..."
                                    className={`w-64 px-3 py-1.5 text-sm border ${colors.border} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isDark ? 'bg-slate-700 text-slate-100 placeholder-slate-400' : 'bg-white text-gray-900 placeholder-gray-500'}`}
                                />
                            </div>
                        </div>

                        {/* User info moved to the right */}
                        {auth?.user && (
                            <div className="hidden lg:flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <div className={`text-sm font-medium ${colors.text.primary}`}>{auth.user.name}</div>
                                    <div className={`text-xs ${colors.text.muted}`}>{auth.user.role || 'admin'}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Page content */}
                <main className="flex-1 px-8 py-6 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;