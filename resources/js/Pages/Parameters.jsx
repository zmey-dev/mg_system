import React, { useState, useRef } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { router, usePage } from "@inertiajs/react";
import {
    FolderTree,
    MapPinned,
    FileType,
    FileText,
    Calendar,
    Users,
    Plus,
    Edit,
    Trash2,
    X,
    Search,
    Building,
    Grid3x3,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    List,
    Printer,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { isValidCNPJ, formatCNPJ } from "@brazilian-utils/brazilian-utils";
import { useReactToPrint } from "react-to-print";

const Parameters = ({ auth, grupos, subgrupos, origens, tipos, doctoTipos, periodos, profissionais, empreendimentos }) => {
    const { isDark, colors } = useTheme();
    const { errors } = usePage().props;
    const [activeTab, setActiveTab] = useState("grupos");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState("nome"); // "nome" or "date"
    const [sortDirection, setSortDirection] = useState("asc"); // "asc" or "desc"
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        nome: "",
        descricao: "",
        dias: "",
        cnpj: "",
        endereco: "",
        numero: "",
        cep: "",
        cidade: "",
        uf: "",
        qtdtorre: "",
        itemgrupo_id: "",
    });
    const [cnpjError, setCnpjError] = useState("");
    const [showListModal, setShowListModal] = useState(false);
    const printRef = useRef(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: "Parâmetros do Sistema - MG System",
    });

    const handleCnpjChange = (value) => {
        // Remove non-numeric characters for validation
        const numericValue = value.replace(/\D/g, "");

        // Format the CNPJ as user types
        let formattedValue = value;
        if (numericValue.length <= 14) {
            formattedValue = formatCNPJ(numericValue);
        }

        setFormData({ ...formData, cnpj: formattedValue });

        // Validate only when we have enough digits
        if (numericValue.length === 14) {
            if (!isValidCNPJ(numericValue)) {
                setCnpjError("CNPJ inválido");
            } else {
                setCnpjError("");
            }
        } else if (numericValue.length > 0) {
            setCnpjError("");
        }
    };

    const getDataForTab = () => {
        let data = [];
        switch (activeTab) {
            case "empreendimentos":
                data = empreendimentos || [];
                break;
            case "grupos":
                data = grupos || [];
                break;
            case "subgrupos":
                data = subgrupos || [];
                break;
            case "origens":
                data = origens || [];
                break;
            case "tipos":
                data = tipos || [];
                break;
            case "doctoTipos":
                data = doctoTipos || [];
                break;
            case "periodos":
                data = periodos || [];
                break;
            case "profissionais":
                data = profissionais || [];
                break;
            default:
                return [];
        }

        // Filter by search term
        if (searchTerm && searchTerm.length >= 3) {
            data = data.filter((item) => {
                const nome = item.empreendimento_nome || item.itemgrupo_nome || item.itemsubgrupo_nome || item.origem_nome || item.tipo_nome ||
                            item.doctotipo_nome || item.periodo_nome || item.profissional_tipo || "";
                const descricao = item.itemgrupo_descricao || item.itemsubgrupo_descricao || item.origem_descricao || item.tipo_descricao ||
                            item.doctotipo_descricao || item.profissional_descricao || "";

                return nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       descricao.toLowerCase().includes(searchTerm.toLowerCase());
            });
        }

        // Sort data
        const sortedData = [...data].sort((a, b) => {
            let valueA, valueB;

            if (sortField === "nome") {
                valueA = (a.empreendimento_nome || a.itemgrupo_nome || a.itemsubgrupo_nome || a.origem_nome || a.tipo_nome ||
                         a.doctotipo_nome || a.periodo_nome || a.profissional_tipo || "").toLowerCase();
                valueB = (b.empreendimento_nome || b.itemgrupo_nome || b.itemsubgrupo_nome || b.origem_nome || b.tipo_nome ||
                         b.doctotipo_nome || b.periodo_nome || b.profissional_tipo || "").toLowerCase();
            } else {
                // Sort by date (updated_at or created_at)
                valueA = a.updated_at || a.created_at || "";
                valueB = b.updated_at || b.created_at || "";
            }

            if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
            if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });

        return sortedData;
    };

    const toggleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const getSortIcon = (field) => {
        if (sortField !== field) {
            return <ArrowUpDown className="w-4 h-4" />;
        }
        return sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
    };

    const getTabConfig = (tab) => {
        const configs = {
            empreendimentos: {
                icon: <Building className="w-4 h-4" />,
                title: "Empreendimentos",
                singular: "Empreendimento",
                color: "cyan",
            },
            grupos: {
                icon: <FolderTree className="w-4 h-4" />,
                title: "Sistemas de Itens",
                singular: "Sistema",
                color: "blue",
            },
            subgrupos: {
                icon: <Grid3x3 className="w-4 h-4" />,
                title: "Subsistemas",
                singular: "Subsistema",
                color: "teal",
            },
            origens: {
                icon: <MapPinned className="w-4 h-4" />,
                title: "Origens",
                singular: "Origem",
                color: "green",
            },
            tipos: {
                icon: <FileType className="w-4 h-4" />,
                title: "Tipos de Atividade",
                singular: "Tipo",
                color: "purple",
            },
            doctoTipos: {
                icon: <FileText className="w-4 h-4" />,
                title: "Tipos de Documento",
                singular: "Tipo de Documento",
                color: "orange",
            },
            periodos: {
                icon: <Calendar className="w-4 h-4" />,
                title: "Períodos",
                singular: "Período",
                color: "pink",
            },
            profissionais: {
                icon: <Users className="w-4 h-4" />,
                title: "Tipos de Profissional",
                singular: "Profissional",
                color: "indigo",
            },
        };
        return configs[tab];
    };

    const handleAdd = () => {
        setEditingItem(null);
        setFormData({ nome: "", descricao: "", dias: "", cnpj: "", endereco: "", numero: "", cep: "", cidade: "", uf: "", qtdtorre: "", itemgrupo_id: "" });
        setCnpjError("");
        setShowAddModal(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        const nome = item.empreendimento_nome || item.itemgrupo_nome || item.itemsubgrupo_nome || item.origem_nome || item.tipo_nome ||
                    item.doctotipo_nome || item.periodo_nome || item.profissional_tipo || "";
        const descricao = item.itemgrupo_descricao || item.itemsubgrupo_descricao || item.origem_descricao || item.tipo_descricao ||
                    item.doctotipo_descricao || item.profissional_descricao || "";
        const dias = item.periodo_dias || "";
        const cnpj = item.empreendimento_cnpj || "";
        const endereco = item.empreendimento_endereco || "";
        const numero = item.empreendimento_numero || "";
        const cep = item.empreendimento_cep || "";
        const cidade = item.empreendimento_cidade || "";
        const uf = item.empreendimento_uf || "";
        const qtdtorre = item.empreendimento_qtdtorre || "";
        const itemgrupo_id = item.itemgrupo_id ? item.itemgrupo_id.toString() : "";

        setFormData({ nome, descricao, dias, cnpj, endereco, numero, cep, cidade, uf, qtdtorre, itemgrupo_id });
        setCnpjError("");
        setShowAddModal(true);
    };

    const handleSave = () => {
        const storeRoutes = {
            empreendimentos: "empreendimentos.store",
            grupos: "parameters.grupos.store",
            subgrupos: "parameters.subgrupos.store",
            origens: "parameters.origem.store",
            tipos: "parameters.tipo.store",
            doctoTipos: "parameters.doctotipo.store",
            periodos: "parameters.periodo.store",
            profissionais: "parameters.profissional.store",
        };

        const updateRoutes = {
            empreendimentos: "empreendimentos.update",
            grupos: "parameters.grupos.update",
            subgrupos: "parameters.subgrupos.update",
            origens: "parameters.origem.update",
            tipos: "parameters.tipo.update",
            doctoTipos: "parameters.doctotipo.update",
            periodos: "parameters.periodo.update",
            profissionais: "parameters.profissional.update",
        };

        const fieldMappings = {
            empreendimentos: {
                empreendimento_nome: formData.nome,
                empreendimento_cnpj: formData.cnpj,
                empreendimento_endereco: formData.endereco,
                empreendimento_numero: formData.numero,
                empreendimento_cep: formData.cep,
                empreendimento_cidade: formData.cidade,
                empreendimento_uf: formData.uf,
                empreendimento_qtdtorre: formData.qtdtorre || null,
            },
            grupos: {
                itemgrupo_nome: formData.nome,
                itemgrupo_descricao: formData.descricao,
            },
            subgrupos: {
                itemgrupo_id: parseInt(formData.itemgrupo_id),
                itemsubgrupo_nome: formData.nome,
                itemsubgrupo_descricao: formData.descricao,
            },
            origens: {
                origem_nome: formData.nome,
                origem_descricao: formData.descricao,
            },
            tipos: {
                tipo_nome: formData.nome,
                tipo_descricao: formData.descricao,
            },
            doctoTipos: {
                doctotipo_nome: formData.nome,
                doctotipo_descricao: formData.descricao,
            },
            periodos: {
                periodo_nome: formData.nome,
                periodo_dias: formData.dias || null,
            },
            profissionais: {
                profissional_tipo: formData.nome,
                profissional_descricao: formData.descricao,
            },
        };

        const onSuccessCallback = () => {
            setShowAddModal(false);
            setEditingItem(null);
            setFormData({ nome: "", descricao: "", dias: "", cnpj: "", endereco: "", numero: "", cep: "", cidade: "", uf: "", qtdtorre: "", itemgrupo_id: "" });
        };

        if (editingItem) {
            // Update existing item
            const id = editingItem.empreendimento_id || editingItem.itemsubgrupo_id || editingItem.itemgrupo_id || editingItem.origem_id ||
                      editingItem.tipo_id || editingItem.doctotipo_id || editingItem.periodo_id || editingItem.profissional_id;

            const updateData = {...fieldMappings[activeTab]};

            // For subgrupos update, only include itemgrupo_id if it was changed
            if (activeTab === 'subgrupos' && formData.itemgrupo_id) {
                updateData.itemgrupo_id = parseInt(formData.itemgrupo_id);
            }

            router.put(route(updateRoutes[activeTab], id), updateData, {
                onSuccess: onSuccessCallback,
                onError: (errors) => {
                    console.error('Error updating:', errors);
                }
            });
        } else {
            // Create new item
            router.post(route(storeRoutes[activeTab]), fieldMappings[activeTab], {
                onSuccess: onSuccessCallback,
                onError: (errors) => {
                    console.error('Error creating:', errors);
                }
            });
        }
    };

    const handleDelete = (item) => {
        if (!confirm("Tem certeza que deseja excluir este item?")) return;

        const routes = {
            empreendimentos: "empreendimentos.destroy",
            grupos: "parameters.grupos.destroy",
            subgrupos: "parameters.subgrupos.destroy",
            origens: "parameters.origem.destroy",
            tipos: "parameters.tipo.destroy",
            doctoTipos: "parameters.doctotipo.destroy",
            periodos: "parameters.periodo.destroy",
            profissionais: "parameters.profissional.destroy",
        };

        const id = item.empreendimento_id || item.itemsubgrupo_id || item.itemgrupo_id || item.origem_id || item.tipo_id ||
                  item.doctotipo_id || item.periodo_id || item.profissional_id;

        router.delete(route(routes[activeTab], id), {
            preserveScroll: true,
        });
    };

    const renderItemCard = (item) => {
        const config = getTabConfig(activeTab);
        const nome = item.empreendimento_nome || item.itemgrupo_nome || item.itemsubgrupo_nome || item.origem_nome || item.tipo_nome ||
                    item.doctotipo_nome || item.periodo_nome || item.profissional_tipo || "";
        const descricao = item.itemgrupo_descricao || item.itemsubgrupo_descricao || item.origem_descricao || item.tipo_descricao ||
                    item.doctotipo_descricao || item.profissional_descricao || "";
        const dias = item.periodo_dias;
        const grupoNome = item.grupo?.itemgrupo_nome || "";
        const id = item.empreendimento_id || item.itemsubgrupo_id || item.itemgrupo_id || item.origem_id || item.tipo_id ||
                  item.doctotipo_id || item.periodo_id || item.profissional_id;

        return (
            <Card
                key={id}
                className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all rounded-xl"
            >
                <CardContent className="p-4 sm:p-5">
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div className={`text-${config.color}-600 flex-shrink-0 mt-0.5`}>
                                {config.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={`font-semibold text-base sm:text-lg ${colors.text.primary} break-words`}>
                                    {nome}
                                </h3>
                                {descricao && (
                                    <p className="text-sm text-gray-700 dark:text-gray-200 italic mt-1">
                                        {descricao}
                                    </p>
                                )}
                                {grupoNome && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Sistema: {grupoNome}
                                    </p>
                                )}
                                {dias && (
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                                        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span>{dias} {dias === 1 ? "dia" : "dias"}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(item)}
                                className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                            >
                                <Edit className="w-4 h-4 mr-1.5" />
                                <span>Editar</span>
                            </Button>
                            {auth.user.role === "master" && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(item)}
                                    className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-600 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4 mr-1.5" />
                                    <span>Excluir</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    const renderContent = () => {
        const data = getDataForTab();

        if (data.length === 0) {
            return (
                <div className="text-center py-12">
                    <p className={`${colors.text.secondary} mb-4`}>
                        Nenhum item encontrado.
                    </p>
                    <Button onClick={handleAdd} variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar primeiro {getTabConfig(activeTab).singular}
                    </Button>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {data.map((item) => renderItemCard(item))}
            </div>
        );
    };

    const needsDescricao = () => {
        return activeTab === "grupos" || activeTab === "subgrupos" || activeTab === "origens" || activeTab === "tipos" || activeTab === "doctoTipos" || activeTab === "profissionais";
    };

    const needsDias = () => {
        return activeTab === "periodos";
    };

    const needsGrupo = () => {
        return activeTab === "subgrupos";
    };

    const isEmpreendimento = () => {
        return activeTab === "empreendimentos";
    };

    return (
        <MainLayout auth={auth}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1">
                            <h1 className={`text-2xl sm:text-3xl font-semibold ${colors.text.primary}`}>
                                Parâmetros do Sistema
                            </h1>
                            <p className={`${colors.text.secondary} mt-1 text-sm`}>
                                Gerencie os parâmetros e configurações globais
                            </p>
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                                onClick={() => setShowListModal(true)}
                                variant="outline"
                                className="flex-1 sm:flex-none"
                            >
                                <List className="w-4 h-4 sm:mr-2" />
                                <span className="hidden sm:inline">Listar Tudo</span>
                            </Button>
                            <Button
                                onClick={handleAdd}
                                className="flex-1 sm:flex-none bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-900 text-white shadow-sm hover:shadow-md transition-all whitespace-nowrap"
                            >
                                <Plus className="w-4 h-4 sm:mr-2" />
                                <span className="hidden sm:inline">Adicionar {getTabConfig(activeTab).singular}</span>
                                <span className="sm:hidden">Adicionar</span>
                            </Button>
                        </div>
                    </div>

                    {/* Search and Sort */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                        <div className="relative flex-1 sm:max-w-lg">
                            <Search
                                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${colors.text.muted} w-4 h-4`}
                            />
                            <Input
                                placeholder="Buscar (mín. 3 letras)..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`pl-10 border ${colors.border} ${colors.surface} ${colors.text.primary} placeholder:text-gray-400`}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm ${colors.text.secondary} hidden sm:inline`}>Ordenar:</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleSort("nome")}
                                className={`flex items-center gap-1.5 ${sortField === "nome" ? "border-blue-500 text-blue-600 dark:text-blue-400" : ""}`}
                            >
                                {getSortIcon("nome")}
                                <span>Nome</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleSort("date")}
                                className={`flex items-center gap-1.5 ${sortField === "date" ? "border-blue-500 text-blue-600 dark:text-blue-400" : ""}`}
                            >
                                {getSortIcon("date")}
                                <span>Data</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {errors?.error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                        {errors.error}
                    </div>
                )}

                {/* Tabs */}
                <Card className={`${colors.card} backdrop-blur-sm border ${colors.border} shadow-lg`}>
                    <CardContent className="p-4 sm:p-6 lg:p-8">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <div className="overflow-x-auto overflow-y-hidden -mx-4 sm:mx-0 px-4 sm:px-0 mb-6">
                                <TabsList className={`inline-flex w-full sm:grid sm:grid-cols-4 lg:grid-cols-8 gap-1 ${colors.surface} p-1 min-w-max sm:min-w-0 h-auto`}>
                                    {["empreendimentos", "grupos", "subgrupos", "origens", "tipos", "doctoTipos", "periodos", "profissionais"].map((tab) => {
                                        const config = getTabConfig(tab);
                                        const data = tab === "empreendimentos" ? empreendimentos :
                                                   tab === "grupos" ? grupos :
                                                   tab === "subgrupos" ? subgrupos :
                                                   tab === "origens" ? origens :
                                                   tab === "tipos" ? tipos :
                                                   tab === "doctoTipos" ? doctoTipos :
                                                   tab === "periodos" ? periodos :
                                                   profissionais;

                                        return (
                                            <TabsTrigger
                                                key={tab}
                                                value={tab}
                                                title={config.title}
                                                className={`flex items-center justify-center gap-1.5 relative py-2.5 px-3 text-xs whitespace-nowrap ${
                                                    activeTab === tab
                                                        ? `${colors.card} ${colors.text.primary} shadow-sm border-b-2 border-blue-600`
                                                        : `${colors.text.secondary} hover:${colors.text.primary}`
                                                }`}
                                            >
                                                {config.icon}
                                                <Badge variant="secondary" className="text-xs px-1.5 min-w-[22px] text-center">
                                                    {data?.length || 0}
                                                </Badge>
                                            </TabsTrigger>
                                        );
                                    })}
                                </TabsList>
                            </div>

                            {["empreendimentos", "grupos", "subgrupos", "origens", "tipos", "doctoTipos", "periodos", "profissionais"].map((tab) => (
                                <TabsContent key={tab} value={tab}>
                                    {renderContent()}
                                </TabsContent>
                            ))}
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className={`${colors.card} rounded-lg w-full max-w-md my-8`}>
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h3 className={`text-lg sm:text-xl font-semibold ${colors.text.primary}`}>
                                    {editingItem ? "Editar" : "Adicionar"} {getTabConfig(activeTab).singular}
                                </h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-shrink-0"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>
                                        Nome *
                                    </label>
                                    <Input
                                        value={formData.nome}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                nome: e.target.value,
                                            })
                                        }
                                        placeholder={`Digite o nome do ${getTabConfig(activeTab).singular.toLowerCase()}`}
                                        className={colors.surface}
                                    />
                                </div>

                                {needsGrupo() && (
                                    <div>
                                        <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>
                                            Grupo *
                                        </label>
                                        <Select
                                            key={formData.itemgrupo_id || 'new'}
                                            value={formData.itemgrupo_id}
                                            onValueChange={(val) => setFormData({...formData, itemgrupo_id: val})}
                                        >
                                            <SelectTrigger className={colors.surface}>
                                                <SelectValue placeholder="Selecione um sistema" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {grupos?.map(grupo => (
                                                    <SelectItem key={grupo.itemgrupo_id} value={grupo.itemgrupo_id.toString()}>
                                                        {grupo.itemgrupo_nome}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {needsDescricao() && (
                                    <div>
                                        <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>
                                            Descrição
                                        </label>
                                        <Textarea
                                            value={formData.descricao}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    descricao: e.target.value,
                                                })
                                            }
                                            placeholder="Digite a descrição"
                                            rows={3}
                                            className={colors.surface}
                                        />
                                    </div>
                                )}

                                {needsDias() && (
                                    <div>
                                        <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>
                                            Dias
                                        </label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={formData.dias}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    dias: e.target.value,
                                                })
                                            }
                                            placeholder="Número de dias"
                                            className={colors.surface}
                                        />
                                    </div>
                                )}

                                {isEmpreendimento() && (
                                    <>
                                        <div>
                                            <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>
                                                CNPJ *
                                            </label>
                                            <Input
                                                value={formData.cnpj}
                                                onChange={(e) => handleCnpjChange(e.target.value)}
                                                placeholder="00.000.000/0000-00"
                                                className={`${colors.surface} ${cnpjError ? "border-red-500" : ""}`}
                                            />
                                            {cnpjError && (
                                                <p className="text-red-500 text-xs mt-1">{cnpjError}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>
                                                    Endereço *
                                                </label>
                                                <Input
                                                    value={formData.endereco}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            endereco: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Rua, Avenida..."
                                                    className={colors.surface}
                                                />
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>
                                                    Número *
                                                </label>
                                                <Input
                                                    value={formData.numero}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            numero: e.target.value,
                                                        })
                                                    }
                                                    placeholder="123"
                                                    className={colors.surface}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>
                                                    CEP *
                                                </label>
                                                <Input
                                                    value={formData.cep}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            cep: e.target.value,
                                                        })
                                                    }
                                                    placeholder="00000-000"
                                                    className={colors.surface}
                                                />
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>
                                                    Cidade *
                                                </label>
                                                <Input
                                                    value={formData.cidade}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            cidade: e.target.value,
                                                        })
                                                    }
                                                    placeholder="São Paulo"
                                                    className={colors.surface}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>
                                                    UF *
                                                </label>
                                                <Select
                                                    value={formData.uf}
                                                    onValueChange={(val) => setFormData({...formData, uf: val})}
                                                >
                                                    <SelectTrigger className={colors.surface}>
                                                        <SelectValue placeholder="Selecione o estado" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="AC">AC</SelectItem>
                                                        <SelectItem value="AL">AL</SelectItem>
                                                        <SelectItem value="AP">AP</SelectItem>
                                                        <SelectItem value="AM">AM</SelectItem>
                                                        <SelectItem value="BA">BA</SelectItem>
                                                        <SelectItem value="CE">CE</SelectItem>
                                                        <SelectItem value="DF">DF</SelectItem>
                                                        <SelectItem value="ES">ES</SelectItem>
                                                        <SelectItem value="GO">GO</SelectItem>
                                                        <SelectItem value="MA">MA</SelectItem>
                                                        <SelectItem value="MT">MT</SelectItem>
                                                        <SelectItem value="MS">MS</SelectItem>
                                                        <SelectItem value="MG">MG</SelectItem>
                                                        <SelectItem value="PA">PA</SelectItem>
                                                        <SelectItem value="PB">PB</SelectItem>
                                                        <SelectItem value="PR">PR</SelectItem>
                                                        <SelectItem value="PE">PE</SelectItem>
                                                        <SelectItem value="PI">PI</SelectItem>
                                                        <SelectItem value="RJ">RJ</SelectItem>
                                                        <SelectItem value="RN">RN</SelectItem>
                                                        <SelectItem value="RS">RS</SelectItem>
                                                        <SelectItem value="RO">RO</SelectItem>
                                                        <SelectItem value="RR">RR</SelectItem>
                                                        <SelectItem value="SC">SC</SelectItem>
                                                        <SelectItem value="SP">SP</SelectItem>
                                                        <SelectItem value="SE">SE</SelectItem>
                                                        <SelectItem value="TO">TO</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>
                                                    Quantidade de Torres
                                                </label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={formData.qtdtorre}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            qtdtorre: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Número de torres"
                                                    className={colors.surface}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className={`flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-4 mt-4 sm:mt-6 pt-4 border-t ${colors.border}`}>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowAddModal(false)}
                                    className="w-full sm:w-auto"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={
                                        !formData.nome ||
                                        (isEmpreendimento() && (!formData.cnpj || !formData.endereco || !formData.numero || !formData.cep || !formData.cidade || !formData.uf || cnpjError))
                                    }
                                    className="w-full sm:w-auto bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-900 text-white"
                                >
                                    {editingItem ? "Atualizar" : "Criar"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* List All Modal */}
            {showListModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-4xl my-8 max-h-[90vh] flex flex-col">
                        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h3 className={`text-lg sm:text-xl font-semibold ${colors.text.primary}`}>
                                Parâmetros Cadastrados
                            </h3>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePrint}
                                    className="flex items-center gap-1.5"
                                >
                                    <Printer className="w-4 h-4" />
                                    <span className="hidden sm:inline">Imprimir / PDF</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowListModal(false)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="p-4 sm:p-6 overflow-y-auto flex-1" ref={printRef}>
                            <div className="print:p-4">
                                {/* Print Header - only visible when printing */}
                                <div className="hidden print:block mb-6 text-center">
                                    <h1 className="text-2xl font-bold">Parâmetros do Sistema</h1>
                                    <p className="text-sm text-gray-500">MG System - {new Date().toLocaleDateString('pt-BR')}</p>
                                </div>

                                <div className="space-y-6 print:space-y-4">
                                    {/* Empreendimentos with Torres */}
                                    <div className="print:break-inside-avoid">
                                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-cyan-700 dark:text-cyan-400 print:text-black">
                                            <Building className="w-5 h-5 print:hidden" />
                                            Empreendimentos ({empreendimentos?.length || 0})
                                        </h4>
                                        <div className="space-y-2 ml-4 print:ml-2">
                                            {empreendimentos?.map(emp => (
                                                <div key={emp.empreendimento_id} className="border-l-2 border-cyan-300 dark:border-cyan-700 pl-3 print:border-gray-400">
                                                    <p className={`font-medium ${colors.text.primary} print:text-black`}>{emp.empreendimento_nome}</p>
                                                    <p className="text-sm text-gray-500 print:text-gray-600">CNPJ: {emp.empreendimento_cnpj}</p>
                                                    <p className="text-sm text-gray-500 print:text-gray-600">
                                                        {emp.empreendimento_endereco}, {emp.empreendimento_numero} - {emp.empreendimento_cidade}/{emp.empreendimento_uf}
                                                    </p>
                                                    {emp.torres && emp.torres.length > 0 && (
                                                        <div className="mt-2 ml-4">
                                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 print:text-gray-700">Torres:</p>
                                                            <ul className="list-disc ml-4 text-sm text-gray-600 dark:text-gray-400 print:text-gray-600">
                                                                {emp.torres.map(torre => (
                                                                    <li key={torre.torre_id}>{torre.torre_nome}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {(!empreendimentos || empreendimentos.length === 0) && (
                                                <p className="text-sm text-gray-400 italic">Nenhum empreendimento cadastrado</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Grupos with Subgrupos */}
                                    <div className="print:break-inside-avoid">
                                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-blue-700 dark:text-blue-400 print:text-black">
                                            <FolderTree className="w-5 h-5 print:hidden" />
                                            Grupos de Itens ({grupos?.length || 0})
                                        </h4>
                                        <div className="space-y-2 ml-4 print:ml-2">
                                            {grupos?.map(grupo => (
                                                <div key={grupo.itemgrupo_id} className="border-l-2 border-blue-300 dark:border-blue-700 pl-3 print:border-gray-400">
                                                    <p className={`font-medium ${colors.text.primary} print:text-black`}>{grupo.itemgrupo_nome}</p>
                                                    {grupo.itemgrupo_descricao && (
                                                        <p className="text-sm text-gray-500 italic print:text-gray-600">{grupo.itemgrupo_descricao}</p>
                                                    )}
                                                    {grupo.subgrupos && grupo.subgrupos.length > 0 && (
                                                        <div className="mt-2 ml-4">
                                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 print:text-gray-700">Subgrupos:</p>
                                                            <ul className="list-disc ml-4 text-sm text-gray-600 dark:text-gray-400 print:text-gray-600">
                                                                {grupo.subgrupos.map(sub => (
                                                                    <li key={sub.itemsubgrupo_id}>
                                                                        {sub.itemsubgrupo_nome}
                                                                        {sub.itemsubgrupo_descricao && <span className="italic"> - {sub.itemsubgrupo_descricao}</span>}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {(!grupos || grupos.length === 0) && (
                                                <p className="text-sm text-gray-400 italic">Nenhum sistema cadastrado</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Origens */}
                                    <div className="print:break-inside-avoid">
                                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-green-700 dark:text-green-400 print:text-black">
                                            <MapPinned className="w-5 h-5 print:hidden" />
                                            Origens ({origens?.length || 0})
                                        </h4>
                                        <div className="ml-4 print:ml-2">
                                            <ul className="list-disc ml-4 space-y-1">
                                                {origens?.map(origem => (
                                                    <li key={origem.origem_id} className={`${colors.text.primary} print:text-black`}>
                                                        {origem.origem_nome}
                                                        {origem.origem_descricao && <span className="text-sm text-gray-500 italic print:text-gray-600"> - {origem.origem_descricao}</span>}
                                                    </li>
                                                ))}
                                            </ul>
                                            {(!origens || origens.length === 0) && (
                                                <p className="text-sm text-gray-400 italic">Nenhuma origem cadastrada</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Tipos */}
                                    <div className="print:break-inside-avoid">
                                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-purple-700 dark:text-purple-400 print:text-black">
                                            <FileType className="w-5 h-5 print:hidden" />
                                            Tipos de Atividade ({tipos?.length || 0})
                                        </h4>
                                        <div className="ml-4 print:ml-2">
                                            <ul className="list-disc ml-4 space-y-1">
                                                {tipos?.map(tipo => (
                                                    <li key={tipo.tipo_id} className={`${colors.text.primary} print:text-black`}>
                                                        {tipo.tipo_nome}
                                                        {tipo.tipo_descricao && <span className="text-sm text-gray-500 italic print:text-gray-600"> - {tipo.tipo_descricao}</span>}
                                                    </li>
                                                ))}
                                            </ul>
                                            {(!tipos || tipos.length === 0) && (
                                                <p className="text-sm text-gray-400 italic">Nenhum tipo cadastrado</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Tipos de Documento */}
                                    <div className="print:break-inside-avoid">
                                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-orange-700 dark:text-orange-400 print:text-black">
                                            <FileText className="w-5 h-5 print:hidden" />
                                            Tipos de Documento ({doctoTipos?.length || 0})
                                        </h4>
                                        <div className="ml-4 print:ml-2">
                                            <ul className="list-disc ml-4 space-y-1">
                                                {doctoTipos?.map(docto => (
                                                    <li key={docto.doctotipo_id} className={`${colors.text.primary} print:text-black`}>
                                                        {docto.doctotipo_nome}
                                                        {docto.doctotipo_descricao && <span className="text-sm text-gray-500 italic print:text-gray-600"> - {docto.doctotipo_descricao}</span>}
                                                    </li>
                                                ))}
                                            </ul>
                                            {(!doctoTipos || doctoTipos.length === 0) && (
                                                <p className="text-sm text-gray-400 italic">Nenhum tipo de documento cadastrado</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Períodos */}
                                    <div className="print:break-inside-avoid">
                                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-pink-700 dark:text-pink-400 print:text-black">
                                            <Calendar className="w-5 h-5 print:hidden" />
                                            Períodos ({periodos?.length || 0})
                                        </h4>
                                        <div className="ml-4 print:ml-2">
                                            <ul className="list-disc ml-4 space-y-1">
                                                {periodos?.map(periodo => (
                                                    <li key={periodo.periodo_id} className={`${colors.text.primary} print:text-black`}>
                                                        {periodo.periodo_nome}
                                                        {periodo.periodo_dias && <span className="text-sm text-gray-500 print:text-gray-600"> ({periodo.periodo_dias} dias)</span>}
                                                    </li>
                                                ))}
                                            </ul>
                                            {(!periodos || periodos.length === 0) && (
                                                <p className="text-sm text-gray-400 italic">Nenhum período cadastrado</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Profissionais */}
                                    <div className="print:break-inside-avoid">
                                        <h4 className="font-semibold text-lg mb-3 flex items-center gap-2 text-indigo-700 dark:text-indigo-400 print:text-black">
                                            <Users className="w-5 h-5 print:hidden" />
                                            Tipos de Profissional ({profissionais?.length || 0})
                                        </h4>
                                        <div className="ml-4 print:ml-2">
                                            <ul className="list-disc ml-4 space-y-1">
                                                {profissionais?.map(prof => (
                                                    <li key={prof.profissional_id} className={`${colors.text.primary} print:text-black`}>
                                                        {prof.profissional_tipo}
                                                        {prof.profissional_descricao && <span className="text-sm text-gray-500 italic print:text-gray-600"> - {prof.profissional_descricao}</span>}
                                                    </li>
                                                ))}
                                            </ul>
                                            {(!profissionais || profissionais.length === 0) && (
                                                <p className="text-sm text-gray-400 italic">Nenhum tipo de profissional cadastrado</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Print Footer - only visible when printing */}
                                <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-500">
                                    <p>Documento gerado em {new Date().toLocaleString('pt-BR')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default Parameters;
