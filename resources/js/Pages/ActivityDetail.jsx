import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import { useTheme } from '@/contexts/ThemeContext';
import { formatDate, formatDateTime } from '@/utils/dateFormat';
import {
    ArrowLeft,
    Calendar,
    User,
    Building2,
    Clock,
    FileText,
    MapPin,
    Package,
    Tag,
    AlertCircle
} from 'lucide-react';

export default function ActivityDetail({ auth, atividade }) {
    const { isDark, colors } = useTheme();

    const getPriorityBadge = (priority) => {
        const badges = {
            alta: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700',
            media: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700',
            baixa: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-300 dark:border-teal-700'
        };
        return badges[priority] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
    };

    const getStatusBadge = (status) => {
        const badges = {
            ativa: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700',
            bloqueada: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700',
            concluida: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700'
        };
        return badges[status] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
    };

    const getStatusLabel = (status) => {
        const labels = {
            ativa: 'Ativa',
            bloqueada: 'Bloqueada',
            concluida: 'Concluída'
        };
        return labels[status] || status;
    };

    return (
        <MainLayout auth={auth}>
            <Head title={`Atividade: ${atividade.atividade_descricao}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <button
                            onClick={() => router.visit('/activities')}
                            className={`flex items-center gap-2 mb-3 text-sm ${colors.text.secondary} hover:${colors.text.primary} transition-colors`}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Voltar para Atividades
                        </button>
                        <h1 className={`text-2xl sm:text-3xl font-bold ${colors.text.primary} mb-2`}>
                            {atividade.atividade_descricao}
                        </h1>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityBadge(atividade.atividade_prioridade)}`}>
                                {atividade.atividade_prioridade?.toUpperCase()}
                            </span>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadge(atividade.atividade_status)}`}>
                                {getStatusLabel(atividade.atividade_status)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - 2/3 width */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Location & Item Info */}
                        <div className={`${colors.card} rounded-xl border ${colors.border} p-6`}>
                            <h2 className={`text-lg font-semibold ${colors.text.primary} mb-4 flex items-center gap-2`}>
                                <MapPin className="w-5 h-5" />
                                Localização e Item
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg ${colors.surface}`}>
                                        <Building2 className={`w-5 h-5 ${colors.text.muted}`} />
                                    </div>
                                    <div>
                                        <div className={`text-xs ${colors.text.secondary} mb-1`}>Torre</div>
                                        <div className={`font-medium ${colors.text.primary}`}>
                                            {atividade.item?.ambiente?.torre?.torre_nome || '-'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg ${colors.surface}`}>
                                        <MapPin className={`w-5 h-5 ${colors.text.muted}`} />
                                    </div>
                                    <div>
                                        <div className={`text-xs ${colors.text.secondary} mb-1`}>Ambiente</div>
                                        <div className={`font-medium ${colors.text.primary}`}>
                                            {atividade.item?.ambiente?.ambiente_nome || '-'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg ${colors.surface}`}>
                                        <Package className={`w-5 h-5 ${colors.text.muted}`} />
                                    </div>
                                    <div>
                                        <div className={`text-xs ${colors.text.secondary} mb-1`}>Item</div>
                                        <div className={`font-medium ${colors.text.primary}`}>
                                            {atividade.item?.item_nome || '-'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Execution Records */}
                        {atividade.registros && atividade.registros.length > 0 && (
                            <div className={`${colors.card} rounded-xl border ${colors.border} p-6`}>
                                <h2 className={`text-lg font-semibold ${colors.text.primary} mb-4 flex items-center gap-2`}>
                                    <FileText className="w-5 h-5" />
                                    Registros de Execução ({atividade.registros.length})
                                </h2>
                                <div className="space-y-3">
                                    {atividade.registros.map((registro) => (
                                        <div
                                            key={registro.atividaderegistro_id}
                                            className={`p-4 rounded-lg border ${colors.border} ${colors.surfaceHover} transition-colors`}
                                        >
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <div className="flex items-center gap-2">
                                                    <User className={`w-4 h-4 ${colors.text.muted}`} />
                                                    <span className={`font-medium ${colors.text.primary}`}>
                                                        {registro.usuario?.name || 'Desconhecido'}
                                                    </span>
                                                </div>
                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                    registro.status === 'concluida'
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                                }`}>
                                                    {registro.status === 'concluida' ? 'Concluída' : 'Em Andamento'}
                                                </span>
                                            </div>
                                            <div className={`text-sm ${colors.text.secondary} space-y-1`}>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    Início: {formatDateTime(registro.atividaderegistro_dtinicio)}
                                                </div>
                                                {registro.atividaderegistro_dtrealizada && (
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        Conclusão: {formatDateTime(registro.atividaderegistro_dtrealizada)}
                                                    </div>
                                                )}
                                                {registro.atividaderegistro_observacoes && (
                                                    <div className={`mt-2 p-2 rounded ${colors.surface}`}>
                                                        {registro.atividaderegistro_observacoes}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - 1/3 width */}
                    <div className="space-y-6">
                        {/* Details Card */}
                        <div className={`${colors.card} rounded-xl border ${colors.border} p-6`}>
                            <h2 className={`text-lg font-semibold ${colors.text.primary} mb-4`}>
                                Detalhes
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <div className={`text-xs ${colors.text.secondary} mb-1 flex items-center gap-1.5`}>
                                        <Calendar className="w-3.5 h-3.5" />
                                        Data Estimada
                                    </div>
                                    <div className={`font-medium ${colors.text.primary}`}>
                                        {formatDate(atividade.atividade_dtestimada)}
                                    </div>
                                </div>

                                <div>
                                    <div className={`text-xs ${colors.text.secondary} mb-1 flex items-center gap-1.5`}>
                                        <User className="w-3.5 h-3.5" />
                                        Profissional
                                    </div>
                                    <div className={`font-medium ${colors.text.primary}`}>
                                        {atividade.profissional?.profissional_tipo || 'N/A'}
                                    </div>
                                </div>

                                <div>
                                    <div className={`text-xs ${colors.text.secondary} mb-1 flex items-center gap-1.5`}>
                                        <Tag className="w-3.5 h-3.5" />
                                        Tipo
                                    </div>
                                    <div className={`font-medium ${colors.text.primary}`}>
                                        {atividade.tipo?.tipo_nome || 'N/A'}
                                    </div>
                                </div>

                                <div>
                                    <div className={`text-xs ${colors.text.secondary} mb-1 flex items-center gap-1.5`}>
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        Origem
                                    </div>
                                    <div className={`font-medium ${colors.text.primary}`}>
                                        {atividade.origem?.origem_nome || 'N/A'}
                                    </div>
                                </div>

                                {atividade.periodo && (
                                    <div>
                                        <div className={`text-xs ${colors.text.secondary} mb-1 flex items-center gap-1.5`}>
                                            <Clock className="w-3.5 h-3.5" />
                                            Período
                                        </div>
                                        <div className={`font-medium ${colors.text.primary}`}>
                                            {atividade.periodo.periodo_nome}
                                            <span className={`text-sm ${colors.text.secondary}`}>
                                                {' '}({atividade.periodo.periodo_dias} dias)
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {atividade.doctoTipo && (
                                    <div>
                                        <div className={`text-xs ${colors.text.secondary} mb-1 flex items-center gap-1.5`}>
                                            <FileText className="w-3.5 h-3.5" />
                                            Tipo de Documento
                                        </div>
                                        <div className={`font-medium ${colors.text.primary}`}>
                                            {atividade.doctoTipo.doctotipo_nome}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Meta Info Card */}
                        <div className={`${colors.card} rounded-xl border ${colors.border} p-6`}>
                            <h2 className={`text-lg font-semibold ${colors.text.primary} mb-4`}>
                                Informações
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <div className={`text-xs ${colors.text.secondary} mb-1`}>
                                        Criado por
                                    </div>
                                    <div className={`font-medium ${colors.text.primary}`}>
                                        {atividade.creator?.name || 'Desconhecido'}
                                    </div>
                                </div>
                                <div>
                                    <div className={`text-xs ${colors.text.secondary} mb-1`}>
                                        Data de Criação
                                    </div>
                                    <div className={`font-medium ${colors.text.primary}`}>
                                        {formatDateTime(atividade.created_at)}
                                    </div>
                                </div>
                                {atividade.updated_at && (
                                    <div>
                                        <div className={`text-xs ${colors.text.secondary} mb-1`}>
                                            Última Atualização
                                        </div>
                                        <div className={`font-medium ${colors.text.primary}`}>
                                            {formatDateTime(atividade.updated_at)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
