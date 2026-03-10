'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ChecklistPage() {
    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Seu Check-list de Viagem</h1>
                    <p className="text-muted-foreground mt-1">Organize suas tarefas antes, durante e depois da mudança.</p>
                </div>
                <Link href="/dashboard" className="text-sm font-medium text-brand-primary flex items-center hover:underline">
                    <ArrowLeft className="mr-1 h-4 w-4" /> Voltar ao Painel
                </Link>
            </div>

            <Card className="border-dashed border-2 border-border/60 bg-secondary/10">
                <CardHeader className="text-center pb-4 pt-8">
                    <div className="mx-auto bg-brand-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <CheckSquare className="h-8 w-8 text-brand-primary" />
                    </div>
                    <CardTitle className="text-xl">Módulo em Desenvolvimento</CardTitle>
                    <CardDescription className="max-w-md mx-auto mt-2">
                        O checklist automatizado (baseado no seu país de destino e perfil) está sendo construído pela nossa equipe de arquitetura. Em breve você poderá gerenciar vistos, passagens, moradia e documentação aqui!
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pb-8">
                </CardContent>
            </Card>
        </div>
    );
}
