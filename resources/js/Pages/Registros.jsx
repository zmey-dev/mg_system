import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { router } from "@inertiajs/react";
import { Play, CheckCircle, Clock, FileText, User, Calendar, Search, X, Camera, FileUp, Eye, Download } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { formatDate } from "@/utils/dateFormat";

const Registros = ({ auth, registros, filters }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [dateFilter, setDateFilter] = useState(filters?.date_filter || "all");
    const [startDate, setStartDate] = useState(filters?.start_date || "");
    const [endDate, setEndDate] = useState(filters?.end_date || "");
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [selectedRegistro, setSelectedRegistro] = useState(null);
    const [completeData, setCompleteData] = useState({
        atividaderegistro_dtrealizada: new Date().toISOString().split('T')[0],
        atividaderegistro_observacoes: '',
    });
    const [uploadedPhotos, setUploadedPhotos] = useState([]);
    const [uploadedDocuments, setUploadedDocuments] = useState([]);

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

    const handleOpenComplete = (registro, e) => {
        e.stopPropagation();
        setSelectedRegistro(registro);
        setCompleteData({
            atividaderegistro_dtrealizada: new Date().toISOString().split('T')[0],
            atividaderegistro_observacoes: registro.atividaderegistro_observacoes || '',
        });
        setUploadedPhotos([]);
        setUploadedDocuments([]);
        setShowCompleteModal(true);
    };

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        const photoObjects = files.map(file => ({
            file: file,
            name: file.name,
            preview: URL.createObjectURL(file)
        }));
        setUploadedPhotos([...uploadedPhotos, ...photoObjects]);
    };

    const removePhoto = (index) => {
        const newPhotos = [...uploadedPhotos];
        URL.revokeObjectURL(newPhotos[index].preview);
        newPhotos.splice(index, 1);
        setUploadedPhotos(newPhotos);
    };

    const handleDocumentUpload = (e) => {
        const files = Array.from(e.target.files);
        const docObjects = files.map(file => ({
            file: file,
            name: file.name,
        }));
        setUploadedDocuments([...uploadedDocuments, ...docObjects]);
    };

    const removeDocument = (index) => {
        const newDocs = [...uploadedDocuments];
        newDocs.splice(index, 1);
        setUploadedDocuments(newDocs);
    };

    const handleCompleteRegistro = () => {
        if (!selectedRegistro) return;

        const formData = new FormData();
        formData.append('atividaderegistro_dtrealizada', completeData.atividaderegistro_dtrealizada);
        formData.append('atividaderegistro_observacoes', completeData.atividaderegistro_observacoes);

        uploadedPhotos.forEach((photo, index) => {
            formData.append(`photos[${index}]`, photo.file);
        });

        uploadedDocuments.forEach((doc, index) => {
            formData.append(`documents[${index}]`, doc.file);
        });

        router.post(route('registros.complete', selectedRegistro.atividaderegistro_id), formData, {
            onSuccess: () => {
                setShowCompleteModal(false);
                setSelectedRegistro(null);
                setCompleteData({
                    atividaderegistro_dtrealizada: new Date().toISOString().split('T')[0],
                    atividaderegistro_observacoes: '',
                });
                setUploadedPhotos([]);
                setUploadedDocuments([]);
            },
            preserveState: false,
        });
    };

    const filteredRegistros = (registros.data || []).filter((registro) => {
        const matchesSearch = !searchTerm ||
            registro.atividade?.atividade_descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            registro.atividade?.item?.item_nome?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === "all" || registro.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    return (
        <MainLayout auth={auth}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                            Registros de Atividades
                        </h1>
                        <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                            Acompanhe e gerencie os registros de execução
                        </p>
                    </div>

                    {/* Date Filter */}
                    <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Período
                        </label>
                        <select
                            value={dateFilter}
                            onChange={(e) => handleDateFilterChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                            <option value="all">Todos</option>
                            <option value="today">Hoje</option>
                            <option value="this_week">Esta Semana</option>
                            <option value="this_month">Este Mês</option>
                            <option value="last_7_days">Últimos 7 Dias</option>
                            <option value="last_15_days">Últimos 15 Dias</option>
                            <option value="last_30_days">Últimos 30 Dias</option>
                            <option value="custom">Período Personalizado</option>
                        </select>

                        {dateFilter === 'custom' && (
                            <div className="mt-4 flex flex-col sm:flex-row gap-3">
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

                    {/* Desktop Table View - Hidden on mobile */}
                    <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Descrição
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Item
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Local
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Início
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Conclusão
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Executor
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredRegistros.map((registro) => (
                                        <tr
                                            key={registro.atividaderegistro_id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                                                <div className="font-medium">
                                                    {registro.atividade?.atividade_descricao || "Sem descrição"}
                                                </div>
                                                {registro.atividaderegistro_observacoes && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-xs">
                                                        {registro.atividaderegistro_observacoes}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                                                {registro.atividade?.item?.item_nome || "N/A"}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                                                {registro.atividade?.item?.ambiente?.torre ? (
                                                    <div>
                                                        <div className="font-medium">{registro.atividade.item.ambiente.torre.torre_nome}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {registro.atividade.item.ambiente.ambiente_nome}
                                                        </div>
                                                    </div>
                                                ) : "N/A"}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                                                {formatDate(registro.atividaderegistro_dtinicio)}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                                                {registro.atividaderegistro_dtrealizada
                                                    ? formatDate(registro.atividaderegistro_dtrealizada)
                                                    : "-"}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                                                {registro.usuario?.name || "N/A"}
                                            </td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                {getStatusBadge(registro.status)}
                                            </td>
                                            <td className="px-4 py-4 text-sm whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        onClick={() => router.visit(route('registros.show', registro.atividaderegistro_id))}
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    {registro.status === 'em_andamento' && (
                                                        <Button
                                                            onClick={(e) => handleOpenComplete(registro, e)}
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700 text-white"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredRegistros.length === 0 && (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium mb-2">Nenhum registro encontrado</p>
                                <p className="text-sm">
                                    {searchTerm || filterStatus !== "all"
                                        ? "Tente ajustar os filtros de busca"
                                        : "Execute atividades para criar registros"}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Mobile Card View - Visible only on mobile */}
                    <div className="md:hidden space-y-4">
                        {filteredRegistros.map((registro) => (
                            <div
                                key={registro.atividaderegistro_id}
                                onClick={() => router.visit(route('registros.show', registro.atividaderegistro_id))}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                            >
                                <div className="flex flex-col gap-3 mb-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-base text-gray-900 dark:text-white break-words">
                                                {registro.atividade?.atividade_descricao || "Sem descrição"}
                                            </h3>
                                        </div>
                                        {getStatusBadge(registro.status)}
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                        <FileText className="w-4 h-4 flex-shrink-0" />
                                        <span className="truncate">{registro.atividade?.item?.item_nome || "Item não especificado"}</span>
                                    </div>

                                    {registro.atividade?.item?.ambiente?.torre && (
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {registro.atividade.item.ambiente.torre.torre_nome} - {registro.atividade.item.ambiente.ambiente_nome}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div className="flex items-start gap-2">
                                        <Calendar className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                                        <div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Início</div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {formatDate(registro.atividaderegistro_dtinicio)}
                                            </div>
                                        </div>
                                    </div>

                                    {registro.atividaderegistro_dtrealizada && (
                                        <div className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                                            <div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">Concluída</div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {formatDate(registro.atividaderegistro_dtrealizada)}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {registro.usuario && (
                                        <div className="flex items-start gap-2">
                                            <User className="w-4 h-4 mt-1 text-gray-400 flex-shrink-0" />
                                            <div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">Executor</div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {registro.usuario.name}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {registro.atividaderegistro_observacoes && (
                                    <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                            Observações
                                        </div>
                                        <div className="text-sm text-gray-700 dark:text-gray-200 line-clamp-2">
                                            {registro.atividaderegistro_observacoes}
                                        </div>
                                    </div>
                                )}

                                {registro.attachments && registro.attachments.length > 0 && (
                                    <div className="mb-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                        <FileText className="w-4 h-4" />
                                        {registro.attachments.length} anexo(s)
                                    </div>
                                )}

                                {registro.status === 'em_andamento' && (
                                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <Button
                                            onClick={(e) => handleOpenComplete(registro, e)}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                                            size="sm"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Concluir Registro
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {filteredRegistros.length === 0 && (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p className="text-base font-medium mb-2">Nenhum registro encontrado</p>
                                <p className="text-sm">
                                    {searchTerm || filterStatus !== "all"
                                        ? "Tente ajustar os filtros de busca"
                                        : "Execute atividades para criar registros"}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {registros.links && registros.links.length > 3 && (
                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            {registros.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.visit(link.url)}
                                    disabled={!link.url}
                                    className={`px-4 py-2 rounded text-sm ${
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
            </div>

            {/* Complete Modal */}
            {showCompleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Concluir Registro
                                </h2>
                                <button
                                    onClick={() => setShowCompleteModal(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Execution Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Data de Execução *
                                    </label>
                                    <input
                                        type="date"
                                        value={completeData.atividaderegistro_dtrealizada}
                                        onChange={(e) => setCompleteData({...completeData, atividaderegistro_dtrealizada: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    />
                                </div>

                                {/* Execution Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Notas de Execução
                                    </label>
                                    <Textarea
                                        value={completeData.atividaderegistro_observacoes}
                                        onChange={(e) => setCompleteData({...completeData, atividaderegistro_observacoes: e.target.value})}
                                        placeholder="Descreva detalhes da execução..."
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    />
                                </div>

                                {/* Photo Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Fotos da Execução
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handlePhotoUpload}
                                            className="hidden"
                                            id="photo-upload"
                                        />
                                        <label
                                            htmlFor="photo-upload"
                                            className="flex flex-col items-center justify-center cursor-pointer"
                                        >
                                            <Camera className="w-12 h-12 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                Clique para adicionar fotos
                                            </span>
                                        </label>
                                    </div>

                                    {uploadedPhotos.length > 0 && (
                                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {uploadedPhotos.map((photo, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={photo.preview}
                                                        alt={photo.name}
                                                        className="w-full h-32 object-cover rounded-lg"
                                                    />
                                                    <button
                                                        onClick={() => removePhoto(index)}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Document Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Documentos (NF/Recibos)
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            multiple
                                            onChange={handleDocumentUpload}
                                            className="hidden"
                                            id="document-upload"
                                        />
                                        <label
                                            htmlFor="document-upload"
                                            className="flex flex-col items-center justify-center cursor-pointer"
                                        >
                                            <FileUp className="w-12 h-12 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                Clique para adicionar documentos
                                            </span>
                                        </label>
                                    </div>

                                    {uploadedDocuments.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {uploadedDocuments.map((doc, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-5 h-5 text-gray-400" />
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                                            {doc.name}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => removeDocument(index)}
                                                        className="text-red-500 hover:text-red-600"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 flex gap-3 justify-end">
                                <Button
                                    onClick={() => setShowCompleteModal(false)}
                                    variant="outline"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleCompleteRegistro}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Concluir
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default Registros;
