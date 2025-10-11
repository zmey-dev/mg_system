import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { router } from "@inertiajs/react";
import { MapPin, Plus, Pencil, Trash2, Search, Building2 } from "lucide-react";

const Ambientes = ({ auth, ambientes, torres }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingAmbiente, setEditingAmbiente] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        torre_id: "",
        ambiente_nome: "",
        ambiente_descricao: "",
    });

    const openAddModal = () => {
        setEditingAmbiente(null);
        setFormData({
            torre_id: "",
            ambiente_nome: "",
            ambiente_descricao: "",
        });
        setShowModal(true);
    };

    const openEditModal = (ambiente) => {
        setEditingAmbiente(ambiente);
        setFormData({
            torre_id: ambiente.torre_id,
            ambiente_nome: ambiente.ambiente_nome,
            ambiente_descricao: ambiente.ambiente_descricao || "",
        });
        setShowModal(true);
    };

    const handleSave = () => {
        if (editingAmbiente) {
            router.put(route('ambientes.update', editingAmbiente.ambiente_id), formData, {
                preserveScroll: true,
                onSuccess: () => setShowModal(false)
            });
        } else {
            router.post(route('ambientes.store'), formData, {
                preserveScroll: true,
                onSuccess: () => setShowModal(false)
            });
        }
    };

    const handleDelete = (ambiente) => {
        if (!confirm(`Tem certeza que deseja excluir "${ambiente.ambiente_nome}"?`)) return;

        router.delete(route('ambientes.destroy', ambiente.ambiente_id), {
            preserveScroll: true
        });
    };

    const filteredAmbientes = ambientes.data?.filter(ambiente =>
        ambiente.ambiente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ambiente.torre?.torre_nome?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <MainLayout auth={auth}>
            <div className="py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ambientes</h1>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Novo Ambiente
                    </button>
                </div>

                {/* Search */}
                <div className="mb-6 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar ambientes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                </div>

                {/* Ambiente Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAmbientes.map((ambiente) => (
                        <div
                            key={ambiente.ambiente_id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                        <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                            {ambiente.ambiente_nome}
                                        </h3>
                                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                            <Building2 className="w-3 h-3" />
                                            {ambiente.torre?.torre_nome}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {ambiente.ambiente_descricao && (
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                                    {ambiente.ambiente_descricao}
                                </p>
                            )}

                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => openEditModal(ambiente)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <Pencil className="w-4 h-4" />
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(ambiente)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredAmbientes.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        Nenhum ambiente encontrado
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            {editingAmbiente ? "Editar Ambiente" : "Novo Ambiente"}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                                    Torre *
                                </label>
                                <select
                                    value={formData.torre_id}
                                    onChange={(e) => setFormData({ ...formData, torre_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="">Selecione uma torre...</option>
                                    {torres.map((torre) => (
                                        <option key={torre.torre_id} value={torre.torre_id}>
                                            {torre.torre_nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                                    Nome do Ambiente *
                                </label>
                                <input
                                    type="text"
                                    value={formData.ambiente_nome}
                                    onChange={(e) => setFormData({ ...formData, ambiente_nome: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Ex: Salão de Festas"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                                    Descrição
                                </label>
                                <textarea
                                    value={formData.ambiente_descricao}
                                    onChange={(e) => setFormData({ ...formData, ambiente_descricao: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    rows="3"
                                    placeholder="Descrição adicional (opcional)"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {editingAmbiente ? "Salvar" : "Criar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default Ambientes;
