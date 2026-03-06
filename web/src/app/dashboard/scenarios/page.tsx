'use client';

import * as React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { PlusCircle, MapPin, Calendar, ArrowRight, Loader2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Scenario {
    id: string;
    name: string;
    targetCountry: string;
    targetCity: string;
    targetDate: string;
    budgetCap: number;
}

export default function ScenariosPage() {
    const [scenarios, setScenarios] = React.useState<Scenario[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchScenarios() {
            try {
                const response = await api.get('/scenarios');
                setScenarios(response.data.data.scenarios);
            } catch (error) {
                console.error('Error fetching scenarios:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchScenarios();
    }, []);

    return (
        <div className="space-y-6 flex flex-col min-h-[70vh]">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Meus Cenários</h1>
                    <p className="text-muted-foreground mt-1">Gerencie seus destinos e projeções de custos.</p>
                </div>
                <Link href="/dashboard/scenarios/new">
                    <Button variant="gradient" className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Novo Destino
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <div className="flex-1 flex justify-center items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
                </div>
            ) : scenarios.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl bg-card p-12 text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-bold text-foreground">Nenhum cenário encontrado</h3>
                    <p className="text-muted-foreground max-w-md mt-2 mb-6">
                        Você ainda não criou nenhum planejamento de imigração. Comece adicionando o país e a cidade dos seus sonhos.
                    </p>
                    <Link href="/dashboard/scenarios/new">
                        <Button variant="default" className="gap-2">
                            <PlusCircle className="h-4 w-4" />
                            Simular Meu Primeiro Destino
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {scenarios.map((scenario) => (
                        <div key={scenario.id} className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all flex flex-col">
                            <div className="p-5 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="rounded-xl bg-brand-primary/10 p-2.5">
                                        <MapPin className="h-5 w-5 text-brand-primary" />
                                    </div>
                                    <button className="text-muted-foreground hover:text-foreground">
                                        <MoreVertical className="h-5 w-5" />
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-1">{scenario.name}</h3>
                                <p className="text-sm text-muted-foreground">{scenario.targetCity}, {scenario.targetCountry}</p>

                                <div className="mt-6 flex items-center text-sm text-muted-foreground gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>Meta: {new Date(scenario.targetDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="border-t border-border bg-secondary/30 p-4">
                                <Link href={`/dashboard/scenarios/${scenario.id}`} className="flex items-center justify-between text-sm font-medium text-brand-primary group-hover:text-brand-primary/80 transition-colors">
                                    Ver Detalhes e Custos
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
