import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router } from '@inertiajs/react';
import {
    Building2,
    ChevronRight,
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    FolderTree,
    Home,
    Settings,
    Package,
    Layers,
    Grid3x3,
    FileText,
    MoreVertical,
    MapPin,
    Tag,
    Users,
    Calendar,
    Star,
    Archive,
    Camera,
    Upload,
    Image,
    QrCode,
    X,
    Check,
    AlertCircle
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

export default function Catalog({ auth, torres, grupos, empreendimentos, origens, tipos, doctoTipos, periodos, profissionais }) {
    const { isDark, colors } = useTheme();
    const [selectedCategory, setSelectedCategory] = useState('towers');
    const [expandedItems, setExpandedItems] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [selectedItemForActivity, setSelectedItemForActivity] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [activityFormData, setActivityFormData] = useState({
        origem_id: '',
        tipo_id: '',
        doctotipo_id: '',
        periodo_id: '',
        profissional_id: '',
        atividade_descricao: '',
        atividade_prioridade: 'media',
        atividade_dtestimada: '',
    });
    const [formData, setFormData] = useState({
        empreendimento_id: '',
        torre_nome: '',
        torre_qtdaptos: '',
        ambiente_nome: '',
        ambiente_descricao: '',
        torre_id: '',
        item_nome: '',
        item_descricao: '',
        ambiente_id: '',
        itemgrupo_id: '',
        itemsubgrupo_id: '',
        item_imagem: null
    });

    // Transform backend data to tree structure
    const catalogData = {
        towers: torres?.map(torre => ({
            id: `tower-${torre.torre_id}`,
            name: torre.torre_nome,
            type: 'tower',
            code: `TWR-${torre.torre_id}`,
            description: `Torre com ${torre.torre_qtdaptos} apartamentos`,
            status: 'active',
            totalUnits: torre.torre_qtdaptos,
            children: torre.ambientes?.map(ambiente => ({
                id: `env-${ambiente.ambiente_id}`,
                name: ambiente.ambiente_nome,
                type: 'environment',
                code: `ENV-${ambiente.ambiente_id}`,
                description: ambiente.ambiente_descricao || '',
                status: 'active',
                children: ambiente.items?.map(item => ({
                    id: `item-${item.item_id}`,
                    name: item.item_nome,
                    type: 'item',
                    code: `ITEM-${item.item_id}`,
                    description: item.item_descricao || '',
                    status: item.item_status,
                    model: item.item_marcamodelo || '',
                    photo: item.item_imagem_url || null,
                    qrCode: item.item_qrcode || null,
                    hasPhoto: !!item.item_imagem,
                    subgroup: item.subgrupo?.itemsubgrupo_nome || '',
                    group: item.subgrupo?.grupo?.itemgrupo_nome || ''
                })) || []
            })) || []
        })) || [],
        environments: torres?.flatMap(torre =>
            torre.ambientes?.map(ambiente => ({
                id: `env-${ambiente.ambiente_id}`,
                name: ambiente.ambiente_nome,
                type: 'environment',
                code: `ENV-${ambiente.ambiente_id}`,
                description: ambiente.ambiente_descricao || '',
                status: 'active',
                tower: torre.torre_nome,
                children: ambiente.items?.map(item => ({
                    id: `item-${item.item_id}`,
                    name: item.item_nome,
                    type: 'item',
                    code: `ITEM-${item.item_id}`,
                    description: item.item_descricao || '',
                    status: item.item_status,
                })) || []
            })) || []
        ) || [],
        groups: grupos?.map(grupo => ({
            id: `group-${grupo.itemgrupo_id}`,
            name: grupo.itemgrupo_nome,
            type: 'group',
            code: `GRP-${grupo.itemgrupo_id}`,
            description: grupo.itemgrupo_descricao || '',
            status: 'active',
            children: grupo.subgrupos?.map(subgrupo => ({
                id: `subgroup-${subgrupo.itemsubgrupo_id}`,
                name: subgrupo.itemsubgrupo_nome,
                type: 'subgroup',
                code: `SUB-${subgrupo.itemsubgrupo_id}`,
                description: subgrupo.itemsubgrupo_descricao || '',
                status: 'active',
                children: subgrupo.items?.map(item => ({
                    id: `item-${item.item_id}`,
                    name: item.item_nome,
                    type: 'item',
                    code: `ITEM-${item.item_id}`,
                    description: item.item_descricao || '',
                    status: item.item_status,
                    model: item.item_marcamodelo || '',
                    photo: item.item_imagem_url || null,
                    qrCode: item.item_qrcode || null,
                    hasPhoto: !!item.item_imagem,
                    environment: item.ambiente?.ambiente_nome || '',
                    tower: item.ambiente?.torre?.torre_nome || ''
                })) || []
            })) || []
        })) || [],
        subgroups: grupos?.flatMap(grupo =>
            grupo.subgrupos?.map(subgrupo => ({
                id: `subgroup-${subgrupo.itemsubgrupo_id}`,
                name: subgrupo.itemsubgrupo_nome,
                type: 'subgroup',
                code: `SUB-${subgrupo.itemsubgrupo_id}`,
                description: subgrupo.itemsubgrupo_descricao || '',
                status: 'active',
                group: grupo.itemgrupo_nome,
                children: subgrupo.items?.map(item => ({
                    id: `item-${item.item_id}`,
                    name: item.item_nome,
                    type: 'item',
                    code: `ITEM-${item.item_id}`,
                    description: item.item_descricao || '',
                    status: item.item_status,
                    model: item.item_marcamodelo || '',
                    photo: item.item_imagem_url || null,
                    qrCode: item.item_qrcode || null,
                    hasPhoto: !!item.item_imagem,
                    environment: item.ambiente?.ambiente_nome || '',
                    tower: item.ambiente?.torre?.torre_nome || ''
                })) || []
            })) || []
        ) || [],
        items: torres?.flatMap(torre =>
            torre.ambientes?.flatMap(ambiente =>
                ambiente.items?.map(item => ({
                    id: `item-${item.item_id}`,
                    name: item.item_nome,
                    type: 'item',
                    code: `ITEM-${item.item_id}`,
                    description: item.item_descricao || '',
                    status: item.item_status,
                    model: item.item_marcamodelo || '',
                    photo: item.item_imagem_url || null,
                    qrCode: item.item_qrcode || null,
                    hasPhoto: !!item.item_imagem,
                    subgroup: item.subgrupo?.itemsubgrupo_nome || '',
                    group: item.subgrupo?.grupo?.itemgrupo_nome || '',
                    environment: ambiente.ambiente_nome,
                    tower: torre.torre_nome,
                })) || []
            ) || []
        ) || []
    };

    // Calculate real counts
    const totalTowers = torres?.length || 0;
    const totalEnvironments = torres?.reduce((sum, t) => sum + (t.ambientes?.length || 0), 0) || 0;
    const totalItems = torres?.reduce((sum, t) =>
        sum + (t.ambientes?.reduce((eSum, e) => eSum + (e.items?.length || 0), 0) || 0), 0) || 0;
    const totalGroups = grupos?.length || 0;
    const totalSubgroups = grupos?.reduce((sum, g) => sum + (g.subgrupos?.length || 0), 0) || 0;

    const categories = [
        { id: 'towers', name: 'Torres', icon: Building2, count: totalTowers },
        { id: 'environments', name: 'Ambientes', icon: Home, count: totalEnvironments },
        { id: 'groups', name: 'Grupos', icon: Layers, count: totalGroups },
        { id: 'subgroups', name: 'Subgrupos', icon: Grid3x3, count: totalSubgroups },
        { id: 'items', name: 'Itens', icon: Package, count: totalItems }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
            case 'maintenance': return 'bg-amber-50 text-amber-600 border-amber-200';
            case 'inactive': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'critical': return 'bg-red-50 text-red-600 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'tower': return <Building2 className="w-4 h-4" />;
            case 'environment': return <Home className="w-4 h-4" />;
            case 'group': return <Layers className="w-4 h-4" />;
            case 'subgroup': return <Grid3x3 className="w-4 h-4" />;
            case 'item': return <Package className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    const toggleExpanded = (itemId) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(itemId)) {
            newExpanded.delete(itemId);
        } else {
            newExpanded.add(itemId);
        }
        setExpandedItems(newExpanded);
    };

    // CRUD functions
    const handleAdd = () => {
        setEditingItem(null);
        setErrorMessage('');
        setFormData({
            torre_nome: '',
            torre_qtdaptos: '',
            ambiente_nome: '',
            ambiente_descricao: '',
            torre_id: '',
            item_nome: '',
            item_descricao: '',
            ambiente_id: '',
            itemgrupo_id: '',
            itemsubgrupo_id: '',
            item_imagem: null
        });
        setShowAddModal(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setErrorMessage('');
        const itemId = item.id.split('-')[1];
        const itemType = item.id.split('-')[0];

        if (itemType === 'tower') {
            setFormData({
                ...formData,
                torre_nome: item.name,
                torre_qtdaptos: item.totalUnits || ''
            });
        } else if (itemType === 'env') {
            setFormData({
                ...formData,
                ambiente_nome: item.name,
                ambiente_descricao: item.description || ''
            });
        } else if (itemType === 'item') {
            setFormData({
                ...formData,
                item_nome: item.name,
                item_descricao: item.description || ''
            });
        }

        setShowEditModal(true);
    };

    const handleSave = () => {
        console.log('handleSave called', { selectedCategory, formData, editingItem });

        // Redirect to Parameters page for groups and subgroups
        if (selectedCategory === 'groups' || selectedCategory === 'subgroups') {
            router.visit('/parameters');
            return;
        }

        if (editingItem) {
            // Edit existing
            const itemId = editingItem.id.split('-')[1];
            const itemType = editingItem.id.split('-')[0];

            if (itemType === 'tower') {
                const updateData = {
                    torre_nome: formData.torre_nome
                };
                if (formData.torre_qtdaptos && formData.torre_qtdaptos !== '') {
                    updateData.torre_qtdaptos = parseInt(formData.torre_qtdaptos);
                }
                router.put(route('torres.update', itemId), updateData, {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        setShowEditModal(false);
                        setEditingItem(null);
                        setFormData({
                            empreendimento_id: '',
                            torre_nome: '',
                            torre_qtdaptos: '',
                            ambiente_nome: '',
                            ambiente_descricao: '',
                            torre_id: '',
                            item_nome: '',
                            item_descricao: '',
                            ambiente_id: '',
                            itemgrupo_id: '',
                            itemsubgrupo_id: '',
                            item_imagem: null
                        });
                    },
                    onError: (errors) => {
                        console.error('Error updating torre:', errors);
                    }
                });
            } else if (itemType === 'env') {
                router.put(route('ambientes.update', itemId), {
                    ambiente_nome: formData.ambiente_nome,
                    ambiente_descricao: formData.ambiente_descricao
                }, {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        setShowEditModal(false);
                        setEditingItem(null);
                        setFormData({
                            empreendimento_id: '',
                            torre_nome: '',
                            torre_qtdaptos: '',
                            ambiente_nome: '',
                            ambiente_descricao: '',
                            torre_id: '',
                            item_nome: '',
                            item_descricao: '',
                            ambiente_id: '',
                            itemgrupo_id: '',
                            itemsubgrupo_id: '',
                            item_imagem: null
                        });
                    },
                    onError: (errors) => {
                        console.error('Error updating ambiente:', errors);
                    }
                });
            } else if (itemType === 'item') {
                // Validate image size (5MB = 5120KB)
                if (formData.item_imagem && formData.item_imagem.size > 5120 * 1024) {
                    setErrorMessage('The image file must not be greater than 5MB (5120 kilobytes).');
                    return;
                }

                const data = new FormData();
                data.append('item_nome', formData.item_nome);
                data.append('item_descricao', formData.item_descricao);
                if (formData.item_imagem) {
                    data.append('item_imagem', formData.item_imagem);
                }
                data.append('_method', 'PUT');

                setErrorMessage('');
                router.post(route('items.update', itemId), data, {
                    forceFormData: true,
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        setShowEditModal(false);
                        setEditingItem(null);
                        setFormData({
                            empreendimento_id: '',
                            torre_nome: '',
                            torre_qtdaptos: '',
                            ambiente_nome: '',
                            ambiente_descricao: '',
                            torre_id: '',
                            item_nome: '',
                            item_descricao: '',
                            ambiente_id: '',
                            itemgrupo_id: '',
                            itemsubgrupo_id: '',
                            item_imagem: null
                        });
                        setErrorMessage('');
                    },
                    onError: (errors) => {
                        console.error('Error updating item:', errors);
                        const errorMsg = Object.values(errors).flat().join(', ');
                        setErrorMessage(errorMsg || 'An error occurred while updating the item.');
                    }
                });
            }
        } else {
            // Create new
            if (selectedCategory === 'towers') {
                router.post(route('torres.store'), {
                    empreendimento_id: formData.empreendimento_id || auth.user.empreendimento_id,
                    torre_nome: formData.torre_nome,
                    torre_qtdaptos: parseInt(formData.torre_qtdaptos) || 0
                }, {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        setShowAddModal(false);
                        setFormData({
                            empreendimento_id: '',
                            torre_nome: '',
                            torre_qtdaptos: '',
                            ambiente_nome: '',
                            ambiente_descricao: '',
                            torre_id: '',
                            item_nome: '',
                            item_descricao: '',
                            ambiente_id: '',
                            itemgrupo_id: '',
                            itemsubgrupo_id: '',
                            item_imagem: null
                        });
                    },
                    onError: (errors) => {
                        console.error('Error creating torre:', errors);
                    }
                });
            } else if (selectedCategory === 'environments') {
                router.post(route('ambientes.store'), {
                    torre_id: parseInt(formData.torre_id),
                    ambiente_nome: formData.ambiente_nome,
                    ambiente_descricao: formData.ambiente_descricao
                }, {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        setShowAddModal(false);
                        setFormData({
                            empreendimento_id: '',
                            torre_nome: '',
                            torre_qtdaptos: '',
                            ambiente_nome: '',
                            ambiente_descricao: '',
                            torre_id: '',
                            item_nome: '',
                            item_descricao: '',
                            ambiente_id: '',
                            itemgrupo_id: '',
                            itemsubgrupo_id: '',
                            item_imagem: null
                        });
                    },
                    onError: (errors) => {
                        console.error('Error creating ambiente:', errors);
                    }
                });
            } else if (selectedCategory === 'items') {
                // Validate image size (5MB = 5120KB)
                if (formData.item_imagem && formData.item_imagem.size > 5120 * 1024) {
                    setErrorMessage('The image file must not be greater than 5MB (5120 kilobytes).');
                    return;
                }

                const data = new FormData();
                data.append('ambiente_id', parseInt(formData.ambiente_id));
                data.append('itemsubgrupo_id', parseInt(formData.itemsubgrupo_id));
                data.append('item_nome', formData.item_nome);
                data.append('item_descricao', formData.item_descricao || '');
                if (formData.item_imagem) {
                    data.append('item_imagem', formData.item_imagem);
                }

                setErrorMessage('');
                router.post(route('items.store'), data, {
                    forceFormData: true,
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        setShowAddModal(false);
                        setFormData({
                            empreendimento_id: '',
                            torre_nome: '',
                            torre_qtdaptos: '',
                            ambiente_nome: '',
                            ambiente_descricao: '',
                            torre_id: '',
                            item_nome: '',
                            item_descricao: '',
                            ambiente_id: '',
                            itemgrupo_id: '',
                            itemsubgrupo_id: '',
                            item_imagem: null
                        });
                        setErrorMessage('');
                    },
                    onError: (errors) => {
                        console.error('Error creating item:', errors);
                        const errorMsg = Object.values(errors).flat().join(', ');
                        setErrorMessage(errorMsg || 'An error occurred while creating the item.');
                    }
                });
            }
        }
    };

    const handleDelete = (item) => {
        if (!confirm('Tem certeza que deseja excluir este item?')) return;

        const itemId = item.id.split('-')[1];
        const itemType = item.id.split('-')[0];

        if (itemType === 'tower') {
            router.delete(route('torres.destroy', itemId), {
                preserveScroll: true
            });
        } else if (itemType === 'env') {
            router.delete(route('ambientes.destroy', itemId), {
                preserveScroll: true
            });
        } else if (itemType === 'item') {
            router.delete(route('items.destroy', itemId), {
                preserveScroll: true
            });
        }
    };

    const handleCreateActivity = () => {
        router.post(route('activities.store'), {
            item_id: selectedItemForActivity,
            origem_id: parseInt(activityFormData.origem_id),
            tipo_id: parseInt(activityFormData.tipo_id),
            doctotipo_id: activityFormData.doctotipo_id ? parseInt(activityFormData.doctotipo_id) : null,
            periodo_id: activityFormData.periodo_id ? parseInt(activityFormData.periodo_id) : null,
            profissional_id: activityFormData.profissional_id ? parseInt(activityFormData.profissional_id) : null,
            atividade_descricao: activityFormData.atividade_descricao,
            atividade_prioridade: activityFormData.atividade_prioridade,
            atividade_dtestimada: activityFormData.atividade_dtestimada || null,
            created_by: auth.user.id,
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setShowActivityModal(false);
                setSelectedItemForActivity(null);
                setActivityFormData({
                    origem_id: '',
                    tipo_id: '',
                    doctotipo_id: '',
                    periodo_id: '',
                    profissional_id: '',
                    atividade_descricao: '',
                    atividade_prioridade: 'media',
                    atividade_dtestimada: '',
                });
            },
            onError: (errors) => {
                console.error('Error creating activity:', errors);
            }
        });
    };

    // CSV export functions
    const getCurrentCatalogItems = () => {
        const data = catalogData[selectedCategory] || [];
        return data.map(item => ({
            name: item.name,
            type: item.type,
            code: item.code || '',
        }));
    };

    const convertToCSV = (data) => {
        if (!data || data.length === 0) return '';
        const headers = Object.keys(data[0]);
        const csvRows = [
            headers.join(','),
            ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
        ];
        return csvRows.join('\n');
    };

    const downloadCSV = (csv, filename) => {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const renderTreeItem = (item, level = 0) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedItems.has(item.id);
        const paddingLeft = level * 24;

        return (
            <div key={item.id} className={`border-b ${colors.border} last:border-b-0`}>
                <div
                    className={`flex items-center py-3.5 px-4 ${colors.surfaceHover} transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50`}
                    style={{ paddingLeft: `${paddingLeft + 16}px` }}
                >
                    {hasChildren && (
                        <button
                            onClick={() => toggleExpanded(item.id)}
                            className={`mr-2 p-1 ${colors.surfaceHover} rounded transition-colors`}
                        >
                            <ChevronRight
                                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                            />
                        </button>
                    )}
                    {!hasChildren && <div className="w-6 mr-2" />}

                    <div className="flex items-center mr-3">
                        {item.type === 'item' && item.hasPhoto && item.photo ? (
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                                <img
                                    src={item.photo}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-blue-600 bg-opacity-20"></div>
                            </div>
                        ) : item.type === 'item' && !item.hasPhoto ? (
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600" title="Photo required">
                                <Camera className="w-4 h-4" />
                            </div>
                        ) : (
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                {getTypeIcon(item.type)}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                            <h4 className={`text-[15px] font-semibold ${colors.text.primary} truncate`}>{item.name}</h4>
                            <span className={`text-xs font-mono ${colors.text.muted} ${colors.surface} px-2 py-1 rounded`}>
                                {item.code}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(item.status)}`}>
                                {item.status}
                            </span>
                            {item.type === 'item' && item.qrCode && (
                                <span className={`text-xs px-2 py-1 rounded-full border ${colors.surface} ${colors.text.secondary} flex items-center space-x-1`} title="QR Code available (MVP: Generation disabled)">
                                    <QrCode className="w-3 h-3" />
                                    <span>QR</span>
                                </span>
                            )}
                        </div>
                        <p className={`text-[13px] ${colors.text.secondary} mt-1 truncate`}>{item.description}</p>
                        {item.type === 'item' && (
                            <div className={`flex items-center space-x-4 mt-2 text-xs ${colors.text.muted}`}>
                                <span>Modelo: {item.model}</span>
                                <span>Próximo Serviço: {item.nextMaintenance}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        {(item.type === 'tower' || item.type === 'environment' || item.type === 'item') && (
                            <>
                                {item.type === 'item' && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const itemId = item.id.split('-')[1];
                                            setSelectedItemForActivity(itemId);
                                            setShowActivityModal(true);
                                        }}
                                        className={`p-2 ${colors.surfaceHover} rounded-lg transition-colors hover:bg-green-100 dark:hover:bg-green-900/20`}
                                        title="Create Activity"
                                    >
                                        <Calendar className={`w-4 h-4 ${colors.text.muted}`} />
                                    </button>
                                )}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(item);
                                    }}
                                    className={`p-2 ${colors.surfaceHover} rounded-lg transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/20`}
                                    title="Editar"
                                >
                                    <Edit className={`w-4 h-4 ${colors.text.muted}`} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(item);
                                    }}
                                    className={`p-2 ${colors.surfaceHover} rounded-lg transition-colors hover:bg-red-100 dark:hover:bg-red-900/20`}
                                    title="Excluir"
                                >
                                    <Trash2 className={`w-4 h-4 ${colors.text.muted}`} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {hasChildren && isExpanded && (
                    <div>
                        {item.children.map(child => renderTreeItem(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <MainLayout auth={auth}>
            <Head title="Catálogo de Ativos - Gestão de Edifícios" />

            <div className="space-y-4 sm:space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h1 className={`text-2xl sm:text-3xl font-semibold ${colors.text.primary}`}>
                                Catálogo de Ativos
                            </h1>
                            <p className={`${colors.text.secondary} mt-1 text-sm sm:text-base`}>
                                Gerencie a infraestrutura e hierarquia de equipamentos do edifício
                            </p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                            <Button
                                onClick={handleAdd}
                                className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-900 text-white shadow-sm flex-1 sm:flex-initial"
                            >
                                <Plus className="w-4 h-4 sm:mr-2" />
                                <span className="hidden sm:inline">Adicionar</span>
                            </Button>
                            <div className="relative hidden sm:block">
                                <button
                                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                                    className={`${colors.card} border ${colors.border} ${colors.surfaceHover} ${colors.text.secondary} px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors group`}
                                >
                                    <Filter className="w-4 h-4" />
                                    <span className="text-sm">Filtrar por:</span>
                                    <span className={`text-sm font-medium ${colors.text.primary}`}>Todos</span>
                                </button>
                                {showFilterMenu && (
                                    <div className={`absolute right-0 mt-2 w-48 ${colors.card} border ${colors.border} rounded-lg shadow-lg z-10 py-2`}>
                                        <button
                                            onClick={() => {
                                                setSelectedCategory('towers');
                                                setShowFilterMenu(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${colors.text.primary}`}
                                        >
                                            Torres
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedCategory('groups');
                                                setShowFilterMenu(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${colors.text.primary}`}
                                        >
                                            Grupos
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedCategory('items');
                                                setShowFilterMenu(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${colors.text.primary}`}
                                        >
                                            Itens
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Mobile Category Dropdown - Visible only on mobile */}
                    <div className="lg:hidden mb-4">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className={`w-full px-4 py-3 border ${colors.border} rounded-lg focus:ring-2 focus:ring-blue-500 ${colors.card} ${colors.text.primary} text-base`}
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name} ({category.count})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* Categories Sidebar - Hidden on mobile, shown on desktop */}
                        <div className="hidden lg:block lg:col-span-3">
                            <div className={`${colors.card} rounded-xl shadow-sm border ${colors.border} p-6`}>
                                <h3 className={`text-lg font-semibold ${colors.text.primary} mb-4 flex items-center`}>
                                    <FolderTree className={`w-5 h-5 mr-2.5 ${colors.text.secondary}`} />
                                    Categorias
                                </h3>

                                <div className="space-y-2">
                                    {categories.map((category) => {
                                        const IconComponent = category.icon;
                                        return (
                                            <button
                                                key={category.id}
                                                onClick={() => setSelectedCategory(category.id)}
                                                className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all relative ${
                                                    selectedCategory === category.id
                                                        ? `bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 ${colors.accent.text} shadow-sm`
                                                        : `${colors.surfaceHover} border border-transparent ${colors.text.primary} hover:bg-gray-50 dark:hover:bg-gray-800/50`
                                                }`}
                                            >
                                                {selectedCategory === category.id && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-l-lg"></div>
                                                )}
                                                <div className="flex items-center">
                                                    <IconComponent className="w-4 h-4 mr-2.5" />
                                                    <span className="font-medium">{category.name}</span>
                                                </div>
                                                <span className={`text-xs ${colors.text.muted} ${colors.surface} px-2 py-0.5 rounded-full`}>
                                                    {category.count}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Quick Stats */}
                                <div className={`mt-6 pt-6 border-t ${colors.border}`}>
                                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Estatísticas Rápidas</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Total de Ativos</span>
                                            <span className="font-semibold text-emerald-500">{totalItems.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Torres</span>
                                            <span className="font-semibold text-blue-500">{totalTowers.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Ambientes</span>
                                            <span className="font-semibold text-amber-500">{totalEnvironments.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-span-1 lg:col-span-9">
                            <div className={`${colors.card} rounded-xl shadow-sm border ${colors.border}`}>

                                {/* Search and View Controls */}
                                <div className={`p-4 sm:p-6 border-b ${colors.border}`}>
                                    <div className="relative w-full">
                                        <Search className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${colors.text.secondary}`} />
                                        <input
                                            type="text"
                                            placeholder="Buscar ativos..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className={`pl-10 pr-4 py-2 border ${colors.border} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full ${colors.surface} ${colors.text.primary} placeholder-gray-500 text-sm sm:text-base`}
                                        />
                                    </div>
                                </div>

                                {/* Asset Tree View */}
                                <div className="max-h-96 overflow-y-auto">
                                    <div>
                                        {catalogData[selectedCategory]?.length > 0 ? (
                                            catalogData[selectedCategory].map(item => renderTreeItem(item))
                                        ) : (
                                            <div className={`text-center ${colors.text.muted} py-12`}>
                                                <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                                <p className="text-lg font-medium mb-2">No items found</p>
                                                <p className="text-sm">Add items to see them here</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Bar */}
                                <div className={`p-6 border-t ${colors.border} ${colors.surface}`}>
                                    <div className="flex items-center justify-between">
                                        <div className={`flex items-center space-x-4 text-sm ${colors.text.secondary}`}>
                                            <span>Showing {totalItems.toLocaleString()} assets across {totalTowers} tower{totalTowers !== 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => {
                                                    const csvData = getCurrentCatalogItems();
                                                    const csv = convertToCSV(csvData);
                                                    downloadCSV(csv, `catalog-${selectedCategory}.csv`);
                                                }}
                                                className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                                            >
                                                Export to CSV
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className={`${colors.card} rounded-lg w-full max-w-md my-8`}>
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h3 className={`text-lg sm:text-xl font-semibold ${colors.text.primary}`}>
                                    Adicionar {
                                        selectedCategory === 'towers' ? 'Torre' :
                                        selectedCategory === 'environments' ? 'Ambiente' :
                                        selectedCategory === 'groups' ? 'Grupo' :
                                        selectedCategory === 'subgroups' ? 'Subgrupo' :
                                        'Item'
                                    }
                                </h3>
                                <Button variant="outline" size="sm" onClick={() => setShowAddModal(false)} className="flex-shrink-0">
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            {errorMessage && (
                                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 rounded-lg flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-800 dark:text-red-200">{errorMessage}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                {selectedCategory === 'towers' && (
                                    <>
                                        {(auth.user.role === 'master' || empreendimentos?.length > 1) && (
                                            <div>
                                                <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Empreendimento *</label>
                                                <Select
                                                    value={formData.empreendimento_id}
                                                    onValueChange={(val) => setFormData({...formData, empreendimento_id: val})}
                                                >
                                                    <SelectTrigger className={colors.surface}>
                                                        <SelectValue placeholder="Selecione um empreendimento" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {empreendimentos?.map(emp => (
                                                            <SelectItem key={emp.empreendimento_id} value={emp.empreendimento_id.toString()}>
                                                                {emp.empreendimento_nome}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                        <div>
                                            <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Nome da Torre *</label>
                                            <Input
                                                value={formData.torre_nome}
                                                onChange={(e) => setFormData({...formData, torre_nome: e.target.value})}
                                                placeholder="Ex: Torre A"
                                                className={colors.surface}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Quantidade de Apartamentos</label>
                                            <Input
                                                type="number"
                                                value={formData.torre_qtdaptos}
                                                onChange={(e) => setFormData({...formData, torre_qtdaptos: e.target.value})}
                                                placeholder="Ex: 120"
                                                className={colors.surface}
                                            />
                                        </div>
                                    </>
                                )}

                                {selectedCategory === 'environments' && (
                                    <>
                                        <div>
                                            <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Torre *</label>
                                            <Select value={formData.torre_id} onValueChange={(val) => setFormData({...formData, torre_id: val})}>
                                                <SelectTrigger className={colors.surface}>
                                                    <SelectValue placeholder="Selecione uma torre" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {torres?.map(torre => (
                                                        <SelectItem key={torre.torre_id} value={torre.torre_id.toString()}>
                                                            {torre.torre_nome}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Nome do Ambiente *</label>
                                            <Input
                                                value={formData.ambiente_nome}
                                                onChange={(e) => setFormData({...formData, ambiente_nome: e.target.value})}
                                                placeholder="Ex: Lobby, Piscina, Playground"
                                                className={colors.surface}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Descrição</label>
                                            <Textarea
                                                value={formData.ambiente_descricao}
                                                onChange={(e) => setFormData({...formData, ambiente_descricao: e.target.value})}
                                                placeholder="Descrição do ambiente"
                                                rows={3}
                                                className={colors.surface}
                                            />
                                        </div>
                                    </>
                                )}

                                {selectedCategory === 'groups' && (
                                    <p className={`text-sm ${colors.text.secondary}`}>
                                        Groups are managed in the Parameters page.
                                    </p>
                                )}

                                {selectedCategory === 'subgroups' && (
                                    <p className={`text-sm ${colors.text.secondary}`}>
                                        Subgroups are managed in the Parameters page.
                                    </p>
                                )}

                                {selectedCategory === 'items' && (
                                    <>
                                        <div>
                                            <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Torre *</label>
                                            <Select value={formData.torre_id} onValueChange={(val) => {
                                                setFormData({...formData, torre_id: val, ambiente_id: ''});
                                            }}>
                                                <SelectTrigger className={colors.surface}>
                                                    <SelectValue placeholder="Selecione uma torre" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {torres?.map(torre => (
                                                        <SelectItem key={torre.torre_id} value={torre.torre_id.toString()}>
                                                            {torre.torre_nome}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Ambiente *</label>
                                            <Select
                                                value={formData.ambiente_id}
                                                onValueChange={(val) => setFormData({...formData, ambiente_id: val})}
                                                disabled={!formData.torre_id}
                                            >
                                                <SelectTrigger className={colors.surface}>
                                                    <SelectValue placeholder={formData.torre_id ? "Selecione um ambiente" : "Selecione uma torre primeiro"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {torres?.find(t => t.torre_id.toString() === formData.torre_id)?.ambientes?.map(amb => (
                                                        <SelectItem key={amb.ambiente_id} value={amb.ambiente_id.toString()}>
                                                            {amb.ambiente_nome}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Grupo *</label>
                                            <Select value={formData.itemgrupo_id} onValueChange={(val) => {
                                                setFormData({...formData, itemgrupo_id: val, itemsubgrupo_id: ''});
                                            }}>
                                                <SelectTrigger className={colors.surface}>
                                                    <SelectValue placeholder="Selecione um grupo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {grupos?.map(g => (
                                                        <SelectItem key={g.itemgrupo_id} value={g.itemgrupo_id.toString()}>
                                                            {g.itemgrupo_nome}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Subgrupo *</label>
                                            <Select
                                                value={formData.itemsubgrupo_id}
                                                onValueChange={(val) => setFormData({...formData, itemsubgrupo_id: val})}
                                                disabled={!formData.itemgrupo_id}
                                            >
                                                <SelectTrigger className={colors.surface}>
                                                    <SelectValue placeholder={formData.itemgrupo_id ? "Selecione um subgrupo" : "Selecione um grupo primeiro"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {grupos?.find(g => g.itemgrupo_id.toString() === formData.itemgrupo_id)?.subgrupos?.map(sub => (
                                                        <SelectItem key={sub.itemsubgrupo_id} value={sub.itemsubgrupo_id.toString()}>
                                                            {sub.itemsubgrupo_nome}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Nome do Item *</label>
                                            <Input
                                                value={formData.item_nome}
                                                onChange={(e) => setFormData({...formData, item_nome: e.target.value})}
                                                placeholder="Ex: Elevador A, Ar Condicionado Lobby"
                                                className={colors.surface}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Descrição</label>
                                            <Textarea
                                                value={formData.item_descricao}
                                                onChange={(e) => setFormData({...formData, item_descricao: e.target.value})}
                                                placeholder="Descrição do item"
                                                rows={3}
                                                className={colors.surface}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Imagem</label>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setFormData({...formData, item_imagem: e.target.files[0]})}
                                                className={colors.surface}
                                            />
                                            <p className={`text-xs ${colors.text.secondary} mt-1`}>Maximum file size: 5MB</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className={`flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-4 mt-4 sm:mt-6 pt-4 border-t ${colors.border}`}>
                                <Button variant="outline" onClick={() => setShowAddModal(false)} className="w-full sm:w-auto">
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={
                                        (selectedCategory === 'towers' && !formData.torre_nome) ||
                                        (selectedCategory === 'environments' && (!formData.torre_id || !formData.ambiente_nome)) ||
                                        (selectedCategory === 'items' && (!formData.torre_id || !formData.ambiente_id || !formData.itemsubgrupo_id || !formData.item_nome)) ||
                                        (selectedCategory === 'groups' || selectedCategory === 'subgroups')
                                    }
                                    className="w-full sm:w-auto bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-900 text-white"
                                >
                                    {(selectedCategory === 'groups' || selectedCategory === 'subgroups') ? 'Ir para Parameters' : 'Criar'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editingItem && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className={`${colors.card} rounded-lg w-full max-w-md my-8`}>
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h3 className={`text-lg sm:text-xl font-semibold ${colors.text.primary}`}>
                                    Editar {editingItem.type === 'tower' ? 'Torre' : editingItem.type === 'environment' ? 'Ambiente' : 'Item'}
                                </h3>
                                <Button variant="outline" size="sm" onClick={() => setShowEditModal(false)} className="flex-shrink-0">
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            {errorMessage && (
                                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 rounded-lg flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-800 dark:text-red-200">{errorMessage}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                {editingItem.type === 'tower' && (
                                    <>
                                        <div>
                                            <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Nome da Torre *</label>
                                            <Input
                                                value={formData.torre_nome}
                                                onChange={(e) => setFormData({...formData, torre_nome: e.target.value})}
                                                placeholder="Ex: Torre A"
                                                className={colors.surface}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Quantidade de Apartamentos</label>
                                            <Input
                                                type="number"
                                                value={formData.torre_qtdaptos}
                                                onChange={(e) => setFormData({...formData, torre_qtdaptos: e.target.value})}
                                                placeholder="Ex: 120"
                                                className={colors.surface}
                                            />
                                        </div>
                                    </>
                                )}

                                {editingItem.type === 'environment' && (
                                    <>
                                        <div>
                                            <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Nome do Ambiente *</label>
                                            <Input
                                                value={formData.ambiente_nome}
                                                onChange={(e) => setFormData({...formData, ambiente_nome: e.target.value})}
                                                placeholder="Ex: Lobby, Piscina, Playground"
                                                className={colors.surface}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Descrição</label>
                                            <Textarea
                                                value={formData.ambiente_descricao}
                                                onChange={(e) => setFormData({...formData, ambiente_descricao: e.target.value})}
                                                placeholder="Descrição do ambiente"
                                                rows={3}
                                                className={colors.surface}
                                            />
                                        </div>
                                    </>
                                )}

                                {editingItem.type === 'item' && (
                                    <>
                                        <div>
                                            <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Nome do Item *</label>
                                            <Input
                                                value={formData.item_nome}
                                                onChange={(e) => setFormData({...formData, item_nome: e.target.value})}
                                                placeholder="Ex: Elevador A, Ar Condicionado Lobby"
                                                className={colors.surface}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Descrição</label>
                                            <Textarea
                                                value={formData.item_descricao}
                                                onChange={(e) => setFormData({...formData, item_descricao: e.target.value})}
                                                placeholder="Descrição do item"
                                                rows={3}
                                                className={colors.surface}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Imagem</label>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setFormData({...formData, item_imagem: e.target.files[0]})}
                                                className={colors.surface}
                                            />
                                            <p className={`text-xs ${colors.text.secondary} mt-1`}>Maximum file size: 5MB</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className={`flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-4 mt-4 sm:mt-6 pt-4 border-t ${colors.border}`}>
                                <Button variant="outline" onClick={() => setShowEditModal(false)} className="w-full sm:w-auto">
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    className="w-full sm:w-auto bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-900 text-white"
                                >
                                    Atualizar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Activity Creation Modal */}
            {showActivityModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className={`${colors.card} rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h2 className={`text-2xl font-bold ${colors.text.primary}`}>
                                Create Activity
                            </h2>
                            <button
                                onClick={() => setShowActivityModal(false)}
                                className={`p-2 ${colors.surfaceHover} rounded-lg`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Description *</label>
                                <Textarea
                                    value={activityFormData.atividade_descricao}
                                    onChange={(e) => setActivityFormData({...activityFormData, atividade_descricao: e.target.value})}
                                    placeholder="Activity description"
                                    rows={3}
                                    className={colors.surface}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Origem *</label>
                                <Select
                                    value={activityFormData.origem_id}
                                    onValueChange={(val) => setActivityFormData({...activityFormData, origem_id: val})}
                                >
                                    <SelectTrigger className={colors.surface}>
                                        <SelectValue placeholder="Select origin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {origens?.map(origem => (
                                            <SelectItem key={origem.origem_id} value={origem.origem_id.toString()}>
                                                {origem.origem_nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Type *</label>
                                <Select
                                    value={activityFormData.tipo_id}
                                    onValueChange={(val) => setActivityFormData({...activityFormData, tipo_id: val})}
                                >
                                    <SelectTrigger className={colors.surface}>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tipos?.map(tipo => (
                                            <SelectItem key={tipo.tipo_id} value={tipo.tipo_id.toString()}>
                                                {tipo.tipo_nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Priority</label>
                                <Select
                                    value={activityFormData.atividade_prioridade}
                                    onValueChange={(val) => setActivityFormData({...activityFormData, atividade_prioridade: val})}
                                >
                                    <SelectTrigger className={colors.surface}>
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="baixa">Low</SelectItem>
                                        <SelectItem value="media">Medium</SelectItem>
                                        <SelectItem value="alta">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Estimated Date</label>
                                <Input
                                    type="date"
                                    value={activityFormData.atividade_dtestimada}
                                    onChange={(e) => setActivityFormData({...activityFormData, atividade_dtestimada: e.target.value})}
                                    className={colors.surface}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Document Type</label>
                                <Select
                                    value={activityFormData.doctotipo_id}
                                    onValueChange={(val) => setActivityFormData({...activityFormData, doctotipo_id: val})}
                                >
                                    <SelectTrigger className={colors.surface}>
                                        <SelectValue placeholder="Select document type (optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {doctoTipos?.map(docto => (
                                            <SelectItem key={docto.doctotipo_id} value={docto.doctotipo_id.toString()}>
                                                {docto.doctotipo_nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Period</label>
                                <Select
                                    value={activityFormData.periodo_id}
                                    onValueChange={(val) => setActivityFormData({...activityFormData, periodo_id: val})}
                                >
                                    <SelectTrigger className={colors.surface}>
                                        <SelectValue placeholder="Select period (optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {periodos?.map(periodo => (
                                            <SelectItem key={periodo.periodo_id} value={periodo.periodo_id.toString()}>
                                                {periodo.periodo_nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${colors.text.primary} mb-1`}>Professional</label>
                                <Select
                                    value={activityFormData.profissional_id}
                                    onValueChange={(val) => setActivityFormData({...activityFormData, profissional_id: val})}
                                >
                                    <SelectTrigger className={colors.surface}>
                                        <SelectValue placeholder="Select professional (optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {profissionais?.map(prof => (
                                            <SelectItem key={prof.profissional_id} value={prof.profissional_id.toString()}>
                                                {prof.profissional_tipo}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <Button variant="outline" onClick={() => setShowActivityModal(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCreateActivity}
                                    className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 hover:from-green-700 hover:via-green-800 hover:to-emerald-900 text-white"
                                >
                                    Create Activity
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};
