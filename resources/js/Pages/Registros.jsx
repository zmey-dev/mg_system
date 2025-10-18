import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { router } from "@inertiajs/react";
import { Play, CheckCircle, Clock, FileText, User, Calendar, Search } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { formatDate } from "@/utils/dateFormat";

const Registros = ({ auth, registros, filters }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [dateFilter, setDateFilter] = useState(filters?.date_filter || "all");
    const [startDate, setStartDate] = useState(filters?.start_date || "");
    const [endDate, setEndDate] = useState(filters?.end_date || "");

    const getStatusBadge = (status) => {
        const badges = {
            em_andamento: { label: "Em Andamento", className: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
            concluida: { label: "Concluída", className: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" },
        };
        const badge = badges[status] || badges.em_andamento;
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded ${badge.className}`}>
                {badge.label}
            </span>
        );
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "em_andamento":
                return <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
            case "concluida":
                return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
            default:
                return <Play className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
        }
    };


    const handleDateFilterChange = (value) => {
        setDateFilter(value);
        if (value !== 'custom') {
            router.get(route('registros.index'), {
                date_filter: value !== 'all' ? value : undefined,
            }, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handleCustomDateApply = () => {
        if (startDate && endDate) {
            router.get(route('registros.index'), {
                date_filter: 'custom',
                start_date: startDate,
                end_date: endDate,
            }, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const filteredRegistros = registros.data?.filter(registro => {
        const matchesSearch =
            registro.atividade?.atividade_descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            registro.atividade?.item?.item_nome?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === "all" || registro.status === filterStatus;

        return matchesSearch && matchesStatus;
    }) || [];

    return (
        <MainLayout auth={auth}>
            <div className="py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Registros de Execução</h1>
                </div>

                {/* Date Filters */}
                <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 p-4">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <select
                                value={dateFilter}
                                onChange={(e) => handleDateFilterChange(e.target.value)}
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            >
                                <option value="all">Todos os Períodos</option>
                                <option value="today">Hoje</option>
                                <option value="this_week">Esta Semana</option>
                                <option value="this_month">Este Mês</option>
                                <option value="last_7_days">Últimos 7 Dias</option>
                                <option value="last_15_days">Últimos 15 Dias</option>
                                <option value="last_30_days">Últimos 30 Dias</option>
                                <option value="custom">Período Personalizado</option>
                            </select>
                        </div>

                        {dateFilter === 'custom' && (
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="flex-1">
                                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        Data Inicial
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        Data Final
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        onClick={handleCustomDateApply}
                                        disabled={!startDate || !endDate}
                                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        Aplicar
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search and Status Filters */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar registros..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base w-full sm:w-auto"
                    >
                        <option value="all">Todos os Status</option>
                        <option value="em_andamento">Em Andamento</option>
                        <option value="concluida">Concluída</option>
                    </select>
                </div>

                {/* Registros List */}
                <div className="space-y-4">
                    {filteredRegistros.map((registro) => (
                        <div
                            key={registro.atividaderegistro_id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                                    <div className="p-2 sm:p-3 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0">
                                        {getStatusIcon(registro.status)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                            <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white break-words">
                                                {registro.atividade?.atividade_descricao || "Sem descrição"}
                                            </h3>
                                            {getStatusBadge(registro.status)}
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                                            <div className="flex items-center gap-1">
                                                <FileText className="w-4 h-4 flex-shrink-0" />
                                                <span className="truncate">{registro.atividade?.item?.item_nome || "Item não especificado"}</span>
                                            </div>
                                            {registro.atividade?.item?.ambiente?.torre && (
                                                <div className="text-gray-500 dark:text-gray-400 truncate">
                                                    {registro.atividade.item.ambiente.torre.torre_nome} - {registro.atividade.item.ambiente.ambiente_nome}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                                <div className="flex items-start gap-2">
                                    <Calendar className="w-4 h-4 mt-1 text-gray-400" />
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Início</div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatDate(registro.atividaderegistro_dtinicio)}
                                        </div>
                                    </div>
                                </div>

                                {registro.atividaderegistro_dtrealizada && (
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 mt-1 text-gray-400" />
                                        <div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Concluída</div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {formatDate(registro.atividaderegistro_dtrealizada)}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {registro.atividaderegistro_dtproxima && (
                                    <div className="flex items-start gap-2">
                                        <Clock className="w-4 h-4 mt-1 text-gray-400" />
                                        <div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Próxima</div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {formatDate(registro.atividaderegistro_dtproxima)}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {registro.usuario && (
                                    <div className="flex items-start gap-2">
                                        <User className="w-4 h-4 mt-1 text-gray-400" />
                                        <div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Executor</div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {registro.usuario.name}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {registro.atividaderegistro_observacoes && (
                                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Observações
                                    </div>
                                    <div className="text-sm text-gray-700 dark:text-gray-200">
                                        {registro.atividaderegistro_observacoes}
                                    </div>
                                </div>
                            )}

                            {registro.attachments && registro.attachments.length > 0 && (
                                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <FileText className="w-4 h-4" />
                                    {registro.attachments.length} anexo(s)
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {filteredRegistros.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <Play className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-base sm:text-lg font-medium mb-2">Nenhum registro encontrado</p>
                        <p className="text-xs sm:text-sm px-4">
                            {searchTerm || filterStatus !== "all"
                                ? "Tente ajustar os filtros de busca"
                                : "Execute atividades para criar registros"}
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {registros.links && registros.links.length > 3 && (
                    <div className="mt-6 flex flex-wrap justify-center gap-1 sm:gap-2">
                        {registros.links.map((link, index) => (
                            <button
                                key={index}
                                onClick={() => link.url && router.visit(link.url)}
                                disabled={!link.url}
                                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm ${
                                    link.active
                                        ? 'bg-blue-600 text-white'
                                        : link.url
                                        ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default Registros;
