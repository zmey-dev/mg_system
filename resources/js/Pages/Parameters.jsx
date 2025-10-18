import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { router } from "@inertiajs/react";
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
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const Parameters = ({ auth, grupos, subgrupos, origens, tipos, doctoTipos, periodos, profissionais, empreendimentos }) => {
    const { isDark, colors } = useTheme();
    const [activeTab, setActiveTab] = useState("grupos");
    const [searchTerm, setSearchTerm] = useState("");
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

        if (!searchTerm || searchTerm.length < 3) return data;

        return data.filter((item) => {
            const nome = item.empreendimento_nome || item.itemgrupo_nome || item.itemsubgrupo_nome || item.origem_nome || item.tipo_nome ||
                        item.doctotipo_nome || item.periodo_nome || item.profissional_tipo || "";
            const descricao = item.itemgrupo_descricao || item.itemsubgrupo_descricao || item.profissional_descricao || "";

            return nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   descricao.toLowerCase().includes(searchTerm.toLowerCase());
        });
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
                title: "Grupos de Itens",
                singular: "Grupo",
                color: "blue",
            },
            subgrupos: {
                icon: <Grid3x3 className="w-4 h-4" />,
                title: "Subgrupos",
                singular: "Subgrupo",
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
        setShowAddModal(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        const nome = item.empreendimento_nome || item.itemgrupo_nome || item.itemsubgrupo_nome || item.origem_nome || item.tipo_nome ||
                    item.doctotipo_nome || item.periodo_nome || item.profissional_tipo || "";
        const descricao = item.itemgrupo_descricao || item.itemsubgrupo_descricao || item.profissional_descricao || "";
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
            },
            tipos: {
                tipo_nome: formData.nome,
            },
            doctoTipos: {
                doctotipo_nome: formData.nome,
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
        const descricao = item.itemgrupo_descricao || item.itemsubgrupo_descricao || item.profissional_descricao || "";
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
                                        Grupo: {grupoNome}
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
        return activeTab === "grupos" || activeTab === "subgrupos" || activeTab === "profissionais";
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

                        <Button
                            onClick={handleAdd}
                            className="w-full sm:w-auto bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-900 text-white shadow-sm hover:shadow-md transition-all whitespace-nowrap flex-shrink-0"
                        >
                            <Plus className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Adicionar {getTabConfig(activeTab).singular}</span>
                            <span className="sm:hidden">Adicionar {getTabConfig(activeTab).singular.split(' ')[0]}</span>
                        </Button>
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:max-w-lg">
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
                </div>

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
                                                <SelectValue placeholder="Selecione um grupo" />
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
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        cnpj: e.target.value,
                                                    })
                                                }
                                                placeholder="00.000.000/0000-00"
                                                className={colors.surface}
                                            />
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
                                        (isEmpreendimento() && (!formData.cnpj || !formData.endereco || !formData.numero || !formData.cep || !formData.cidade || !formData.uf))
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
        </MainLayout>
    );
};

export default Parameters;
