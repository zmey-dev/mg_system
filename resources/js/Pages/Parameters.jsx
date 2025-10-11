import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
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
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const Parameters = ({ auth, grupos, origens, tipos, doctoTipos, periodos, profissionais }) => {
    const { isDark, colors } = useTheme();
    const [activeTab, setActiveTab] = useState("grupos");
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        nome: "",
        descricao: "",
        dias: "",
    });

    const getDataForTab = () => {
        let data = [];
        switch (activeTab) {
            case "grupos":
                data = grupos || [];
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
            const nome = item.itemgrupo_nome || item.origem_nome || item.tipo_nome ||
                        item.doctotipo_nome || item.periodo_nome || item.profissional_tipo || "";
            const descricao = item.itemgrupo_descricao || item.profissional_descricao || "";

            return nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   descricao.toLowerCase().includes(searchTerm.toLowerCase());
        });
    };

    const getTabConfig = (tab) => {
        const configs = {
            grupos: {
                icon: <FolderTree className="w-4 h-4" />,
                title: "Grupos de Itens",
                singular: "Grupo",
                color: "blue",
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
        setFormData({ nome: "", descricao: "", dias: "" });
        setShowAddModal(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        const nome = item.itemgrupo_nome || item.origem_nome || item.tipo_nome ||
                    item.doctotipo_nome || item.periodo_nome || item.profissional_tipo || "";
        const descricao = item.itemgrupo_descricao || item.profissional_descricao || "";
        const dias = item.periodo_dias || "";

        setFormData({ nome, descricao, dias });
        setShowAddModal(true);
    };

    const handleSave = () => {
        const routes = {
            grupos: "parameters.grupos.store",
            origens: "parameters.origem.store",
            tipos: "parameters.tipo.store",
            doctoTipos: "parameters.doctotipo.store",
            periodos: "parameters.periodo.store",
            profissionais: "parameters.profissional.store",
        };

        const fieldMappings = {
            grupos: {
                itemgrupo_nome: formData.nome,
                itemgrupo_descricao: formData.descricao,
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

        router.post(route(routes[activeTab]), fieldMappings[activeTab], {
            onSuccess: () => {
                setShowAddModal(false);
                setEditingItem(null);
                setFormData({ nome: "", descricao: "", dias: "" });
            },
        });
    };

    const handleDelete = (item) => {
        if (!confirm("Tem certeza que deseja excluir este item?")) return;

        const routes = {
            grupos: "parameters.grupos.destroy",
            origens: "parameters.origem.destroy",
            tipos: "parameters.tipo.destroy",
            doctoTipos: "parameters.doctotipo.destroy",
            periodos: "parameters.periodo.destroy",
            profissionais: "parameters.profissional.destroy",
        };

        const id = item.itemgrupo_id || item.origem_id || item.tipo_id ||
                  item.doctotipo_id || item.periodo_id || item.profissional_id;

        router.delete(route(routes[activeTab], id), {
            preserveScroll: true,
        });
    };

    const renderItemCard = (item) => {
        const config = getTabConfig(activeTab);
        const nome = item.itemgrupo_nome || item.origem_nome || item.tipo_nome ||
                    item.doctotipo_nome || item.periodo_nome || item.profissional_tipo || "";
        const descricao = item.itemgrupo_descricao || item.profissional_descricao || "";
        const dias = item.periodo_dias;
        const id = item.itemgrupo_id || item.origem_id || item.tipo_id ||
                  item.doctotipo_id || item.periodo_id || item.profissional_id;

        return (
            <Card
                key={id}
                className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all rounded-xl"
            >
                <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`text-${config.color}-600`}>
                                    {config.icon}
                                </div>
                                <h3 className={`font-semibold text-lg ${colors.text.primary}`}>
                                    {nome}
                                </h3>
                            </div>
                            {descricao && (
                                <p className="text-sm text-gray-700 dark:text-gray-200 italic mb-2">
                                    {descricao}
                                </p>
                            )}
                            {dias && (
                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{dias} {dias === 1 ? "dia" : "dias"}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-start gap-3 ml-6">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(item)}
                                className="border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                            >
                                <Edit className="w-4 h-4 mr-1.5" />
                                Editar
                            </Button>
                            {auth.user.role === "master" && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(item)}
                                    className="border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-600 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4 mr-1.5" />
                                    Excluir
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
        return activeTab === "grupos" || activeTab === "profissionais";
    };

    const needsDias = () => {
        return activeTab === "periodos";
    };

    return (
        <MainLayout auth={auth}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className={`text-3xl font-semibold ${colors.text.primary}`}>
                            Parâmetros do Sistema
                        </h1>
                        <p className={`${colors.text.secondary} mt-1`}>
                            Gerencie os parâmetros e configurações globais
                        </p>
                    </div>

                    <Button
                        onClick={handleAdd}
                        className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-900 text-white shadow-sm hover:shadow-md transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar {getTabConfig(activeTab).singular}
                    </Button>
                </div>

                {/* Search */}
                <div className="relative max-w-lg">
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

                {/* Tabs */}
                <Card className={`${colors.card} backdrop-blur-sm border ${colors.border} shadow-lg`}>
                    <CardContent className="p-8">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className={`grid w-full grid-cols-3 lg:grid-cols-6 mb-6 ${colors.surface} p-1`}>
                                {["grupos", "origens", "tipos", "doctoTipos", "periodos", "profissionais"].map((tab) => {
                                    const config = getTabConfig(tab);
                                    const data = tab === "grupos" ? grupos :
                                               tab === "origens" ? origens :
                                               tab === "tipos" ? tipos :
                                               tab === "doctoTipos" ? doctoTipos :
                                               tab === "periodos" ? periodos :
                                               profissionais;

                                    return (
                                        <TabsTrigger
                                            key={tab}
                                            value={tab}
                                            className={`flex items-center gap-2 relative ${
                                                activeTab === tab
                                                    ? `${colors.card} ${colors.text.primary} shadow-sm border-b-2 border-blue-600`
                                                    : `${colors.text.secondary} hover:${colors.text.primary}`
                                            }`}
                                        >
                                            {config.icon}
                                            <span className="hidden sm:inline">{config.title}</span>
                                            <Badge variant="secondary" className="ml-1 text-xs">
                                                {data?.length || 0}
                                            </Badge>
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>

                            {["grupos", "origens", "tipos", "doctoTipos", "periodos", "profissionais"].map((tab) => (
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className={`${colors.card} rounded-lg w-full max-w-md`}>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className={`text-xl font-semibold ${colors.text.primary}`}>
                                    {editingItem ? "Editar" : "Adicionar"} {getTabConfig(activeTab).singular}
                                </h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowAddModal(false)}
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
                            </div>

                            <div className={`flex items-center justify-end gap-4 mt-6 pt-4 border-t ${colors.border}`}>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={!formData.nome}
                                    className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-900 text-white"
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
