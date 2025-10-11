import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { router } from "@inertiajs/react";
import {
    Package,
    Plus,
    Edit,
    Trash2,
    X,
    Search,
    Upload,
    Image as ImageIcon
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const Items = ({ auth, items, ambientes, subgrupos }) => {
    const { isDark, colors } = useTheme();
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        ambiente_id: "",
        itemsubgrupo_id: "",
        item_nome: "",
        item_descricao: "",
        item_status: "ativo",
        item_imagem: null
    });
    const [photoPreview, setPhotoPreview] = useState(null);

    const handleAdd = () => {
        setEditingItem(null);
        setFormData({
            ambiente_id: "",
            itemsubgrupo_id: "",
            item_nome: "",
            item_descricao: "",
            item_status: "ativo",
            item_imagem: null
        });
        setPhotoPreview(null);
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            ambiente_id: item.ambiente_id,
            itemsubgrupo_id: item.itemsubgrupo_id,
            item_nome: item.item_nome,
            item_descricao: item.item_descricao || "",
            item_status: item.item_status || "ativo",
            item_imagem: null
        });
        setPhotoPreview(item.item_imagem ? `/storage/${item.item_imagem}` : null);
        setShowModal(true);
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, item_imagem: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        const data = new FormData();
        data.append('ambiente_id', formData.ambiente_id);
        data.append('itemsubgrupo_id', formData.itemsubgrupo_id);
        data.append('item_nome', formData.item_nome);
        data.append('item_descricao', formData.item_descricao);
        data.append('item_status', formData.item_status);
        if (formData.item_imagem) {
            data.append('item_imagem', formData.item_imagem);
        }

        if (editingItem) {
            data.append('_method', 'PUT');
            router.post(route('items.update', editingItem.item_id), data, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowModal(false);
                }
            });
        } else {
            router.post(route('items.store'), data, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowModal(false);
                }
            });
        }
    };

    const handleDelete = (item) => {
        if (!confirm(`Tem certeza que deseja excluir "${item.item_nome}"?`)) return;

        router.delete(route('items.destroy', item.item_id), {
            preserveScroll: true
        });
    };

    const filteredItems = items?.data?.filter(item =>
        item.item_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.item_descricao?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const getStatusColor = (status) => {
        switch (status) {
            case 'ativo': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'manutencao': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'inativo': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
            case 'critico': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'ativo': return 'Ativo';
            case 'manutencao': return 'Manutenção';
            case 'inativo': return 'Inativo';
            case 'critico': return 'Crítico';
            default: return status;
        }
    };

    return (
        <MainLayout auth={auth}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className={`text-3xl font-semibold ${colors.text.primary}`}>
                            Itens
                        </h1>
                        <p className={`${colors.text.secondary} mt-1`}>
                            Gerencie os itens do condomínio
                        </p>
                    </div>

                    <Button
                        onClick={handleAdd}
                        className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-900 text-white shadow-sm hover:shadow-md transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Item
                    </Button>
                </div>

                {/* Search */}
                <div className="relative max-w-lg">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${colors.text.muted} w-4 h-4`} />
                    <Input
                        placeholder="Buscar itens..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`pl-10 border ${colors.border} ${colors.surface} ${colors.text.primary}`}
                    />
                </div>

                {/* Items List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredItems.map((item) => (
                        <Card key={item.item_id} className={`${colors.card} border ${colors.border}`}>
                            <CardContent className="p-4">
                                {item.item_imagem && (
                                    <img
                                        src={`/storage/${item.item_imagem}`}
                                        alt={item.item_nome}
                                        className="w-full h-40 object-cover rounded-lg mb-3"
                                    />
                                )}
                                {!item.item_imagem && (
                                    <div className="w-full h-40 bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                                        <ImageIcon className="w-12 h-12 text-gray-400" />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <div className="flex items-start justify-between">
                                        <h3 className={`font-semibold ${colors.text.primary}`}>
                                            {item.item_nome}
                                        </h3>
                                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.item_status)}`}>
                                            {getStatusLabel(item.item_status)}
                                        </span>
                                    </div>

                                    {item.item_descricao && (
                                        <p className={`text-sm ${colors.text.secondary} line-clamp-2`}>
                                            {item.item_descricao}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <Package className="w-3.5 h-3.5" />
                                        <span>{item.subgrupo?.itemsubgrupo_nome || 'N/A'}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <span>{item.ambiente?.ambiente_nome || 'N/A'}</span>
                                    </div>

                                    <div className="flex items-center gap-2 pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(item)}
                                            className="flex-1"
                                        >
                                            <Edit className="w-3.5 h-3.5 mr-1" />
                                            Editar
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDelete(item)}
                                            className="text-red-600 hover:text-red-700 hover:border-red-300"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-12">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className={`${colors.text.secondary}`}>
                            Nenhum item encontrado.
                        </p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className={`${colors.card} rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className={`text-xl font-semibold ${colors.text.primary}`}>
                                    {editingItem ? "Editar" : "Adicionar"} Item
                                </h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowModal(false)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>
                                        Nome do Item *
                                    </label>
                                    <Input
                                        value={formData.item_nome}
                                        onChange={(e) => setFormData({ ...formData, item_nome: e.target.value })}
                                        placeholder="Digite o nome do item"
                                        className={colors.surface}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>
                                            Ambiente *
                                        </label>
                                        <select
                                            value={formData.ambiente_id}
                                            onChange={(e) => setFormData({ ...formData, ambiente_id: e.target.value })}
                                            className={`w-full px-3 py-2 border ${colors.border} rounded-md ${colors.surface} ${colors.text.primary}`}
                                        >
                                            <option value="">Selecione...</option>
                                            {ambientes?.map(amb => (
                                                <option key={amb.ambiente_id} value={amb.ambiente_id}>
                                                    {amb.torre?.torre_nome} - {amb.ambiente_nome}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>
                                            Subgrupo *
                                        </label>
                                        <select
                                            value={formData.itemsubgrupo_id}
                                            onChange={(e) => setFormData({ ...formData, itemsubgrupo_id: e.target.value })}
                                            className={`w-full px-3 py-2 border ${colors.border} rounded-md ${colors.surface} ${colors.text.primary}`}
                                        >
                                            <option value="">Selecione...</option>
                                            {subgrupos?.map(sub => (
                                                <option key={sub.itemsubgrupo_id} value={sub.itemsubgrupo_id}>
                                                    {sub.grupo?.itemgrupo_nome} → {sub.itemsubgrupo_nome}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>
                                        Status
                                    </label>
                                    <select
                                        value={formData.item_status}
                                        onChange={(e) => setFormData({ ...formData, item_status: e.target.value })}
                                        className={`w-full px-3 py-2 border ${colors.border} rounded-md ${colors.surface} ${colors.text.primary}`}
                                    >
                                        <option value="ativo">Ativo</option>
                                        <option value="inativo">Inativo</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>
                                        Descrição
                                    </label>
                                    <Textarea
                                        value={formData.item_descricao}
                                        onChange={(e) => setFormData({ ...formData, item_descricao: e.target.value })}
                                        placeholder="Digite a descrição"
                                        rows={3}
                                        className={colors.surface}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                                        Foto do Item
                                    </label>
                                    {photoPreview && (
                                        <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-2" />
                                    )}
                                    <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                                        <div className="text-center">
                                            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            <span className={`text-sm ${colors.text.secondary}`}>
                                                Clique para fazer upload da foto
                                            </span>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className={`flex items-center justify-end gap-4 mt-6 pt-4 border-t ${colors.border}`}>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={!formData.item_nome || !formData.ambiente_id || !formData.itemsubgrupo_id}
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

export default Items;
