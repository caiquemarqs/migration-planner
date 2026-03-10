'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

const scenarioSchema = z.object({
    name: z.string().min(3, 'Nome curto demais'),
    targetCountry: z.string().min(2, 'Obrigatório'),
    targetCity: z.string().min(2, 'Obrigatório'),
    targetDate: z.string().min(1, 'Data obrigatória'),
    savingsGoal: z.coerce.number().min(1000, 'A meta precisa ser realista (ex: 50000)'),
    budgetCap: z.coerce.number().optional().default(0),
});

type ScenarioFormValues = z.infer<typeof scenarioSchema>;

export default function NewScenarioPage() {
    const router = useRouter();
    const [errorMsg, setErrorMsg] = React.useState('');
    const [step, setStep] = React.useState(1);

    // Dynamic lists for the new interactive requirements
    const [members, setMembers] = React.useState([{ id: '1', name: 'Eu (Principal)', income: 0 }]);
    const [expenses, setExpenses] = React.useState({
        rent: 0,
        market: 0,
        transport: 0,
        cards: 0,
        debt: 0,
        savings: 0 // How much they can save per month
    });

    const addMember = () => setMembers([...members, { id: Date.now().toString(), name: '', income: 0 }]);
    const removeMember = (id: string) => setMembers(members.filter(m => m.id !== id));
    const updateMember = (id: string, field: string, val: string | number) => {
        setMembers(members.map(m => m.id === id ? { ...m, [field]: val } : m));
    };

    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors, isSubmitting },
    } = useForm<ScenarioFormValues>({
        resolver: zodResolver(scenarioSchema),
        defaultValues: {
            budgetCap: 0,
        }
    });

    const handleNextStep = async () => {
        if (step === 1) {
            const isValid = await trigger(['name', 'targetCountry', 'targetCity', 'targetDate']);
            if (isValid) setStep(2);
        } else if (step === 2) {
            setStep(3);
        }
    };

    const onSubmit = async (data: ScenarioFormValues) => {
        try {
            setErrorMsg('');

            // In a real backend, we'd send 'members' and 'expenses' as well in the payload
            const payload = {
                name: data.name,
                targetCountry: data.targetCountry,
                targetCity: data.targetCity,
                targetDate: new Date(data.targetDate).toISOString(),
                // Extra data simulating saving to the db:
                meta: { members, expenses, savingsGoal: data.savingsGoal, budgetCap: data.budgetCap }
            };

            const response = await api.post('/scenarios', payload);
            const newScenario = response.data.data.scenario;

            // --- SAVE FAMILY MEMBERS TO HOUSEHOLD API ---
            // Skip index 0 as it usually represents the main user
            for (let i = 1; i < members.length; i++) {
                const mem = members[i];
                if (mem.name) {
                    try {
                        await api.post('/household', {
                            name: mem.name,
                            age: 30, // Default for MVP fallback
                            type: 'DEPENDENTE',
                            works: mem.income > 0
                        });
                    } catch (e) {
                        console.warn('Failed to save dependent', e);
                    }
                }
            }

            // --- SAVE EXPENSES AND INCOME TO TRANSACTIONS API ---
            const currentMonth = new Date().toISOString();

            // Save incomes
            for (const mem of members) {
                if (mem.income > 0) {
                    try {
                        await api.post('/transactions', {
                            description: `Renda - ${mem.name}`,
                            amount: Number(mem.income),
                            type: 'INCOME',
                            category: 'INCOME',
                            date: currentMonth
                        });
                    } catch (e) {
                        console.warn('Failed to save income', e);
                    }
                }
            }

            // Save expenses
            const expenseMap = [
                { key: 'rent', category: 'RENT', label: 'Aluguel' },
                { key: 'market', category: 'GROCERIES', label: 'Mercado' },
                { key: 'transport', category: 'TRANSPORT', label: 'Transporte' },
                { key: 'cards', category: 'LEISURE', label: 'Cartões' },
                { key: 'debt', category: 'UTILITIES', label: 'Dívidas' }
            ];

            for (const exp of expenseMap) {
                const amount = Number(expenses[exp.key as keyof typeof expenses] || 0);
                if (amount > 0) {
                    try {
                        await api.post('/transactions', {
                            description: `Custo projetado - ${exp.label}`,
                            amount: amount,
                            type: 'EXPENSE',
                            category: exp.category,
                            date: currentMonth
                        });
                    } catch (e) {
                        console.warn('Failed to save expense', e);
                    }
                }
            }

            // The user requested to see their finances right away based on this setup
            router.push(`/dashboard/finances?scenarioId=${newScenario.id}`);
        } catch (error: any) {
            setErrorMsg(error.response?.data?.message || 'Erro ao criar cenário.');
        }
    };

    const totalIncome = members.reduce((acc, m) => acc + (Number(m.income) || 0), 0);
    const totalExpenses = Number(expenses.rent) + Number(expenses.market) + Number(expenses.transport) + Number(expenses.cards) + Number(expenses.debt);
    const currentBalance = totalIncome - totalExpenses;

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/scenarios" className="p-2 -ml-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Novo Cenário</h1>
                    <p className="text-muted-foreground">Adicione os detalhes do seu próximo destino de imigração.</p>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">

                {/* Stepper Header */}
                <div className="flex items-center justify-between mb-8 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-secondary -z-10 rounded-full" />
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-primary -z-10 rounded-full transition-all duration-300" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }} />

                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 1 ? 'bg-brand-primary text-white' : 'bg-secondary text-muted-foreground'}`}>1</div>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 2 ? 'bg-brand-primary text-white' : 'bg-secondary text-muted-foreground'}`}>2</div>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 3 ? 'bg-brand-primary text-white' : 'bg-secondary text-muted-foreground'}`}>3</div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {errorMsg && (
                        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                            {errorMsg}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Nome do Projeto/Dossiê</label>
                                <Input placeholder="Ex: Canadá 2026 - Master's Degree" {...register('name')} />
                                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">País de Destino</label>
                                    <Input placeholder="Ex: Canadá" {...register('targetCountry')} />
                                    {errors.targetCountry && <p className="text-xs text-destructive">{errors.targetCountry.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Cidade/Província</label>
                                    <Input placeholder="Ex: Toronto" {...register('targetCity')} />
                                    {errors.targetCity && <p className="text-xs text-destructive">{errors.targetCity.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none">Data Prevista da Viagem</label>
                                    <Input type="date" {...register('targetDate')} />
                                    {errors.targetDate && <p className="text-xs text-destructive">{errors.targetDate.message}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <h3 className="text-lg font-bold text-foreground">Grupo Familiar e Renda</h3>
                                <p className="text-sm text-muted-foreground">Adicione quem vai com você e a renda mensal atual de cada um.</p>
                            </div>

                            <div className="space-y-4">
                                {members.map((member, index) => (
                                    <div key={member.id} className="flex flex-col sm:flex-row gap-4 items-end p-4 border border-border rounded-lg bg-secondary/20">
                                        <div className="space-y-2 flex-1 w-full">
                                            <label className="text-xs font-medium">Nome / Parentesco</label>
                                            <Input value={member.name} onChange={(e) => updateMember(member.id, 'name', e.target.value)} placeholder={index === 0 ? "Ex: Você" : "Ex: Cônjuge"} disabled={index === 0} />
                                        </div>
                                        <div className="space-y-2 flex-1 w-full">
                                            <label className="text-xs font-medium">Renda Mensal (BRL)</label>
                                            <Input type="number" value={member.income} onChange={(e) => updateMember(member.id, 'income', Number(e.target.value))} placeholder="Ex: 5000" />
                                        </div>
                                        {index > 0 && (
                                            <Button type="button" variant="destructive" size="icon" onClick={() => removeMember(member.id)} className="shrink-0">
                                                <ArrowLeft className="h-4 w-4" /> {/* Or a trash icon */}
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <Button type="button" variant="outline" onClick={addMember} className="w-full border-dashed">
                                + Adicionar Membro
                            </Button>

                            <div className="p-4 bg-brand-primary/10 rounded-lg flex justify-between items-center text-brand-primary">
                                <span className="font-medium">Renda Bruta Familiar:</span>
                                <span className="text-xl font-bold">R$ {totalIncome.toLocaleString('pt-BR')}</span>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <h3 className="text-lg font-bold text-foreground">Gestão Financeira e Objetivo</h3>
                                <p className="text-sm text-muted-foreground">Coloque seus gastos mensais para vermos onde economizar e quanto juntar.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-secondary/20 p-4 rounded-lg border border-border">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">Aluguel / Moradia</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                                        <Input type="number" className="pl-8" value={expenses.rent || ''} onChange={e => setExpenses({ ...expenses, rent: Number(e.target.value) })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">Mercado / Alimentação</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                                        <Input type="number" className="pl-8" value={expenses.market || ''} onChange={e => setExpenses({ ...expenses, market: Number(e.target.value) })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">Transporte / Combustível</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                                        <Input type="number" className="pl-8" value={expenses.transport || ''} onChange={e => setExpenses({ ...expenses, transport: Number(e.target.value) })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">Cartões de Crédito / Extras</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                                        <Input type="number" className="pl-8" value={expenses.cards || ''} onChange={e => setExpenses({ ...expenses, cards: Number(e.target.value) })} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">Dívidas / Empréstimos</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                                        <Input type="number" className="pl-8" value={expenses.debt || ''} onChange={e => setExpenses({ ...expenses, debt: Number(e.target.value) })} />
                                    </div>
                                </div>
                                <div className="col-span-1 sm:col-span-2 space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">Quanto Consegue Guardar Hoje? (Opcional)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                                        <Input type="number" className="pl-8 border-brand-secondary/50" value={expenses.savings || ''} onChange={e => setExpenses({ ...expenses, savings: Number(e.target.value) })} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4 bg-background border border-border p-4 rounded-xl shadow-sm">
                                <div className="flex-1 w-full space-y-2">
                                    <label className="text-sm font-bold text-foreground">Objetivo Final (Quanto precisa?)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-brand-primary">R$</span>
                                        <Input type="number" className="pl-9 font-bold text-lg" placeholder="Ex: 80000" {...register('savingsGoal')} />
                                    </div>
                                    {errors.savingsGoal && <p className="text-xs text-destructive">{errors.savingsGoal.message}</p>}
                                </div>
                                <div className="flex-1 w-full space-y-2">
                                    <label className="text-sm font-bold text-foreground">Capital Já Guardado</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                                        <Input type="number" className="pl-9" placeholder="Ex: 15000" {...register('budgetCap')} />
                                    </div>
                                </div>
                            </div>

                            {/* Summary Real Time */}
                            <div className="p-4 rounded-xl border border-border bg-gradient-to-r from-secondary/50 to-transparent flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Caixa Livre (Renda - Gastos):</span>
                                <span className={`font-bold text-lg ${currentBalance > 0 ? 'text-brand-secondary' : 'text-destructive'}`}>
                                    R$ {currentBalance.toLocaleString('pt-BR')}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between pt-6 border-t border-border mt-8">
                        {step > 1 ? (
                            <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                                Voltar
                            </Button>
                        ) : <div></div>}

                        {step < 3 ? (
                            <Button type="button" variant="gradient" onClick={handleNextStep}>
                                Avançar Familiares <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                            </Button>
                        ) : (
                            <Button type="submit" variant="gradient" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                {isSubmitting ? 'Gerando Plano Médio...' : 'Finalizar Cenário & Ver Análise'}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
