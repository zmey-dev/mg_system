import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/Components/ui/button';
import {
    Users as UsersIcon,
    Plus,
    Edit,
    Trash2,
    Search,
    Mail,
    Shield,
    Building2,
    CheckCircle,
    XCircle
} from 'lucide-react';

export default function Index({ auth, users }) {
    const { isDark, colors } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    const filteredUsers = users.data.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'master': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
            case 'sindico': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'gestor': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'auditor': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
        }
    };

    const getRoleLabel = (role) => {
        const labels = {
            master: 'Master',
            sindico: 'Síndico',
            gestor: 'Gestor',
            auditor: 'Auditor'
        };
        return labels[role] || role;
    };

    const handleDelete = (id, name) => {
        if (confirm(`Tem certeza que deseja excluir o usuário "${name}"?`)) {
            router.delete(route('users.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <MainLayout auth={auth}>
            <Head title="User Management" />

            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                        <h1 className={`text-2xl sm:text-3xl font-semibold ${colors.text.primary}`}>
                            User Management
                        </h1>
                        <p className={`${colors.text.secondary} mt-1 text-sm sm:text-base`}>
                            Manage system users and their permissions
                        </p>
                    </div>
                    <Button
                        onClick={() => router.visit(route('users.create'))}
                        className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-900 text-white shadow-sm w-full sm:w-auto justify-center"
                    >
                        <Plus className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">New User</span>
                        <span className="sm:hidden ml-2">New User</span>
                    </Button>
                </div>

                {/* Filters */}
                <div className={`${colors.card} rounded-lg border ${colors.border} p-3 sm:p-4`}>
                    <div className="flex flex-col gap-2 sm:gap-3">
                        <div className="relative w-full">
                            <Search className={`w-4 h-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 ${colors.text.secondary}`} />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`pl-8 pr-3 py-2 text-sm border ${colors.border} rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent w-full ${colors.surface} ${colors.text.primary} placeholder-gray-400`}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                className={`px-2.5 py-2 text-sm border ${colors.border} rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent ${colors.surface} ${colors.text.primary} w-full sm:flex-1 min-w-0`}
                            >
                                <option value="all">All Roles</option>
                                <option value="master">Master</option>
                                <option value="sindico">Síndico</option>
                                <option value="gestor">Gestor</option>
                                <option value="auditor">Auditor</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users List */}
                <div className={`${colors.card} rounded-lg border ${colors.border}`}>
                    <div className={`p-4 sm:p-5 border-b ${colors.border}`}>
                        <h3 className={`text-base sm:text-lg font-semibold ${colors.text.primary} flex items-center`}>
                            <UsersIcon className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${colors.text.muted}`} />
                            Users ({filteredUsers.length})
                        </h3>
                    </div>

                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredUsers.map((user) => (
                            <div key={user.id} className={`p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors`}>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm sm:text-lg flex-shrink-0">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className={`font-semibold text-sm sm:text-base ${colors.text.primary} truncate`}>
                                                {user.name}
                                            </h4>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                                <div className={`flex items-center gap-1.5 text-xs sm:text-sm ${colors.text.secondary}`}>
                                                    <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                                    <span className="truncate">{user.email}</span>
                                                </div>
                                                {user.empreendimento && (
                                                    <div className={`flex items-center gap-1.5 text-xs sm:text-sm ${colors.text.secondary}`}>
                                                        <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                                                        <span className="truncate">{user.empreendimento.empreendimento_nome}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                            <Shield className="w-3 h-3 inline mr-1" />
                                            {getRoleLabel(user.role)}
                                        </span>

                                        {user.is_active ? (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                <CheckCircle className="w-3 h-3 inline mr-1" />
                                                Active
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                                <XCircle className="w-3 h-3 inline mr-1" />
                                                Inactive
                                            </span>
                                        )}

                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.visit(route('users.edit', user.id))}
                                                className="h-8 px-2 sm:px-3"
                                            >
                                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span className="hidden sm:inline ml-1">Edit</span>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(user.id, user.name)}
                                                className="h-8 px-2 sm:px-3 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
                                            >
                                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span className="hidden sm:inline ml-1">Delete</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredUsers.length === 0 && (
                            <div className="p-12 text-center">
                                <UsersIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <h3 className={`text-lg font-medium ${colors.text.primary} mb-1`}>
                                    No users found
                                </h3>
                                <p className={`text-sm ${colors.text.secondary}`}>
                                    Try adjusting your search or filter criteria
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {users.links && users.links.length > 3 && (
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                                {users.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => link.url && router.visit(link.url)}
                                        disabled={!link.url}
                                        className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                ? `${colors.surface} ${colors.text.primary} hover:bg-gray-100 dark:hover:bg-gray-800`
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
