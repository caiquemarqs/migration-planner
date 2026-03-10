'use client';

import * as React from 'react';
import { useAuthStore } from '@/store/authStore';
import {
    PlusCircle,
    MapPin,
    Wallet,
    TrendingUp,
    ArrowRight,
    Users,
    ShoppingCart,
    Plane,
    PiggyBank
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function DashboardPage() {
    const { user } = useAuthStore();
    const isResident = user?.appMode === 'RESIDENT';

    const [scenariosCount, setScenariosCount] = React.useState(0);
    const [projectedTotal, setProjectedTotal] = React.useState(0);

    // Planner specific states
    const [checklistItems, setChecklistItems] = React.useState(0);
    const [checklistDone, setChecklistDone] = React.useState(0);

    // Resident specific states
    const [totalSavings, setTotalSavings] = React.useState(0);

    React.useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                if (!isResident) {
                    const res = await api.get('/scenarios').catch(() => ({ data: { data: [] } }));
                    const scenarios = res.data?.data || [];
                    setScenariosCount(scenarios.length);

                    if (scenarios.length > 0) {
                        const active = scenarios[0];
                        setProjectedTotal(active.savingsBRL || 0);

                        // Try to get checklist
                        const chk = await api.get(`/checklist/${active.id}`).catch(() => ({ data: { data: [] } }));
                        const items = chk.data?.data || [];
                        setChecklistItems(items.length);
                        setChecklistDone(items.filter((i: any) => i.status === 'DONE').length);
                    }
                } else {
                    // Fetch local finances for resident mode
                    const sums = await api.get('/transactions/summary?month=all').catch(() => ({ data: { data: { summary: { balance: 0 } } } }));
                    setTotalSavings(sums.data?.data?.summary?.balance || 0);
                }
            } catch (err) {
                console.error("Error fetching dashboard overview", err);
            }
        };

        fetchDashboardData();
    }, [isResident]);

    // ============================================
    // PLANNER MODE VIEW
    // ============================================
    if (!isResident) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        Olá, {user?.name?.split(' ')[0] || user?.email.split('@')[0]} <Plane className="h-6 w-6 text-brand-primary ml-2" />
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Aqui está o resumo do seu <strong>planejamento de imigração</strong>.
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
                                <p className="text-sm font-medium text-muted-foreground">Cenários de Destino</p>
                                <p className="text-2xl font-bold text-foreground">{scenariosCount}</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-brand-primary">
                            <TrendingUp className="mr-1 h-4 w-4" />
                            <span>Simule custos de vida</span>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-brand-secondary/10 p-3">
                                <Wallet className="h-6 w-6 text-brand-secondary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Reserva Alvo (Base BRL)</p>
                                <p className="text-2xl font-bold text-foreground">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(projectedTotal)}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-muted-foreground">
                            {scenariosCount > 0 ? 'Baseado no seu cenário ativo' : 'Adicione um cenário primeiro'}
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 p-6 shadow-sm flex flex-col justify-center items-center text-center border-dashed">
                        <h3 className="font-semibold text-foreground mb-2">Novo Planejamento</h3>
                        <p className="text-sm text-muted-foreground mb-4">Descubra o custo de vida em outro país</p>
                        <Link href="/dashboard/scenarios/new">
                            <Button variant="outline" size="sm" className="gap-2">
                                <PlusCircle className="h-4 w-4" />
                                Simular Destino
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    {/* Setup / Onboarding Flow */}
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-foreground mb-4">Seus Próximos Passos</h2>

                        {scenariosCount === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-xl bg-secondary/10">
                                <MapPin className="h-10 w-10 text-muted-foreground mb-4" />
                                <h3 className="font-bold mb-2">Você ainda não tem um cenário</h3>
                                <p className="text-sm text-muted-foreground mb-6">Para gerar seu checklist e calcular custos, precisamos saber para onde você quer ir.</p>
                                <Link href="/dashboard/scenarios/new">
                                    <Button className="bg-brand-primary text-primary-foreground">
                                        Criar Meu Primeiro Cenário
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="h-6 w-6 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center text-xs font-bold">1</div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-foreground">Personalize seus gastos</h4>
                                        <p className="text-sm text-muted-foreground">Ajuste os valores de aluguel e mercado baseado no seu padrão de vida desejado.</p>
                                        <Link href="/dashboard/compare" className="inline-flex items-center text-sm text-brand-primary mt-2 flex items-center hover:underline">
                                            Ajustar custos no Comparador <ArrowRight className="ml-1 h-3 w-3" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="h-6 w-6 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center text-xs font-bold">2</div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-foreground">Acompanhe seu Check-list</h4>
                                        <p className="text-sm text-muted-foreground">Você tem {checklistItems} tarefas ({checklistDone} concluídas) para resolver antes da viagem.</p>
                                        <Link href="/dashboard/checklist" className="inline-flex items-center text-sm text-brand-primary mt-2 flex items-center hover:underline">
                                            Ver checklist completo <ArrowRight className="ml-1 h-3 w-3" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm min-h-[300px]">
                        <h2 className="text-lg font-bold text-foreground mb-4">Suíte do Planejador</h2>

                        <Link href="/dashboard/compare" className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/60 transition-colors group">
                            <div className="rounded-full bg-brand-secondary/10 p-3 group-hover:bg-brand-secondary/20 transition-colors">
                                <ShoppingCart className="h-6 w-6 text-brand-secondary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-foreground">Comparações de Custo</h3>
                                <p className="text-sm text-muted-foreground">Compare aluguel, supermercado e contas lado a lado.</p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-brand-secondary transition-colors" />
                        </Link>

                        <Link href="/dashboard/family" className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/60 transition-colors group">
                            <div className="rounded-full bg-emerald-500/10 p-3 group-hover:bg-emerald-500/20 transition-colors">
                                <Users className="h-6 w-6 text-emerald-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-foreground">Grupo Familiar</h3>
                                <p className="text-sm text-muted-foreground">Gerencie o impacto de cônjuges e filhos no custo de vida.</p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                        </Link>

                    </div>
                </div>
            </div>
        );
    }

    // ============================================
    // RESIDENT MODE VIEW
    // ============================================
    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    Olá, {user?.name?.split(' ')[0] || user?.email.split('@')[0]} <MapPin className="h-6 w-6 text-emerald-500 ml-2" />
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Aqui está o resumo da sua <strong>vida financeira local</strong> como residente.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Local Savings Summary */}
                <div className="overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-8 shadow-sm col-span-1 lg:col-span-2 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="rounded-2xl bg-emerald-500/20 p-5">
                            <PiggyBank className="h-10 w-10 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-base font-medium text-emerald-500 mb-1">Guarda Acumulada no Destino</p>
                            <h2 className="text-4xl sm:text-5xl font-black text-foreground">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalSavings > 0 ? totalSavings : 0)}
                            </h2>
                            <p className="text-sm text-muted-foreground mt-2">Patrimônio acumulado desde sua chegada</p>
                        </div>
                    </div>
                    <div>
                        <Link href="/dashboard/finances">
                            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20">
                                Registrar Despesa / Receita Local
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm min-h-[300px]">
                    <h2 className="text-lg font-bold text-foreground mb-4">Gestão do Residente</h2>

                    <Link href="/dashboard/finances" className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/60 transition-colors group">
                        <div className="rounded-full bg-emerald-500/10 p-3 group-hover:bg-emerald-500/20 transition-colors">
                            <Wallet className="h-6 w-6 text-emerald-500" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-foreground">Fluxo Financeiro Local</h3>
                            <p className="text-sm text-muted-foreground">Registre seu salário e despesas no novo país.</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                    </Link>

                    <Link href="/dashboard/family" className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/60 transition-colors group">
                        <div className="rounded-full bg-brand-secondary/10 p-3 group-hover:bg-brand-secondary/20 transition-colors">
                            <Users className="h-6 w-6 text-brand-secondary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-foreground">Dependentes</h3>
                            <p className="text-sm text-muted-foreground">Atualize a situação empregatícia da família localmente.</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-brand-secondary transition-colors" />
                    </Link>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-center items-center text-center opacity-70">
                    <Plane className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="font-bold mb-2 text-foreground">Pensando em novo destino?</h3>
                    <p className="text-sm text-muted-foreground mb-4">Você pode voltar para o modo Planejador a qualquer momento no Header para simular novos países.</p>
                </div>

            </div>
        </div>
    );
}
