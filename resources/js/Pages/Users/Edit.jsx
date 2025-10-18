import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/Components/ui/button';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { ArrowLeft, Save } from 'lucide-react';

export default function Edit({ auth, user, empreendimentos }) {
    const { isDark, colors } = useTheme();
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'gestor',
        empreendimento_id: user.empreendimento_id || '',
        is_active: user.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    return (
        <MainLayout auth={auth}>
            <Head title="Edit User" />

            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => router.visit(route('users.index'))}
                        className={`flex items-center gap-2 text-sm ${colors.text.secondary} hover:${colors.text.primary} w-fit`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Users
                    </button>
                    <div>
                        <h1 className={`text-2xl sm:text-3xl font-semibold ${colors.text.primary}`}>
                            Edit User
                        </h1>
                        <p className={`${colors.text.secondary} mt-1 text-sm sm:text-base`}>
                            Update user information
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className={`${colors.card} rounded-lg border ${colors.border} p-4 sm:p-6`}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                                <InputLabel htmlFor="name" value="Name *" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    autoFocus
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            {/* Email */}
                            <div>
                                <InputLabel htmlFor="email" value="Email *" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Role */}
                            <div>
                                <InputLabel htmlFor="role" value="Role *" />
                                <select
                                    id="role"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className={`mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm`}
                                    required
                                >
                                    <option value="gestor">Gestor</option>
                                    <option value="sindico">Síndico</option>
                                    <option value="auditor">Auditor</option>
                                    <option value="master">Master</option>
                                </select>
                                <InputError message={errors.role} className="mt-2" />
                            </div>

                            {/* Empreendimento */}
                            <div>
                                <InputLabel htmlFor="empreendimento_id" value="Empreendimento" />
                                <select
                                    id="empreendimento_id"
                                    value={data.empreendimento_id}
                                    onChange={(e) => setData('empreendimento_id', e.target.value)}
                                    className={`mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm`}
                                >
                                    <option value="">None (Master Access)</option>
                                    {empreendimentos.map((emp) => (
                                        <option key={emp.empreendimento_id} value={emp.empreendimento_id}>
                                            {emp.empreendimento_nome}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.empreendimento_id} className="mt-2" />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Leave empty for master users
                                </p>
                            </div>

                            {/* Active Status */}
                            <div className="md:col-span-2">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                    />
                                    <span className={`ml-2 text-sm ${colors.text.primary}`}>
                                        Active (user can login)
                                    </span>
                                </label>
                                <InputError message={errors.is_active} className="mt-2" />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-900 text-white shadow-sm w-full sm:w-auto justify-center"
                            >
                                <Save className="w-4 h-4 sm:mr-2" />
                                <span>Update User</span>
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.visit(route('users.index'))}
                                className="w-full sm:w-auto justify-center"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
