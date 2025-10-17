import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Calendar,
    Clock,
    User,
    Camera,
    FileUp,
    PlayCircle,
    CheckCircle,
    Eye,
    X,
    Search,
    Plus,
    AlertTriangle,
    Pause,
    SkipForward,
    Edit,
    Trash2,
} from "lucide-react";

const Activities = ({ auth, atividades, filters }) => {
    const { isDark, colors } = useTheme();
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [showExecutionModal, setShowExecutionModal] = useState(false);
    const [showNewActivityModal, setShowNewActivityModal] = useState(false);
    const [executionNotes, setExecutionNotes] = useState("");
    const [uploadedPhotos, setUploadedPhotos] = useState([]);
    const [uploadedDocuments, setUploadedDocuments] = useState([]);

    const activities = atividades?.data?.map(atv => ({
        id: atv.atividade_id,
        name: atv.atividade_descricao,
        description: atv.atividade_descricao,
        status: atv.atividade_status,
        dbStatus: atv.atividade_status,
        priority: atv.atividade_prioridade,
        assignee: atv.profissional?.profissional_tipo || 'N/A',
        dueDate: atv.atividade_dtestimada,
        template: atv.tipo?.tipo_nome || '',
        asset: `${atv.item?.ambiente?.torre?.torre_nome || ''} - ${atv.item?.item_nome || ''}`,
        createdAt: atv.created_at,
        startedAt: null,
        completedAt: null,
        notes: "",
        photos: [],
        documents: [],
    })) || [];

    // State transition functions
    const handleStartActivity = (activity) => {
        router.post(route('registros.store'), {
            atividade_id: activity.id,
            atividaderegistro_dtinicio: new Date().toISOString().split('T')[0],
            atividaderegistro_observacoes: '',
        }, {
            preserveScroll: true,
        });
    };

    const handlePauseActivity = (activity) => {
        router.put(route('activities.update', activity.id), {
            atividade_status: 'bloqueada',
        }, {
            preserveScroll: true,
        });
    };

    const handleResumeActivity = (activity) => {
        router.put(route('activities.update', activity.id), {
            atividade_status: 'ativa',
        }, {
            preserveScroll: true,
        });
    };

    const handleCompleteActivity = (activity) => {
        setSelectedActivity(activity);
        setExecutionNotes(activity.notes || "");
        setUploadedPhotos([]);
        setUploadedDocuments([]);
        setShowExecutionModal(true);
    };

    const handleCancelActivity = (activity) => {
        router.put(route('activities.update', activity.id), {
            atividade_status: 'bloqueada',
        }, {
            preserveScroll: true,
        });
    };

    const confirmCompletion = () => {
        const formData = new FormData();
        formData.append('atividaderegistro_dtrealizada', new Date().toISOString().split('T')[0]);
        formData.append('atividaderegistro_observacoes', executionNotes);

        uploadedPhotos.forEach((photo, index) => {
            formData.append(`photos[${index}]`, photo);
        });

        uploadedDocuments.forEach((doc, index) => {
            formData.append(`documents[${index}]`, doc);
        });

        router.post(route('registros.complete', selectedActivity.registroId || selectedActivity.id), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setShowExecutionModal(false);
                setSelectedActivity(null);
                setExecutionNotes("");
                setUploadedPhotos([]);
                setUploadedDocuments([]);
            }
        });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "ativa":
                return <Clock className="w-4 h-4" />;
            case "bloqueada":
                return <Pause className="w-4 h-4" />;
            case "concluida":
                return <CheckCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status) => {
        // Neutral gray outline for all statuses - only one color emphasis (action button)
        return "bg-transparent text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600";
    };

    const getStatusDotColor = (status) => {
        switch (status) {
            case "ativa":
                return "bg-blue-500";
            case "bloqueada":
                return "bg-orange-500";
            case "concluida":
                return "bg-emerald-500";
            default:
                return "bg-gray-400";
        }
    };

    const getStatusLabel = (status) => {
        const labels = {
            ativa: "Ativa",
            bloqueada: "Bloqueada",
            concluida: "Concluída",
        };
        return labels[status] || status;
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case "high":
                return "⚠️";
            case "medium":
                return "●";
            case "low":
                return "○";
            default:
                return "●";
        }
    };

    const filteredActivities = activities.filter((activity) => {
        const matchesStatus =
            statusFilter === "all" || activity.status === statusFilter;
        return matchesStatus;
    });

    const getStatusStats = () => {
        const ativa = activities.filter(
            (a) => a.status === "ativa"
        ).length;
        const bloqueada = activities.filter(
            (a) => a.status === "bloqueada"
        ).length;
        const concluida = activities.filter(
            (a) => a.status === "concluida"
        ).length;

        return { ativa, bloqueada, concluida };
    };

    const stats = getStatusStats();

    const handlePhotoUpload = (event) => {
        const files = Array.from(event.target.files);
        files.forEach((file) => {
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setUploadedPhotos((prev) => [
                        ...prev,
                        {
                            file,
                            preview: e.target.result,
                            name: file.name,
                        },
                    ]);
                };
                reader.readAsDataURL(file);
            }
        });
    };

    const handleDocumentUpload = (event) => {
        const files = Array.from(event.target.files);
        files.forEach((file) => {
            setUploadedDocuments((prev) => [
                ...prev,
                {
                    file,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                },
            ]);
        });
    };

    const removePhoto = (index) => {
        setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    const removeDocument = (index) => {
        setUploadedDocuments((prev) => prev.filter((_, i) => i !== index));
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    // Render action buttons based on activity status
    const renderActionButtons = (activity) => {
        switch (activity.status) {
            case "ativa":
                return (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStartActivity(activity)}
                            className="h-6 text-[11px] font-normal border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                        >
                            <PlayCircle className="w-3 h-3 mr-1" />
                            Iniciar
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelActivity(activity)}
                            className="h-6 text-[11px] font-normal border-gray-300 text-gray-600 hover:bg-gray-50"
                        >
                            <X className="w-3 h-3 mr-1" />
                            Bloquear
                        </Button>
                    </>
                );

            case "bloqueada":
                return (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResumeActivity(activity)}
                            className="h-6 text-[11px] font-normal border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                        >
                            <PlayCircle className="w-3 h-3 mr-1" />
                            Desbloquear
                        </Button>
                    </>
                );

            case "concluida":
                return (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.visit(`/activities/${activity.id}`)}
                        className="h-6 text-[11px] font-normal border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                        <Eye className="w-3 h-3 mr-1" />
                        Visualizar
                    </Button>
                );

            default:
                return null;
        }
    };

    return (
        <MainLayout auth={auth}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1
                            className={`text-3xl font-semibold ${colors.text.primary}`}
                        >
                            Atividades
                        </h1>
                        <p className={`${colors.text.secondary} mt-1`}>
                            Acompanhe e execute as atividades de manutenção
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => router.visit('/registros')}
                            className={`border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400`}
                        >
                            Ver Histórico de Execuções
                        </Button>
                        {auth.user && (
                            <Button
                                onClick={() => setShowNewActivityModal(true)}
                                className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-900 text-white shadow-sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Nova Atividade
                            </Button>
                        )}
                    </div>
                </div>

                {/* Status Cards - Minimal */}
                <div className="grid grid-cols-3 gap-3 mb-12">
                    <div
                        className={`${colors.card} border ${colors.border} rounded-lg p-3`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">
                                    Ativa
                                </p>
                                <p className="text-xl font-semibold text-blue-600">
                                    {stats.ativa}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/30 rounded-full flex items-center justify-center">
                                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div
                        className={`${colors.card} border ${colors.border} rounded-lg p-3`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">
                                    Bloqueada
                                </p>
                                <p className="text-xl font-semibold text-orange-600">
                                    {stats.bloqueada}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950/30 rounded-full flex items-center justify-center">
                                <Pause className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                    </div>

                    <div
                        className={`${colors.card} border ${colors.border} rounded-lg p-3`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">
                                    Concluída
                                </p>
                                <p className="text-xl font-semibold text-emerald-600">
                                    {stats.concluida}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activities List - Compact Card Layout */}
                <div>
                    <div className="flex items-center justify-between mt-8 mb-2.5">
                        <h2
                            className={`text-base font-medium ${colors.text.primary}`}
                        >
                            Atividades
                            <span
                                className={`ml-2 text-sm font-normal ${colors.text.secondary}`}
                            >
                                ({filteredActivities.length})
                            </span>
                        </h2>

                        {/* Filter - Right Aligned */}
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger
                                className={`w-36 border ${colors.border} ${colors.surface} ${colors.text.primary} h-8 text-xs`}
                            >
                                <SelectValue placeholder="Filtrar por status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Todos os Status
                                </SelectItem>
                                <SelectItem value="ativa">
                                    Ativa
                                </SelectItem>
                                <SelectItem value="bloqueada">
                                    Bloqueada
                                </SelectItem>
                                <SelectItem value="concluida">
                                    Concluída
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        {filteredActivities.map((activity) => (
                            <div
                                key={activity.id}
                                className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-all hover:bg-white dark:hover:bg-slate-700 cursor-pointer"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    {/* Left: Title & Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3
                                            className={`text-[15px] font-semibold ${colors.text.primary} mb-1.5`}
                                        >
                                            {activity.name}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs">
                                                    📍
                                                </span>
                                                <span>{activity.asset}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <User className="w-3 h-3 text-gray-400" />
                                                <span>{activity.assignee}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3 text-gray-400" />
                                                <span>{activity.dueDate}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Status & Actions */}
                                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                        {/* Status Tier - Dot + Text */}
                                        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                                            <span
                                                className={`w-2 h-2 rounded-full ${getStatusDotColor(
                                                    activity.status
                                                )}`}
                                            ></span>
                                            <span>
                                                {getStatusLabel(
                                                    activity.status
                                                )}
                                            </span>
                                        </div>

                                        {/* Action Tier */}
                                        <div className="flex items-center gap-1.5">
                                            {renderActionButtons(activity)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Empty State */}
                        {filteredActivities.length === 0 && (
                            <div
                                className={`${colors.card} border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center`}
                            >
                                <div className={`text-gray-400 mb-2`}>
                                    <Search className="w-12 h-12 mx-auto" />
                                </div>
                                <h3
                                    className={`text-lg font-medium ${colors.text.primary} mb-1`}
                                >
                                    Nenhuma atividade encontrada
                                </h3>
                                <p
                                    className={`text-sm ${colors.text.secondary}`}
                                >
                                    Tente ajustar os filtros ou criar uma nova
                                    atividade.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Execution Completion Modal */}
            {showExecutionModal && selectedActivity && (
                <div className="fixed inset-0 bg-black/70 dark:bg-black/80 flex items-center justify-center p-4 z-50">
                    <div
                        className={`${colors.card} rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl`}
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3
                                    className={`text-xl font-semibold ${colors.text.primary}`}
                                >
                                    {selectedActivity.name}
                                </h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowExecutionModal(false)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-6">
                                {/* Activity Info */}
                                <div
                                    className={`${colors.surface} p-4 rounded-lg`}
                                >
                                    <h4
                                        className={`font-medium mb-2 ${colors.text.primary}`}
                                    >
                                        Detalhes da Atividade
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span
                                                className={
                                                    colors.text.secondary
                                                }
                                            >
                                                Ativo:
                                            </span>
                                            <span
                                                className={`ml-2 font-medium ${colors.text.primary}`}
                                            >
                                                {selectedActivity.asset}
                                            </span>
                                        </div>
                                        <div>
                                            <span
                                                className={
                                                    colors.text.secondary
                                                }
                                            >
                                                Responsável:
                                            </span>
                                            <span
                                                className={`ml-2 font-medium ${colors.text.primary}`}
                                            >
                                                {selectedActivity.assignee}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label
                                        className={`block text-sm font-medium ${colors.text.primary} mb-2`}
                                    >
                                        Notas de Execução
                                    </label>
                                    <Textarea
                                        value={executionNotes}
                                        onChange={(e) =>
                                            setExecutionNotes(e.target.value)
                                        }
                                        placeholder="Adicionar notas sobre a execução..."
                                        rows={4}
                                        className={`w-full border ${colors.border} ${colors.surface} ${colors.text.primary}`}
                                    />
                                </div>

                                {/* Photo Upload */}
                                <div>
                                    <label
                                        className={`block text-sm font-medium ${colors.text.primary} mb-2`}
                                    >
                                        Fotos
                                    </label>
                                    <div
                                        className={`border-2 border-dashed ${colors.border} rounded-lg p-4`}
                                    >
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
                                            <Camera
                                                className={`w-8 h-8 ${colors.text.muted} mb-2`}
                                            />
                                            <span
                                                className={`text-sm ${colors.text.secondary}`}
                                            >
                                                Clique para fazer upload de
                                                fotos
                                            </span>
                                        </label>
                                    </div>

                                    {/* Photo Previews */}
                                    {uploadedPhotos.length > 0 && (
                                        <div className="grid grid-cols-3 gap-4 mt-4">
                                            {uploadedPhotos.map(
                                                (photo, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative"
                                                    >
                                                        <img
                                                            src={photo.preview}
                                                            alt={photo.name}
                                                            className="w-full h-24 object-cover rounded-lg"
                                                        />
                                                        <button
                                                            onClick={() =>
                                                                removePhoto(
                                                                    index
                                                                )
                                                            }
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                        <div
                                                            className={`text-xs ${colors.text.secondary} mt-1 truncate`}
                                                        >
                                                            {photo.name}
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Document Upload */}
                                <div>
                                    <label
                                        className={`block text-sm font-medium ${colors.text.primary} mb-2`}
                                    >
                                        Documentos (NF/Recibos)
                                    </label>
                                    <div
                                        className={`border-2 border-dashed ${colors.border} rounded-lg p-4`}
                                    >
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
                                            <FileUp
                                                className={`w-8 h-8 ${colors.text.muted} mb-2`}
                                            />
                                            <span
                                                className={`text-sm ${colors.text.secondary}`}
                                            >
                                                Clique para fazer upload de
                                                documentos
                                            </span>
                                        </label>
                                    </div>

                                    {/* Document List */}
                                    {uploadedDocuments.length > 0 && (
                                        <div className="space-y-2 mt-4">
                                            {uploadedDocuments.map(
                                                (doc, index) => (
                                                    <div
                                                        key={index}
                                                        className={`flex items-center justify-between ${colors.surface} p-3 rounded-lg`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <FileUp
                                                                className={`w-4 h-4 ${colors.text.muted}`}
                                                            />
                                                            <div>
                                                                <div
                                                                    className={`text-sm font-medium ${colors.text.primary}`}
                                                                >
                                                                    {doc.name}
                                                                </div>
                                                                <div
                                                                    className={`text-xs ${colors.text.secondary}`}
                                                                >
                                                                    {formatFileSize(
                                                                        doc.size
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() =>
                                                                removeDocument(
                                                                    index
                                                                )
                                                            }
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div
                                    className={`flex items-center justify-end gap-4 pt-4 border-t ${colors.border}`}
                                >
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            setShowExecutionModal(false)
                                        }
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        onClick={confirmCompletion}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Confirmar Conclusão
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* New Activity Modal - Redirect to Catalog */}
            {showNewActivityModal && (
                <div className="fixed inset-0 bg-black/70 dark:bg-black/80 flex items-center justify-center p-4 z-50">
                    <div
                        className={`${colors.card} rounded-lg p-6 w-full max-w-md shadow-2xl`}
                    >
                        <h3
                            className={`text-lg font-semibold mb-4 ${colors.text.primary}`}
                        >
                            Nova Atividade
                        </h3>
                        <p className={`${colors.text.secondary} mb-4`}>
                            Para criar uma nova atividade, primeiro selecione um item no Catálogo.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowNewActivityModal(false)}
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={() => router.visit('/catalog')}
                                className="flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"
                            >
                                Ir para Catálogo
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default Activities;
