import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { router } from "@inertiajs/react";
import { Building2, Plus, Pencil, Trash2, Search } from "lucide-react";

const Torres = ({ auth, torres, empreendimentos }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingTorre, setEditingTorre] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        empreendimento_id: "",
        torre_nome: "",
        torre_qtdaptos: "",
    });

    const openAddModal = () => {
        setEditingTorre(null);
        setFormData({
            empreendimento_id: auth.user.empreendimento_id || "",
            torre_nome: "",
            torre_qtdaptos: "",
        });
        setShowModal(true);
    };

    const openEditModal = (torre) => {
        setEditingTorre(torre);
        setFormData({
            empreendimento_id: torre.empreendimento_id,
            torre_nome: torre.torre_nome,
            torre_qtdaptos: torre.torre_qtdaptos || "",
        });
        setShowModal(true);
    };

    const handleSave = () => {
        if (editingTorre) {
            router.put(route('torres.update', editingTorre.torre_id), formData, {
                preserveScroll: true,
                onSuccess: () => setShowModal(false)
            });
        } else {
            router.post(route('torres.store'), formData, {
                preserveScroll: true,
                onSuccess: () => setShowModal(false)
            });
        }
    };

    const handleDelete = (torre) => {
        if (!confirm(`Tem certeza que deseja excluir "${torre.torre_nome}"?`)) return;

        router.delete(route('torres.destroy', torre.torre_id), {
            preserveScroll: true
        });
    };

    const filteredTorres = torres.data?.filter(torre =>
        torre.torre_nome.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <MainLayout auth={auth}>
            <div className="py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Torres</h1>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Nova Torre
                    </button>
                </div>

                {/* Search */}
                <div className="mb-6 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar torres..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                </div>

                {/* Torre Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTorres.map((torre) => (
                        <div
                            key={torre.torre_id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                        <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                            {torre.torre_nome}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {torre.empreendimento?.empreendimento_nome}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {torre.torre_qtdaptos && (
                                <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                                    <span className="font-medium">Apartamentos:</span> {torre.torre_qtdaptos}
                                </div>
                            )}

                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => openEditModal(torre)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <Pencil className="w-4 h-4" />
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(torre)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredTorres.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        Nenhuma torre encontrada
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            {editingTorre ? "Editar Torre" : "Nova Torre"}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                                    Empreendimento
                                </label>
                                <select
                                    value={formData.empreendimento_id}
                                    onChange={(e) => setFormData({ ...formData, empreendimento_id: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    disabled={auth.user.role !== 'master'}
                                >
                                    <option value="">Selecione...</option>
                                    {empreendimentos.map((emp) => (
                                        <option key={emp.empreendimento_id} value={emp.empreendimento_id}>
                                            {emp.empreendimento_nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                                    Nome da Torre *
                                </label>
                                <input
                                    type="text"
                                    value={formData.torre_nome}
                                    onChange={(e) => setFormData({ ...formData, torre_nome: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Ex: Torre A"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                                    Quantidade de Apartamentos
                                </label>
                                <input
                                    type="number"
                                    value={formData.torre_qtdaptos}
                                    onChange={(e) => setFormData({ ...formData, torre_qtdaptos: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Ex: 48"
                                    min="1"
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
                                {editingTorre ? "Salvar" : "Criar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default Torres;
