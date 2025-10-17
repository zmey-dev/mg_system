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
    Eye,
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

export default function Catalog({ auth, torres, grupos }) {
    const { isDark, colors } = useTheme();
    const [selectedCategory, setSelectedCategory] = useState('towers');
    const [expandedItems, setExpandedItems] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'grid'
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [showBulkMenu, setShowBulkMenu] = useState(false);

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
                    photo: item.item_imagem || null,
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
                    photo: item.item_imagem || null,
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
                        <button
                            onClick={() => {
                                const itemId = item.id.split('-')[1];
                                if (item.type === 'item') {
                                    router.visit(`/items/${itemId}`);
                                }
                            }}
                            className={`p-2 ${colors.surfaceHover} rounded-lg transition-colors`}
                        >
                            <Eye className={`w-4 h-4 ${colors.text.muted}`} />
                        </button>
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

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                        <div>
                            <h1 className={`text-3xl font-semibold ${colors.text.primary}`}>
                                Catálogo de Ativos
                            </h1>
                            <p className={`${colors.text.secondary} mt-1`}>
                                Gerencie a infraestrutura e hierarquia de equipamentos do edifício
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="relative">
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
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                        {/* Categories Sidebar */}
                        <div className="lg:col-span-3">
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
                        <div className="lg:col-span-9">
                            <div className={`${colors.card} rounded-xl shadow-sm border ${colors.border}`}>

                                {/* Search and View Controls */}
                                <div className={`p-6 border-b ${colors.border}`}>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                                        <div className="flex items-center space-x-4">
                                            <div className="relative flex-1 min-w-64">
                                                <Search className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${colors.text.secondary}`} />
                                                <input
                                                    type="text"
                                                    placeholder="Buscar ativos por nome, código ou descrição..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className={`pl-10 pr-4 py-2 border ${colors.border} rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full ${colors.surface} ${colors.text.primary} placeholder-gray-500`}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className={`flex ${colors.surface} rounded-lg p-1 border ${colors.border}`}>
                                                <button
                                                    onClick={() => setViewMode('tree')}
                                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                                                        viewMode === 'tree'
                                                            ? `${colors.card} ${colors.text.primary} shadow-sm`
                                                            : `${colors.text.secondary} hover:bg-gray-100 dark:hover:bg-gray-700`
                                                    }`}
                                                >
                                                    Árvore
                                                </button>
                                                <button
                                                    onClick={() => setViewMode('grid')}
                                                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                                                        viewMode === 'grid'
                                                            ? `${colors.card} ${colors.text.primary} shadow-sm`
                                                            : `${colors.text.secondary} hover:bg-gray-100 dark:hover:bg-gray-700`
                                                    }`}
                                                >
                                                    Grade
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Asset Tree/Grid View */}
                                <div className="max-h-96 overflow-y-auto">
                                    {viewMode === 'tree' ? (
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
                                    ) : (
                                        <div className="p-6">
                                            {catalogData[selectedCategory]?.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                                    {catalogData[selectedCategory].map(item => (
                                                        <div
                                                            key={item.id}
                                                            className={`${colors.card} rounded-lg border ${colors.border} p-4 hover:shadow-md transition-shadow`}
                                                        >
                                                            <div className="flex items-start justify-between mb-3">
                                                                <div className="flex items-center space-x-2">
                                                                    {getTypeIcon(item.type)}
                                                                    <div>
                                                                        <h3 className={`font-semibold ${colors.text.primary}`}>{item.name}</h3>
                                                                        <p className={`text-xs ${colors.text.muted}`}>{item.code}</p>
                                                                    </div>
                                                                </div>
                                                                <span className={`px-2 py-1 text-xs rounded ${getStatusColor(item.status)}`}>
                                                                    {item.status === 'active' ? 'Active' : item.status === 'ativo' ? 'Active' : 'Inactive'}
                                                                </span>
                                                            </div>
                                                            {item.description && (
                                                                <p className={`text-sm ${colors.text.secondary} mb-3`}>{item.description}</p>
                                                            )}
                                                            {item.tower && (
                                                                <p className={`text-xs ${colors.text.muted}`}>Tower: {item.tower}</p>
                                                            )}
                                                            {item.environment && (
                                                                <p className={`text-xs ${colors.text.muted}`}>Environment: {item.environment}</p>
                                                            )}
                                                            {item.group && (
                                                                <p className={`text-xs ${colors.text.muted}`}>Group: {item.group}</p>
                                                            )}
                                                            {item.subgroup && (
                                                                <p className={`text-xs ${colors.text.muted}`}>Subgroup: {item.subgroup}</p>
                                                            )}
                                                            {item.model && (
                                                                <p className={`text-xs ${colors.text.muted}`}>Model: {item.model}</p>
                                                            )}
                                                            {item.hasPhoto && (
                                                                <div className="mt-3 flex items-center text-xs text-teal-600">
                                                                    <Camera className="w-3 h-3 mr-1" />
                                                                    Has photo
                                                                </div>
                                                            )}
                                                            {item.children && item.children.length > 0 && (
                                                                <div className={`mt-3 pt-3 border-t ${colors.border}`}>
                                                                    <p className={`text-xs ${colors.text.muted}`}>
                                                                        {item.children.length} child item{item.children.length !== 1 ? 's' : ''}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className={`text-center ${colors.text.muted} py-12`}>
                                                    <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                                    <p className="text-lg font-medium mb-2">No items found</p>
                                                    <p className="text-sm">Add items to see them here</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
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
                                            <span className={`${colors.text.muted}`}>|</span>
                                            <div className="relative">
                                                <button
                                                    onClick={() => setShowBulkMenu(!showBulkMenu)}
                                                    className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                                                >
                                                    Bulk Actions
                                                </button>
                                                {showBulkMenu && (
                                                    <div className={`absolute right-0 mt-2 w-48 ${colors.card} border ${colors.border} rounded-lg shadow-lg z-10 py-2`}>
                                                        <button
                                                            onClick={() => {
                                                                alert('Selecione os itens primeiro');
                                                                setShowBulkMenu(false);
                                                            }}
                                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${colors.text.primary}`}
                                                        >
                                                            Selecionar Todos
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedItems(new Set());
                                                                setShowBulkMenu(false);
                                                            }}
                                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${colors.text.primary}`}
                                                        >
                                                            Limpar Seleção
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </MainLayout>
    );
};
