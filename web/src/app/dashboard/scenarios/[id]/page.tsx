'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import {
    ArrowLeft,
    MapPin,
    Calendar,
    Wallet,
    TrendingDown,
    TrendingUp,
    Loader2,
    CheckCircle2,
    Circle,
    Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Scenario {
    id: string;
    name: string;
    targetCountry: string;
    targetCity: string;
    targetDate: string;
    budgetCap: number | null;
}

export default function ScenarioDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [scenario, setScenario] = React.useState<Scenario | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [activeTab, setActiveTab] = React.useState<'costs' | 'checklist'>('costs');

    React.useEffect(() => {
        async function fetchScenario() {
            try {
                const response = await api.get(`/scenarios/${id}`);
                setScenario(response.data.data.scenario);
            } catch (error) {
                console.error('Error fetching scenario:', error);
            } finally {
                setIsLoading(false);
            }
        }
        if (id) fetchScenario();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex-1 flex justify-center items-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    if (!scenario) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-bold">Cenário não encontrado</h2>
                <Button onClick={() => router.push('/dashboard/scenarios')} className="mt-4">Voltar</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/scenarios" className="p-2 -ml-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">{scenario.name}</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {scenario.targetCity}, {scenario.targetCountry}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Meta: {new Date(scenario.targetDate).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border mb-6">
                <button
                    onClick={() => setActiveTab('costs')}
                    className={`pb-4 px-4 font-medium text-sm transition-all border-b-2 ${activeTab === 'costs' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    Custo de Vida & Reservas
                </button>
                <button
                    onClick={() => setActiveTab('checklist')}
                    className={`pb-4 px-4 font-medium text-sm transition-all border-b-2 ${activeTab === 'checklist' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                    Checklist de Imigração
                </button>
            </div>

            {activeTab === 'costs' && (
                <div className="space-y-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
                            <p className="text-sm font-medium text-muted-foreground">Custo de Vida Mensal (Média)</p>
                            <p className="text-3xl font-bold text-foreground mt-2">€ 2.450 <span className="text-sm font-normal text-muted-foreground">/mês</span></p>
                            <div className="mt-4 flex items-center text-sm text-brand-primary">
                                <TrendingUp className="mr-1 h-4 w-4" />
                                <span>+15% vs São Paulo</span>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
                            <p className="text-sm font-medium text-muted-foreground">Poder de Compra (Local)</p>
                            <p className="text-3xl font-bold text-foreground mt-2">Alto</p>
                            <div className="mt-4 flex items-center text-sm text-green-500">
                                <TrendingUp className="mr-1 h-4 w-4" />
                                <span>Baseado no salário mínimo local</span>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-brand-primary to-brand-secondary p-6 shadow-md text-white">
                            <p className="text-sm font-medium opacity-90">Reserva Ideal (6 meses)</p>
                            <p className="text-3xl font-bold mt-2">€ 14.700</p>
                            <div className="mt-4 flex justify-between items-center text-sm">
                                <span className="opacity-90">R$ 88.200 (Câmbio atual)</span>
                                <Wallet className="h-4 w-4" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-border flex justify-between items-center">
                                <h3 className="text-lg font-bold">Detalhamento de Custos</h3>
                                <Button variant="outline" size="sm">Ajustar Valores</Button>
                            </div>
                            <div className="divide-y divide-border">
                                {[
                                    { name: 'Aluguel (1 Quarto no Centro)', value: '€ 1.200' },
                                    { name: 'Mercado & Alimentação', value: '€ 450' },
                                    { name: 'Transporte Público', value: '€ 65' },
                                    { name: 'Contas (Luz, Água, Internet)', value: '€ 150' },
                                    { name: 'Lazer e Diversos', value: '€ 200' },
                                ].map((item, i) => (
                                    <div key={i} className="p-4 flex justify-between items-center hover:bg-secondary/20 transition-colors">
                                        <span className="text-foreground font-medium">{item.name}</span>
                                        <span className="text-muted-foreground">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
                            <h3 className="text-lg font-bold mb-4">Seu Orçamento</h3>
                            {scenario.budgetCap ? (
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">Progresso da Reserva</span>
                                        <span className="font-bold">Em construção</span>
                                    </div>
                                    <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-brand-primary w-[30%] rounded-full"></div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-4">
                                        Com base no orçamento de R$ {scenario.budgetCap}, você possui aproximadamente 2 meses de sobrevivência financeira em {scenario.targetCity}.
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <Wallet className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                                    <p className="text-sm text-muted-foreground mb-4">Você não definiu um orçamento limite para este cenário ainda.</p>
                                    <Button variant="outline" className="w-full">Definir Orçamento</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'checklist' && (
                <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/30">
                        <div>
                            <h3 className="text-lg font-bold">Tarefas e Obrigações</h3>
                            <p className="text-sm text-muted-foreground">Acompanhe os passos burocráticos e logísticos do seu planejamento.</p>
                        </div>
                        <Button variant="gradient" size="sm" className="gap-2">
                            <Plus className="h-4 w-4" /> Nova Tarefa
                        </Button>
                    </div>
                    <div className="divide-y divide-border">
                        {[
                            { title: 'Tirar Passaporte', desc: 'Agendar na Polícia Federal', done: true },
                            { title: 'Tradução Juramentada de Diplomas', desc: 'Orçar com 3 tradutores diferentes.', done: false },
                            { title: 'Comprar Passagens Aéreas', desc: 'Monitorar preços para o período alvo.', done: false },
                            { title: 'Reserva de Airbnb Inicial (15 dias)', desc: 'Para usar como base na caça aos apartamentos definitivos.', done: false },
                            { title: 'Abertura de Conta Internacional (Nomad/Wise)', desc: 'Para levar a reserva financeira inicial.', done: true },
                        ].map((task, i) => (
                            <div key={i} className="p-4 flex items-start gap-4 hover:bg-secondary/20 transition-colors cursor-pointer group">
                                <button className="mt-1 flex-shrink-0">
                                    {task.done ? (
                                        <CheckCircle2 className="h-5 w-5 text-brand-primary" />
                                    ) : (
                                        <Circle className="h-5 w-5 text-muted-foreground group-hover:text-brand-primary transition-colors" />
                                    )}
                                </button>
                                <div>
                                    <h4 className={`font-medium ${task.done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{task.title}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{task.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
