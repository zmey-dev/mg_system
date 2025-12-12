import React from "react";
import MainLayout from "@/Layouts/MainLayout";
import { Head, router } from "@inertiajs/react";
import {
    ArrowLeft,
    Calendar,
    User,
    Clock,
    CheckCircle,
    FileText,
    MapPin,
    Tag,
    Wrench,
    AlertCircle,
    Image as ImageIcon,
    Download
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { formatDate } from "@/utils/dateFormat";
import { useTheme } from "@/contexts/ThemeContext";

export default function RegistroDetail({ auth, registro }) {
    const { isDark, colors } = useTheme();

    const getStatusBadge = (status) => {
        const badges = {
            em_andamento: {
                label: "Em Andamento",
                className: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
            },
            concluida: {
                label: "Concluída",
                className: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800"
            },
        };
        return badges[status] || badges.em_andamento;
    };

    const statusBadge = getStatusBadge(registro.status);

    return (
        <MainLayout auth={auth}>
            <Head title="Detalhes do Registro" />

            <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="outline"
                        onClick={() => router.visit(route('registros.index'))}
                        className="mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar aos Registros
                    </Button>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className={`text-2xl sm:text-3xl font-bold ${colors.text.primary}`}>
                                Detalhes do Registro
                            </h1>
                            <p className={`text-sm ${colors.text.secondary} mt-1`}>
                                ID: #{registro.atividaderegistro_id}
                            </p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusBadge.className} self-start sm:self-center`}>
                            {statusBadge.label}
                        </span>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Activity Info */}
                        <div className={`${colors.card} rounded-lg shadow-sm border ${colors.border} p-6`}>
                            <h2 className={`text-lg font-semibold ${colors.text.primary} mb-4`}>
                                Informações da Atividade
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className={`text-xs font-medium ${colors.text.secondary} uppercase tracking-wider`}>
                                        Descrição
                                    </label>
                                    <p className={`mt-1 text-base ${colors.text.primary}`}>
                                        {registro.atividade?.atividade_descricao || 'N/A'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={`text-xs font-medium ${colors.text.secondary} uppercase tracking-wider`}>
                                            Item
                                        </label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Tag className="w-4 h-4 text-gray-400" />
                                            <p className={`text-sm ${colors.text.primary}`}>
                                                {registro.atividade?.item?.item_nome || 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className={`text-xs font-medium ${colors.text.secondary} uppercase tracking-wider`}>
                                            Localização
                                        </label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            <p className={`text-sm ${colors.text.primary}`}>
                                                {registro.atividade?.item?.ambiente?.torre?.torre_nome} - {registro.atividade?.item?.ambiente?.ambiente_nome}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className={`text-xs font-medium ${colors.text.secondary} uppercase tracking-wider`}>
                                            Sistema / Subsistema
                                        </label>
                                        <p className={`text-sm ${colors.text.primary} mt-1`}>
                                            {registro.atividade?.item?.subgrupo?.grupo?.itemgrupo_nome || 'N/A'} / {registro.atividade?.item?.subgrupo?.itemsubgrupo_nome || 'N/A'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className={`text-xs font-medium ${colors.text.secondary} uppercase tracking-wider`}>
                                            Profissional
                                        </label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Wrench className="w-4 h-4 text-gray-400" />
                                            <p className={`text-sm ${colors.text.primary}`}>
                                                {registro.atividade?.profissional?.profissional_tipo || 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className={`text-xs font-medium ${colors.text.secondary} uppercase tracking-wider`}>
                                            Tipo / Origem
                                        </label>
                                        <p className={`text-sm ${colors.text.primary} mt-1`}>
                                            {registro.atividade?.tipo?.tipo_nome || 'N/A'} / {registro.atividade?.origem?.origem_nome || 'N/A'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className={`text-xs font-medium ${colors.text.secondary} uppercase tracking-wider`}>
                                            Período
                                        </label>
                                        <p className={`text-sm ${colors.text.primary} mt-1`}>
                                            {registro.atividade?.periodo?.periodo_nome || 'N/A'} ({registro.atividade?.periodo?.periodo_dias || 0} dias)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Execution Notes */}
                        {registro.atividaderegistro_observacoes && (
                            <div className={`${colors.card} rounded-lg shadow-sm border ${colors.border} p-6`}>
                                <h2 className={`text-lg font-semibold ${colors.text.primary} mb-4 flex items-center gap-2`}>
                                    <FileText className="w-5 h-5" />
                                    Notas de Execução
                                </h2>
                                <div className={`${colors.surface} rounded-lg p-4`}>
                                    <p className={`text-sm ${colors.text.primary} whitespace-pre-wrap`}>
                                        {registro.atividaderegistro_observacoes}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Attachments */}
                        {registro.attachments && registro.attachments.length > 0 && (
                            <div className={`${colors.card} rounded-lg shadow-sm border ${colors.border} p-6`}>
                                <h2 className={`text-lg font-semibold ${colors.text.primary} mb-4 flex items-center gap-2`}>
                                    <ImageIcon className="w-5 h-5" />
                                    Anexos ({registro.attachments.length})
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {registro.attachments.map((attachment, index) => (
                                        <div key={index} className="relative group">
                                            {attachment.attachment_tipo === 'photo' ? (
                                                <div className="relative">
                                                    <img
                                                        src={`/storage/${attachment.attachment_caminho}`}
                                                        alt={attachment.attachment_nome}
                                                        className="w-full h-32 object-cover rounded-lg"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                    <div className="hidden w-full h-32 bg-red-100 dark:bg-red-900/30 rounded-lg items-center justify-center">
                                                        <span className="text-xs text-red-600 dark:text-red-400">Image not found</span>
                                                    </div>
                                                    <a
                                                        href={route('attachments.download', attachment.attachment_id)}
                                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                                                    >
                                                        <Download className="w-6 h-6 text-white" />
                                                    </a>
                                                </div>
                                            ) : (
                                                <a
                                                    href={route('attachments.download', attachment.attachment_id)}
                                                    className="block w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                >
                                                    <div className="w-full h-full flex flex-col items-center justify-center">
                                                        <FileText className="w-8 h-8 text-gray-400 mb-2" />
                                                        <span className="text-xs text-gray-500 dark:text-gray-400 text-center px-2 truncate w-full">
                                                            {attachment.attachment_nome}
                                                        </span>
                                                        <Download className="w-4 h-4 text-gray-400 mt-1" />
                                                    </div>
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Timeline & Meta */}
                    <div className="space-y-6">
                        {/* Timeline */}
                        <div className={`${colors.card} rounded-lg shadow-sm border ${colors.border} p-6`}>
                            <h2 className={`text-lg font-semibold ${colors.text.primary} mb-4`}>
                                Linha do Tempo
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-xs font-medium ${colors.text.secondary}`}>Início</p>
                                        <p className={`text-sm ${colors.text.primary} font-medium`}>
                                            {formatDate(registro.atividaderegistro_dtinicio)}
                                        </p>
                                    </div>
                                </div>

                                {registro.atividaderegistro_dtrealizada && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-xs font-medium ${colors.text.secondary}`}>Conclusão</p>
                                            <p className={`text-sm ${colors.text.primary} font-medium`}>
                                                {formatDate(registro.atividaderegistro_dtrealizada)}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {registro.atividaderegistro_dtproxima && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                            <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-xs font-medium ${colors.text.secondary}`}>Próxima Execução</p>
                                            <p className={`text-sm ${colors.text.primary} font-medium`}>
                                                {formatDate(registro.atividaderegistro_dtproxima)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Executor Info */}
                        <div className={`${colors.card} rounded-lg shadow-sm border ${colors.border} p-6`}>
                            <h2 className={`text-lg font-semibold ${colors.text.primary} mb-4 flex items-center gap-2`}>
                                <User className="w-5 h-5" />
                                Executor
                            </h2>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                                        {registro.usuario?.name?.charAt(0) || 'U'}
                                    </span>
                                </div>
                                <div>
                                    <p className={`text-sm font-medium ${colors.text.primary}`}>
                                        {registro.usuario?.name || 'N/A'}
                                    </p>
                                    <p className={`text-xs ${colors.text.secondary}`}>
                                        {registro.usuario?.email || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Costs (if available) */}
                        {registro.costs_json && (
                            <div className={`${colors.card} rounded-lg shadow-sm border ${colors.border} p-6`}>
                                <h2 className={`text-lg font-semibold ${colors.text.primary} mb-4`}>
                                    Custos
                                </h2>
                                <div className={`${colors.surface} rounded-lg p-4`}>
                                    <pre className={`text-xs ${colors.text.primary} overflow-x-auto`}>
                                        {JSON.stringify(registro.costs_json, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
