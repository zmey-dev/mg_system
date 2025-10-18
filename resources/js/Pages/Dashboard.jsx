import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { useTheme } from '@/contexts/ThemeContext';
import { formatDate } from '@/utils/dateFormat';
import {
    Building2,
    Clock,
    CheckCircle,
    Calendar,
    Users,
    FileText,
    TrendingUp,
    Filter,
    Search,
    Plus
} from 'lucide-react';

export default function Dashboard({ auth, stats, recentes, torres }) {
    const { isDark, colors } = useTheme();
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedBuilding, setSelectedBuilding] = useState('all');
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const [selectedActivityMenu, setSelectedActivityMenu] = useState(null);

    const statusCounts = {
        today: stats?.hoje || 0,
        thisWeek: stats?.semana || 0,
        upcoming: stats?.proximas || 0,
        overdue: stats?.atrasadas || 0
    };

    const allActivities = recentes?.map(atividade => ({
        id: atividade.atividade_id,
        title: atividade.atividade_descricao,
        priority: atividade.atividade_prioridade,
        status: atividade.atividade_status === 'ativa' ? 'scheduled' : 'completed',
        technician: atividade.profissional?.profissional_tipo || 'N/A',
        dueDate: atividade.atividade_dtestimada,
        location: `${atividade.item?.ambiente?.torre?.torre_nome || ''} - ${atividade.item?.ambiente?.ambiente_nome || ''}`,
        torreId: atividade.item?.ambiente?.torre?.torre_id
    })) || [];

    // Filter activities based on selected filters
    const recentActivities = allActivities.filter(activity => {
        // Priority filter
        const priorityMatch = selectedFilter === 'all' ||
            (selectedFilter === 'high' && activity.priority === 'alta') ||
            (selectedFilter === 'medium' && activity.priority === 'media') ||
            (selectedFilter === 'low' && activity.priority === 'baixa');

        // Building filter
        const buildingMatch = selectedBuilding === 'all' ||
            activity.torreId?.toString() === selectedBuilding;

        return priorityMatch && buildingMatch;
    });

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'alta':
            case 'high': return 'border border-red-300 text-red-700 dark:text-red-400 dark:border-red-700';
            case 'media':
            case 'medium': return 'border border-amber-300 text-amber-700 dark:text-amber-400 dark:border-amber-700';
            case 'baixa':
            case 'low': return 'border border-teal-300 text-teal-700 dark:text-teal-400 dark:border-teal-700';
            default: return 'border border-gray-400 text-gray-600 dark:text-gray-400';
        }
    };

    const getPriorityIconBg = (priority) => {
        switch (priority) {
            case 'alta':
            case 'high': return 'bg-red-50 dark:bg-red-950/30';
            case 'media':
            case 'medium': return 'bg-amber-50 dark:bg-amber-950/30';
            case 'baixa':
            case 'low': return 'bg-teal-50 dark:bg-teal-950/30';
            default: return 'bg-gray-100 dark:bg-gray-800';
        }
    };

    const getPriorityIconColor = (priority) => {
        switch (priority) {
            case 'alta':
            case 'high': return 'text-red-600 dark:text-red-400';
            case 'media':
            case 'medium': return 'text-amber-600 dark:text-amber-400';
            case 'baixa':
            case 'low': return 'text-teal-600 dark:text-teal-400';
            default: return 'text-gray-600 dark:text-gray-400';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'in_progress': return <Clock className="w-5 h-5" />;
            case 'completed': return <CheckCircle className="w-5 h-5" />;
            case 'scheduled': return <Calendar className="w-5 h-5" />;
            default: return <Clock className="w-5 h-5" />;
        }
    };

    return (
        <MainLayout auth={auth}>
            <Head title="Painel - Gestão de Edifícios" />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className={`text-3xl font-semibold ${colors.text.primary}`}>
                            Painel de Manutenção de Edifícios
                        </h1>
                        <p className={`${colors.text.secondary} mt-1`}>
                            Visão geral da gestão de instalações em tempo real
                        </p>
                    </div>
                    <button
                        onClick={() => router.visit('/activities')}
                        className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-900 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Nova Tarefa</span>
                    </button>
                </div>


                    {/* Status Cards - Minimal Style (like Activities page) */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                        {/* Overdue */}
                        <div className={`${colors.card} border ${colors.border} rounded-lg p-4`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Atrasadas</p>
                                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{statusCounts.overdue}</p>
                                </div>
                                <div className="w-12 h-12 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                            </div>
                        </div>

                        {/* Today */}
                        <div className={`${colors.card} border ${colors.border} rounded-lg p-4`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Hoje</p>
                                    <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{statusCounts.today}</p>
                                </div>
                                <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950/30 rounded-full flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                                </div>
                            </div>
                        </div>

                        {/* This Week */}
                        <div className={`${colors.card} border ${colors.border} rounded-lg p-4`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Esta Semana</p>
                                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{statusCounts.thisWeek}</p>
                                </div>
                                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/30 rounded-full flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                </div>
                            </div>
                        </div>

                        {/* Upcoming */}
                        <div className={`${colors.card} border ${colors.border} rounded-lg p-4`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Próximas</p>
                                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{statusCounts.upcoming}</p>
                                </div>
                                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search - Minimal */}
                    <div className={`${colors.card} rounded-lg border ${colors.border} p-4`}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className={`w-4 h-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 ${colors.text.secondary}`} />
                                    <input
                                        type="text"
                                        placeholder="Buscar tarefas..."
                                        className={`pl-8 pr-3 py-1.5 text-sm border ${colors.border} rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent w-64 ${colors.surface} ${colors.text.primary} placeholder-gray-400`}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <select
                                    value={selectedBuilding}
                                    onChange={(e) => setSelectedBuilding(e.target.value)}
                                    className={`px-2.5 py-1.5 text-sm border ${colors.border} rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent ${colors.surface} ${colors.text.primary}`}
                                >
                                    <option value="all">Todas as Torres</option>
                                    {torres?.map(torre => (
                                        <option key={torre.torre_id} value={torre.torre_id}>
                                            {torre.torre_nome}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={selectedFilter}
                                    onChange={(e) => setSelectedFilter(e.target.value)}
                                    className={`px-2.5 py-1.5 text-sm border ${colors.border} rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent ${colors.surface} ${colors.text.primary}`}
                                >
                                    <option value="all">Todas as Prioridades</option>
                                    <option value="high">Alta</option>
                                    <option value="medium">Média</option>
                                    <option value="low">Baixa</option>
                                </select>

                                <div className="relative">
                                    <button
                                        onClick={() => setShowMoreFilters(!showMoreFilters)}
                                        className={`px-2.5 py-1.5 text-sm border ${colors.border} rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center`}
                                    >
                                        <Filter className="w-3.5 h-3.5 mr-1.5" />
                                        <span className="text-xs">Mais</span>
                                    </button>
                                    {showMoreFilters && (
                                        <div className={`absolute right-0 mt-2 w-48 ${colors.card} border ${colors.border} rounded-lg shadow-lg z-10 p-2`}>
                                            <button
                                                onClick={() => {
                                                    setSelectedFilter('all');
                                                    setSelectedBuilding('all');
                                                    setShowMoreFilters(false);
                                                }}
                                                className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${colors.text.primary}`}
                                            >
                                                Limpar Filtros
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className={`${colors.card} rounded-lg border ${colors.border}`}>
                        <div className={`p-5 border-b ${colors.border}`}>
                            <div className="flex items-center justify-between">
                                <h3 className={`text-lg font-semibold ${colors.text.primary} flex items-center`}>
                                    <FileText className={`w-5 h-5 mr-2 ${colors.text.muted}`} />
                                    Atividades de Manutenção Recentes
                                </h3>
                                <button
                                    onClick={() => router.visit('/activities')}
                                    className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-medium"
                                >
                                    Ver Todas
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1 p-1.5">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className={`p-4 ${colors.card} hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors rounded-md`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getPriorityIconBg(activity.priority)}`}>
                                                <div className={getPriorityIconColor(activity.priority)}>
                                                    {getStatusIcon(activity.status)}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className={`font-medium text-[15px] ${colors.text.primary}`}>{activity.title}</h4>
                                                <div className={`flex items-center gap-3 mt-1.5 text-[13px] ${colors.text.secondary}`}>
                                                    <span className="flex items-center">
                                                        <Users className="w-3.5 h-3.5 mr-1" />
                                                        {activity.technician}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Building2 className="w-3.5 h-3.5 mr-1" />
                                                        {activity.location}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Calendar className="w-3.5 h-3.5 mr-1" />
                                                        {formatDate(activity.dueDate)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getPriorityColor(activity.priority)}`}>
                                                {activity.priority.toUpperCase()}
                                            </span>
                                            <div className="relative">
                                                <button
                                                    onClick={() => setSelectedActivityMenu(selectedActivityMenu === activity.id ? null : activity.id)}
                                                    className={`${colors.text.muted} hover:${colors.text.secondary}`}
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                    </svg>
                                                </button>
                                                {selectedActivityMenu === activity.id && (
                                                    <div className={`absolute right-0 mt-2 w-40 ${colors.card} border ${colors.border} rounded-lg shadow-lg z-10 py-1`}>
                                                        <button
                                                            onClick={() => {
                                                                router.visit(`/activities/${activity.id}`);
                                                                setSelectedActivityMenu(null);
                                                            }}
                                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${colors.text.primary}`}
                                                        >
                                                            Ver Detalhes
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                router.visit('/activities');
                                                                setSelectedActivityMenu(null);
                                                            }}
                                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${colors.text.primary}`}
                                                        >
                                                            Ir para Atividades
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
            </div>
        </MainLayout>
    );
}
