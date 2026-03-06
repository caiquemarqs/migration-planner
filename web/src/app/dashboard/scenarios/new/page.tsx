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
    budgetCap: z.coerce.number().optional(),
});

type ScenarioFormValues = z.infer<typeof scenarioSchema>;

export default function NewScenarioPage() {
    const router = useRouter();
    const [errorMsg, setErrorMsg] = React.useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ScenarioFormValues>({
        resolver: zodResolver(scenarioSchema),
        defaultValues: {
            budgetCap: 0,
        }
    });

    const onSubmit = async (data: ScenarioFormValues) => {
        try {
            setErrorMsg('');
            const response = await api.post('/scenarios', {
                ...data,
                targetDate: new Date(data.targetDate).toISOString(),
            });
            const newScenario = response.data.data.scenario;
            router.push(`/dashboard/scenarios/${newScenario.id}`);
        } catch (error: any) {
            setErrorMsg(error.response?.data?.message || 'Erro ao criar cenário.');
        }
    };

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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {errorMsg && (
                        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                            {errorMsg}
                        </div>
                    )}

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
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Orçamento Limite Disponível (BRL)</label>
                            <Input type="number" placeholder="Opcional" {...register('budgetCap')} />
                            {errors.budgetCap && <p className="text-xs text-destructive">{errors.budgetCap.message}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-border">
                        <Button type="submit" variant="gradient" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            {isSubmitting ? 'Salvando...' : 'Criar Cenário'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
