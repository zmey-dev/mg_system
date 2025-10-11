import React, { useState } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { router } from "@inertiajs/react";
import { Building, Plus, Pencil, Search, MapPin } from "lucide-react";

const Empreendimentos = ({ auth, empreendimentos }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingEmpreendimento, setEditingEmpreendimento] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        empreendimento_nome: "",
        empreendimento_cnpj: "",
        empreendimento_endereco: "",
        empreendimento_numero: "",
        empreendimento_cep: "",
        empreendimento_cidade: "",
        empreendimento_uf: "",
        empreendimento_qtdtorre: "",
    });

    const openAddModal = () => {
        setEditingEmpreendimento(null);
        setFormData({
            empreendimento_nome: "",
            empreendimento_cnpj: "",
            empreendimento_endereco: "",
            empreendimento_numero: "",
            empreendimento_cep: "",
            empreendimento_cidade: "",
            empreendimento_uf: "",
            empreendimento_qtdtorre: "",
        });
        setShowModal(true);
    };

    const openEditModal = (empreendimento) => {
        setEditingEmpreendimento(empreendimento);
        setFormData({
            empreendimento_nome: empreendimento.empreendimento_nome,
            empreendimento_status: empreendimento.empreendimento_status || "ativo",
        });
        setShowModal(true);
    };

    const handleSave = () => {
        if (editingEmpreendimento) {
            router.put(route('empreendimentos.update', editingEmpreendimento.empreendimento_id), {
                empreendimento_nome: formData.empreendimento_nome,
                empreendimento_status: formData.empreendimento_status,
            }, {
                preserveScroll: true,
                onSuccess: () => setShowModal(false)
            });
        } else {
            router.post(route('empreendimentos.store'), formData, {
                preserveScroll: true,
                onSuccess: () => setShowModal(false)
            });
        }
    };

    const filteredEmpreendimentos = empreendimentos.data?.filter(emp =>
        emp.empreendimento_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.empreendimento_cidade?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <MainLayout auth={auth}>
            <div className="py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Empreendimentos</h1>
                    {auth.user.role === 'master' && (
                        <button
                            onClick={openAddModal}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Novo Empreendimento
                        </button>
                    )}
                </div>

                {/* Search */}
                <div className="mb-6 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar empreendimentos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                </div>

                {/* Empreendimento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEmpreendimentos.map((emp) => (
                        <div
                            key={emp.empreendimento_id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                        <Building className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                            {emp.empreendimento_nome}
                                        </h3>
                                        {emp.empreendimento_cnpj && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                CNPJ: {emp.empreendimento_cnpj}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {emp.empreendimento_status === 'bloqueado' && (
                                    <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded">
                                        Bloqueado
                                    </span>
                                )}
                            </div>

                            {(emp.empreendimento_endereco || emp.empreendimento_cidade) && (
                                <div className="mb-3 flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <div>
                                        {emp.empreendimento_endereco && (
                                            <div>{emp.empreendimento_endereco}, {emp.empreendimento_numero}</div>
                                        )}
                                        {emp.empreendimento_cidade && (
                                            <div>{emp.empreendimento_cidade}/{emp.empreendimento_uf} - CEP: {emp.empreendimento_cep}</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    <span className="font-medium">{emp.torres?.length || 0}</span> torres
                                </div>
                                {(auth.user.role === 'master' || auth.user.role === 'sindico') && (
                                    <button
                                        onClick={() => openEditModal(emp)}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                        Editar
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredEmpreendimentos.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        Nenhum empreendimento encontrado
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            {editingEmpreendimento ? "Editar Empreendimento" : "Novo Empreendimento"}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                                    Nome do Empreendimento *
                                </label>
                                <input
                                    type="text"
                                    value={formData.empreendimento_nome}
                                    onChange={(e) => setFormData({ ...formData, empreendimento_nome: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Ex: Condomínio Residencial Vista Alegre"
                                />
                            </div>

                            {!editingEmpreendimento && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                                            CNPJ *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.empreendimento_cnpj}
                                            onChange={(e) => setFormData({ ...formData, empreendimento_cnpj: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="00.000.000/0000-00"
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                                                Endereço *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.empreendimento_endereco}
                                                onChange={(e) => setFormData({ ...formData, empreendimento_endereco: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="Rua, Avenida..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                                                Número *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.empreendimento_numero}
                                                onChange={(e) => setFormData({ ...formData, empreendimento_numero: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="123"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                                                CEP *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.empreendimento_cep}
                                                onChange={(e) => setFormData({ ...formData, empreendimento_cep: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="00000-000"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                                                Cidade *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.empreendimento_cidade}
                                                onChange={(e) => setFormData({ ...formData, empreendimento_cidade: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="São Paulo"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                                                UF *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.empreendimento_uf}
                                                onChange={(e) => setFormData({ ...formData, empreendimento_uf: e.target.value.toUpperCase() })}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="SP"
                                                maxLength="2"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                                            Quantidade de Torres
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.empreendimento_qtdtorre}
                                            onChange={(e) => setFormData({ ...formData, empreendimento_qtdtorre: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="1"
                                            min="1"
                                        />
                                    </div>
                                </>
                            )}

                            {editingEmpreendimento && (
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
                                        Status
                                    </label>
                                    <select
                                        value={formData.empreendimento_status}
                                        onChange={(e) => setFormData({ ...formData, empreendimento_status: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="ativo">Ativo</option>
                                        <option value="bloqueado">Bloqueado</option>
                                    </select>
                                </div>
                            )}
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
                                {editingEmpreendimento ? "Salvar" : "Criar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default Empreendimentos;
