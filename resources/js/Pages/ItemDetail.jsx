import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { router } from '@inertiajs/react';
import { ArrowLeft, Camera, QrCode } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ItemDetail({ auth, item }) {
    const { colors } = useTheme();

    return (
        <MainLayout auth={auth}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => router.visit('/catalog')}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Catalog
                        </Button>
                        <h1 className={`text-3xl font-bold ${colors.text.primary}`}>
                            {item.item_nome}
                        </h1>
                    </div>
                </div>

                {/* Item Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Main Information */}
                    <Card className={`${colors.card} border ${colors.border}`}>
                        <CardHeader>
                            <CardTitle className={colors.text.primary}>Item Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className={`text-sm font-medium ${colors.text.secondary}`}>Name</label>
                                <p className={`text-lg ${colors.text.primary}`}>{item.item_nome}</p>
                            </div>

                            {item.item_descricao && (
                                <div>
                                    <label className={`text-sm font-medium ${colors.text.secondary}`}>Description</label>
                                    <p className={colors.text.primary}>{item.item_descricao}</p>
                                </div>
                            )}

                            {item.item_marcamodelo && (
                                <div>
                                    <label className={`text-sm font-medium ${colors.text.secondary}`}>Model</label>
                                    <p className={colors.text.primary}>{item.item_marcamodelo}</p>
                                </div>
                            )}

                            <div>
                                <label className={`text-sm font-medium ${colors.text.secondary}`}>Status</label>
                                <p className={colors.text.primary}>{item.item_status}</p>
                            </div>

                            <div>
                                <label className={`text-sm font-medium ${colors.text.secondary}`}>Group</label>
                                <p className={colors.text.primary}>{item.subgrupo?.grupo?.itemgrupo_nome}</p>
                            </div>

                            <div>
                                <label className={`text-sm font-medium ${colors.text.secondary}`}>Subgroup</label>
                                <p className={colors.text.primary}>{item.subgrupo?.itemsubgrupo_nome}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location Information */}
                    <Card className={`${colors.card} border ${colors.border}`}>
                        <CardHeader>
                            <CardTitle className={colors.text.primary}>Location</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className={`text-sm font-medium ${colors.text.secondary}`}>Empreendimento</label>
                                <p className={colors.text.primary}>{item.ambiente?.torre?.empreendimento?.empreendimento_nome}</p>
                            </div>

                            <div>
                                <label className={`text-sm font-medium ${colors.text.secondary}`}>Torre</label>
                                <p className={colors.text.primary}>{item.ambiente?.torre?.torre_nome}</p>
                            </div>

                            <div>
                                <label className={`text-sm font-medium ${colors.text.secondary}`}>Ambiente</label>
                                <p className={colors.text.primary}>{item.ambiente?.ambiente_nome}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Image */}
                    {item.item_imagem_url && (
                        <Card className={`${colors.card} border ${colors.border}`}>
                            <CardHeader>
                                <CardTitle className={colors.text.primary}>Image</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <img
                                    src={item.item_imagem_url}
                                    alt={item.item_nome}
                                    className="w-full h-auto rounded-lg"
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* QR Code */}
                    {item.item_qrcode && (
                        <Card className={`${colors.card} border ${colors.border}`}>
                            <CardHeader>
                                <CardTitle className={colors.text.primary}>QR Code</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-center p-8">
                                    <QrCode className="w-32 h-32" />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Activities */}
                {item.atividades && item.atividades.length > 0 && (
                    <Card className={`${colors.card} border ${colors.border}`}>
                        <CardHeader>
                            <CardTitle className={colors.text.primary}>Activities</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {item.atividades.map((atividade) => (
                                    <div key={atividade.atividade_id} className={`p-3 ${colors.surface} rounded-lg`}>
                                        <p className={colors.text.primary}>{atividade.atividade_descricao}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </MainLayout>
    );
}
