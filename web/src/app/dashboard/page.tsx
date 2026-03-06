'use client';

import * as React from 'react';
import { useAuthStore } from '@/store/authStore';
import {
    PlusCircle,
    MapPin,
    Wallet,
    TrendingUp,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
    const { user } = useAuthStore();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Olá, {user?.name?.split(' ')[0] || user?.email.split('@')[0]}! 👋
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Aqui está o resumo do seu planejamento de imigração.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-brand-primary/10 p-3">
                            <MapPin className="h-6 w-6 text-brand-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Cenários Ativos</p>
                            <p className="text-2xl font-bold text-foreground">0</p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-brand-primary">
                        <TrendingUp className="mr-1 h-4 w-4" />
                        <span>Simule novos destinos</span>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-brand-secondary/10 p-3">
                            <Wallet className="h-6 w-6 text-brand-secondary" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Reserva Total Projetada</p>
                            <p className="text-2xl font-bold text-foreground">€ 0,00</p>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-muted-foreground">
                        Adicione custos para calcular seu runway
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 p-6 shadow-sm flex flex-col justify-center items-center text-center border-dashed">
                    <h3 className="font-semibold text-foreground mb-2">Novo Planejamento</h3>
                    <p className="text-sm text-muted-foreground mb-4">Descubra o custo de vida em outro país</p>
                    <Link href="/dashboard/scenarios/new">
                        <Button variant="outline" size="sm" className="gap-2">
                            <PlusCircle className="h-4 w-4" />
                            Criar Cenário
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Recent Activity / Setup Guide */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-foreground mb-4">Passos Iniciais</h2>
                    <div className="space-y-4">

                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 mt-1">
                                <div className="h-6 w-6 rounded-full border-2 border-brand-primary flex items-center justify-center">
                                    <span className="h-2 w-2 rounded-full bg-brand-primary" />
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium text-foreground">Crie seu primeiro cenário</h4>
                                <p className="text-sm text-muted-foreground">Escolha um país e cidade de destino para importar os custos de vida básicos.</p>
                                <Link href="/dashboard/scenarios/new" className="inline-flex items-center text-sm text-brand-primary mt-2 hover:underline">
                                    Começar agora <ArrowRight className="ml-1 h-3 w-3" />
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 opacity-50">
                            <div className="flex-shrink-0 mt-1">
                                <div className="h-6 w-6 rounded-full border-2 border-border" />
                            </div>
                            <div>
                                <h4 className="font-medium text-foreground">Personalize seus gastos</h4>
                                <p className="text-sm text-muted-foreground">Ajuste os valores de aluguel e mercado baseado no seu padrão de vida desejado.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 opacity-50">
                            <div className="flex-shrink-0 mt-1">
                                <div className="h-6 w-6 rounded-full border-2 border-border" />
                            </div>
                            <div>
                                <h4 className="font-medium text-foreground">Organize seu checklist</h4>
                                <p className="text-sm text-muted-foreground">Acompanhe vistos, passagens, traduções juramentadas e muito mais.</p>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col items-center justify-center text-center min-h-[300px]">
                    <div className="rounded-full bg-secondary p-4 mb-4">
                        <MapPin className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Nenhum cenário ativo</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm">
                        Seu painel de controle vai ganhar vida assim que você adicionar seu primeiro destino de imigração.
                    </p>
                    <Link href="/dashboard/scenarios/new" className="mt-6">
                        <Button variant="gradient">Explorar Destinos</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
