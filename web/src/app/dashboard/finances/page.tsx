'use client';

import * as React from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, TrendingUp, TrendingDown, DollarSign, Plus, Trash2, ChevronLeft, ChevronRight, Target } from 'lucide-react';
import { format, subMonths, addMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTTooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';

type Transaction = {
    id: string;
    description: string;
    amount: number;
    currency: string;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    date: string;
};

type Summary = {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    expenseByCategory: Record<string, number>;
    momIncome?: number;
    momExpense?: number;
    momBalance?: number;
};

const CATEGORIES = [
    { id: 'RENT', label: 'Aluguel' },
    { id: 'GROCERIES', label: 'Mercado' },
    { id: 'TRANSPORT', label: 'Transporte' },
    { id: 'HEALTH', label: 'Saúde' },
    { id: 'UTILITIES', label: 'Contas (Luz, Água, etc)' },
    { id: 'LEISURE', label: 'Lazer' },
    { id: 'INCOME', label: 'Receita' }
];

export default function FinancesPage() {
    const [currentDate, setCurrentDate] = React.useState(new Date());
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);
    const [summary, setSummary] = React.useState<Summary | null>(null);
    const [scenario, setScenario] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    // Form states
    const [isAdding, setIsAdding] = React.useState(false);
    const [desc, setDesc] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const [currency, setCurrency] = React.useState('BRL');
    const [type, setType] = React.useState<'INCOME' | 'EXPENSE'>('EXPENSE');
    const [category, setCategory] = React.useState('RENT');
    const [date, setDate] = React.useState(format(new Date(), 'yyyy-MM-dd'));

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const month = format(currentDate, 'MM');
            const year = format(currentDate, 'yyyy');

            const [transRes, sumRes, scenRes] = await Promise.all([
                api.get(`/transactions?month=${month}&year=${year}`),
                api.get(`/transactions/summary?month=${month}&year=${year}`),
                api.get('/scenarios').catch(() => ({ data: { data: [] } }))
            ]);

            setTransactions(transRes.data.data.transactions);
            setSummary(sumRes.data.data.summary);

            const activeScenario = scenRes.data?.data?.[0];
            setScenario(activeScenario);
        } catch (error) {
            console.error('Failed to fetch finance data', error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, [currentDate]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!desc || !amount) return;

        try {
            await api.post('/transactions', {
                description: desc,
                amount: parseFloat(amount),
                currency,
                type,
                category,
                date: new Date(date).toISOString()
            });
            setIsAdding(false);
            setDesc('');
            setAmount('');
            fetchData();
        } catch (error) {
            console.error('Error adding transaction', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/transactions/${id}`);
            fetchData();
        } catch (error) {
            console.error('Error deleting transaction', error);
        }
    };

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    // Pie chart data
    const pieData = summary ? Object.entries(summary.expenseByCategory).map(([key, value]) => ({
        name: CATEGORIES.find(c => c.id === key)?.label || key,
        value
    })).sort((a, b) => b.value - a.value) : [];

    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    const formatCurrency = (value: number, curr: string = 'BRL') => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: curr }).format(value);
    };

    // Progress Chart Data (Trip Goal)
    const tripGoalAmount = scenario ? (scenario.savingsBRL * 1.5) : 10000; // Expected goal or fallback
    const currentSavings = summary ? summary.balance : 0; // Capacidade de poupança real do mês
    // ou se quiser manter o amount atual de savings do user (ex: accumulated)
    const accumulatedSavings = scenario ? scenario.savingsBRL : 0;
    const progressPercent = tripGoalAmount > 0 ? Math.min((accumulatedSavings / tripGoalAmount) * 100, 100) : 0;

    const progressData = [
        { name: 'Acumulado', value: accumulatedSavings, fill: '#10b981' }, 
        { name: 'Restante', value: Math.max(tripGoalAmount - accumulatedSavings, 0), fill: '#f4f4f5' } // light gray to match clean aesthetics
    ];

    const renderMomIndicator = (value?: number, invert = false) => {
        if (value === undefined) return null;
        if (value === 0) return <span className="text-xs text-muted-foreground ml-2">Mesmo valor do mês passado</span>;

        let isPositive = value > 0;
        let colorClass = isPositive ? 'text-emerald-500' : 'text-destructive';

        // For expenses, going down is good (green), going up is bad (red)
        if (invert) {
            colorClass = isPositive ? 'text-destructive' : 'text-emerald-500';
        }

        return (
            <div className={`flex items-center text-xs mt-1 ${colorClass}`}>
                {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                <span>{isPositive ? '+' : ''}{value.toFixed(1)}% vs mês passado</span>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Evolução Financeira</h1>
                    <p className="text-muted-foreground mt-1">Gerencie suas receitas e despesas com foco na sua meta de imigração.</p>
                </div>

                <div className="flex items-center gap-4 bg-card border border-border rounded-lg p-1">
                    <Button variant="ghost" size="icon" onClick={prevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium w-32 text-center capitalize">
                        {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                    </span>
                    <Button variant="ghost" size="icon" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
                </div>
            ) : (
                <>
                    {/* KPIs - Fincheck Aesthetic (Clean, Minimalist, White Cards w/ subtle borders) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="shadow-sm border-border bg-card">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Entradas</CardTitle>
                                <div className="p-1.5 bg-emerald-500/10 rounded-full"><TrendingUp className="h-4 w-4 text-emerald-500" /></div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">
                                    {formatCurrency(summary?.totalIncome || 0, 'BRL')}
                                </div>
                                {renderMomIndicator(summary?.momIncome)}
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-border bg-card">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Saídas</CardTitle>
                                <div className="p-1.5 bg-destructive/10 rounded-full"><TrendingDown className="h-4 w-4 text-destructive" /></div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">
                                    {formatCurrency(summary?.totalExpense || 0, 'BRL')}
                                </div>
                                {renderMomIndicator(summary?.momExpense, true)}
                            </CardContent>
                        </Card>

                        <Card className={`shadow-sm border-border text-white ${(summary?.balance || 0) >= 0 ? 'bg-emerald-600' : 'bg-destructive'}`}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-emerald-50">Capacidade de Poupança</CardTitle>
                                <div className="p-1.5 bg-white/20 rounded-full text-white"><DollarSign className="h-4 w-4" /></div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(summary?.balance || 0, 'BRL')}
                                </div>
                                <div className="text-xs text-emerald-100 mt-1">
                                    Foco principal da viagem
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Transaction List - Table Format (Fincheck style) */}
                        <Card className="flex flex-col lg:col-span-2 shadow-sm border-border bg-card">
                            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                                <div>
                                    <CardTitle>Últimas Transações</CardTitle>
                                    <CardDescription>Movimentações deste mês</CardDescription>
                                </div>
                                <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => setIsAdding(!isAdding)}>
                                    <Plus className="h-4 w-4 mr-1" /> Nova
                                </Button>
                            </CardHeader>
                            <CardContent className="flex-1 p-0 overflow-hidden">
                                {isAdding && (
                                    <div className="bg-muted/30 p-4 border-b border-border">
                                        <form onSubmit={handleAdd} className="space-y-3">
                                            <Input placeholder="Descrição (ex: Aluguel)" value={desc} onChange={e => setDesc(e.target.value)} required />
                                            <div className="flex gap-2">
                                                <Input type="number" step="0.01" placeholder="Valor" value={amount} onChange={e => setAmount(e.target.value)} required className="flex-[2]" />
                                                <select className="flex h-10 w-full flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                                    value={currency} onChange={(e) => setCurrency(e.target.value)}>
                                                    <option value="BRL">BRL (R$)</option>
                                                    <option value="EUR">EUR (€)</option>
                                                    <option value="CAD">CAD (C$)</option>
                                                    <option value="USD">USD ($)</option>
                                                </select>
                                                <Input type="date" value={date} onChange={e => setDate(e.target.value)} required className="flex-[2]" />
                                            </div>
                                            <div className="flex gap-2">
                                                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                                    value={type} onChange={(e: any) => { setType(e.target.value); if (e.target.value === 'INCOME') setCategory('INCOME'); else setCategory('RENT'); }}>
                                                    <option value="EXPENSE">Despesa</option>
                                                    <option value="INCOME">Receita</option>
                                                </select>
                                                {type === 'EXPENSE' && (
                                                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                                        value={category} onChange={e => setCategory(e.target.value)}>
                                                        {CATEGORIES.filter(c => c.id !== 'INCOME').map(c => (
                                                            <option key={c.id} value={c.id}>{c.label}</option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsAdding(false)}>Cancelar</Button>
                                                <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">Salvar</Button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                                            <tr>
                                                <th className="px-6 py-3 font-medium">Descrição</th>
                                                <th className="px-6 py-3 font-medium hidden md:table-cell">Categoria</th>
                                                <th className="px-6 py-3 font-medium hidden sm:table-cell">Data</th>
                                                <th className="px-6 py-3 font-medium text-right">Valor</th>
                                                <th className="px-4 py-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="text-center text-muted-foreground py-8 text-sm">
                                                        Nenhuma transação cadastrada.
                                                    </td>
                                                </tr>
                                            ) : (
                                                transactions.map((t) => (
                                                    <tr key={t.id} className="bg-card border-b hover:bg-muted/30 transition-colors group">
                                                        <td className="px-6 py-4 font-medium text-foreground flex items-center gap-2">
                                                            <div className={`h-2 w-2 rounded-full ${t.type === 'INCOME' ? 'bg-emerald-500' : 'bg-destructive'}`} />
                                                            {t.description}
                                                        </td>
                                                        <td className="px-6 py-4 hidden md:table-cell text-muted-foreground">
                                                            {CATEGORIES.find(c => c.id === t.category)?.label}
                                                        </td>
                                                        <td className="px-6 py-4 hidden sm:table-cell text-muted-foreground">
                                                            {format(new Date(t.date), 'dd/MM/yyyy')}
                                                        </td>
                                                        <td className={`px-6 py-4 text-right font-medium ${t.type === 'INCOME' ? 'text-emerald-500' : 'text-foreground'}`}>
                                                            {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount, t.currency || 'BRL')}
                                                        </td>
                                                        <td className="px-4 py-4 text-right">
                                                            <button onClick={() => handleDelete(t.id)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Charts Area View */}
                        <div className="space-y-6">
                            {/* Trip Goal Circular Chart */}
                            <Card className="shadow-sm border-border bg-card">
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-emerald-500/10 rounded-lg"><Target className="h-4 w-4 text-emerald-500" /></div>
                                        <CardTitle className="text-base text-muted-foreground">Progresso da Viagem</CardTitle>
                                    </div>
                                    <CardDescription>Sua meta acumulativa (Estimativa)</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center min-h-[220px] relative">
                                    <div className="h-48 w-full absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                                        <span className="text-3xl font-bold text-foreground">{progressPercent.toFixed(1)}%</span>
                                        <span className="text-xs text-muted-foreground text-center px-4 mt-1">
                                            {formatCurrency(accumulatedSavings)} /
                                            <br />{formatCurrency(tripGoalAmount)}
                                        </span>
                                    </div>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart>
                                            <Pie
                                                data={progressData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={65}
                                                outerRadius={85}
                                                startAngle={90}
                                                endAngle={-270}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {progressData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Expense Composition Bar Chart */}
                            <Card className="shadow-sm border-border bg-card">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base text-muted-foreground">Composição de Gastos</CardTitle>
                                    <CardDescription>Onde seu dinheiro está indo</CardDescription>
                                </CardHeader>
                                <CardContent className="min-h-[220px]">
                                    {pieData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={220}>
                                            <BarChart data={pieData} layout="vertical" margin={{ left: 0, right: 30, top: 10, bottom: 0 }}>
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                                                <RTTooltip
                                                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', borderRadius: '8px', color: '#09090b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                                    itemStyle={{ color: '#09090b' }}
                                                    cursor={{ fill: '#f4f4f5' }}
                                                    formatter={(value: number) => formatCurrency(value)}
                                                />
                                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                                                    {pieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-muted-foreground text-sm">Nenhuma despesa no período.</div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
