'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ArrowLeftRight, ShoppingCart, Home as HomeIcon, Coffee, Car, Loader2 } from 'lucide-react';

export default function ComparePage() {
    const [isLoading, setIsLoading] = React.useState(true);
    const [originName, setOrigin] = React.useState('Seu Custo Atual (Brasil)');
    const [destinationName, setDestination] = React.useState('Destino...');

    const [originIncome, setOriginIncome] = React.useState(0);
    const [originCosts, setOriginCosts] = React.useState({ categories: {}, total: 0 });

    const [destCosts, setDestCosts] = React.useState<any>({});
    const [destTotalOriginal, setDestTotalOriginal] = React.useState(0);
    const [destTotalBRL, setDestTotalBRL] = React.useState(0);
    const [destCurrency, setDestCurrency] = React.useState('USD');
    const [fxRateBRLtoTarget, setFxRateBRLtoTarget] = React.useState(0.2); // Default fallback 1 BRL = 0.2 USD
    const [scenarioFound, setScenarioFound] = React.useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const date = new Date();
            const month = format(date, 'MM');
            const year = format(date, 'yyyy');

            // 1. Fetch current user financial summary
            const { data: sumRes } = await api.get(`/transactions/summary?month=${month}&year=${year}`);
            const sumData = sumRes.data.summary;
            setOriginIncome(sumData.totalIncome || 0);

            const origTotal = sumData.totalExpense || 0;
            const expenseByCat = sumData.expenseByCategory || {};
            setOriginCosts({
                categories: expenseByCat,
                total: origTotal,
            });

            // 2. Fetch the latest scenario
            const { data: scRes } = await api.get('/scenarios');
            const scenarios = scRes.data.scenarios || [];

            if (scenarios.length > 0) {
                setScenarioFound(true);
                const s = scenarios[0]; // Active scenario
                const destCty = s.targetCity || s.destCity;
                const destCtry = s.targetCountry || s.destCountry;
                setDestination(`${destCty}, ${destCtry}`);

                const curr = s.currency || 'USD';
                setDestCurrency(curr);

                // 3. Fetch FX rate (BRL to Target Currency)
                let rate = 0.2; // fallback
                try {
                    const { data: fxRes } = await api.get(`/fx/rate?base=BRL&target=${curr}`);
                    rate = fxRes.data.rate;
                    setFxRateBRLtoTarget(rate);
                } catch (e) { console.warn('FX fail, using fallback:', curr, rate); }

                // 4. Fetch COL data
                const { data: colRes } = await api.get(`/col?country=${destCtry}&city=${destCty}`);
                const colData = colRes.data.costs || {};

                // Map col data
                let dTotalOrig = 0;
                let mappedDestCosts: any = {};
                Object.keys(colData).forEach(cat => {
                    const avg = colData[cat].avg || 0;
                    mappedDestCosts[cat] = avg;
                    dTotalOrig += avg;
                });

                setDestCosts(mappedDestCosts);
                setDestTotalOriginal(dTotalOrig);
                // Convert back: if 1 BRL = 0.2 USD, then USD amount / 0.2 = BRL amount.
                setDestTotalBRL(dTotalOrig / rate);
            }
        } catch (error) {
            console.error('Failed to fetch comparison data', error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const handleSwap = () => {
        const temp = originName;
        setOrigin(destinationName);
        setDestination(temp);
    };

    const getOriginCat = (key: string) => (originCosts.categories as any)[key] || 0;
    const getDestCat = (key: string) => destCosts[key] || 0;
    const convertToBRL = (val: number) => val / fxRateBRLtoTarget;

    const categories = [
        { name: 'Aluguel / Moradia', icon: <HomeIcon className="w-4 h-4" />, bg: 'bg-blue-500/10 text-blue-500', orig: getOriginCat('RENT'), dest: convertToBRL(getDestCat('rent')), destCurr: `${destCurrency} ${getDestCat('rent').toFixed(2)}` },
        { name: 'Mercado / Alimentação', icon: <ShoppingCart className="w-4 h-4" />, bg: 'bg-emerald-500/10 text-emerald-500', orig: getOriginCat('GROCERIES'), dest: convertToBRL(getDestCat('groceries')), destCurr: `${destCurrency} ${getDestCat('groceries').toFixed(2)}` },
        { name: 'Transporte / Combustível', icon: <Car className="w-4 h-4" />, bg: 'bg-zinc-500/10 text-zinc-500', orig: getOriginCat('TRANSPORT'), dest: convertToBRL(getDestCat('transport')), destCurr: `${destCurrency} ${getDestCat('transport').toFixed(2)}` },
        { name: 'Contas (Água, Luz, Net)', icon: <Coffee className="w-4 h-4" />, bg: 'bg-orange-500/10 text-orange-500', orig: getOriginCat('UTILITIES') + getOriginCat('HEALTH'), dest: convertToBRL(getDestCat('utilities') + getDestCat('health')), destCurr: `${destCurrency} ${(getDestCat('utilities') + getDestCat('health')).toFixed(2)}` },
    ];

    const totalOrig = originCosts.total;
    const totalDest = destTotalBRL;

    const currentSavings = originIncome - totalOrig;

    // Assume same purchasing power for destination income for MVP display purposes
    const destIncomeOriginal = originIncome * fxRateBRLtoTarget;
    const destIncomeBRL = originIncome; // Converted back
    const destSavings = destIncomeBRL - totalDest;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
            </div>
        );
    }

    if (!scenarioFound) {
        return (
            <div className="animate-in fade-in zoom-in-95 duration-500 space-y-6">
                <h1 className="text-3xl font-bold tracking-tight">Comparador de Custo de Vida</h1>
                <p className="text-muted-foreground mt-1 text-red-500">
                    Você precisa criar um cenário de imigração para utilizar o comparador.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Comparador de Custo de Vida</h1>
                <p className="text-muted-foreground mt-1">Veja detalhadamente a diferença de preço entre duas cidades, baseado nos seus gastos reais deste mês.</p>
            </div>

            {/* Country Selector */}
            <Card className="p-2 border-brand-primary/20 bg-card/50 glass">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
                    <div className="flex-1 w-full relative">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Origem</span>
                        <div className="text-lg font-semibold bg-secondary/50 p-3 rounded-xl border border-border">
                            {originName}
                        </div>
                    </div>

                    <Button
                        onClick={handleSwap}
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-12 w-12 bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white transition-colors shrink-0"
                    >
                        <ArrowLeftRight className="h-6 w-6" />
                    </Button>

                    <div className="flex-1 w-full relative">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Destino</span>
                        <div className="text-lg font-semibold bg-brand-primary/5 p-3 rounded-xl border border-brand-primary/30">
                            {destinationName}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Comparison Stats */}
            <div className="grid gap-6 md:grid-cols-2">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="md:col-span-2">
                    <Card className="h-full">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex justify-between items-center text-lg">
                                Categorias Principais
                                <span className="text-xs font-normal text-muted-foreground px-2 py-1 bg-secondary rounded-full">Câmbio: 1 BRL = {(fxRateBRLtoTarget).toFixed(4)} {destCurrency}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6 mt-4">
                                {categories.map((c, i) => (
                                    <div key={i} className="flex flex-col gap-2 p-3 bg-secondary/20 rounded-lg border border-border/50">
                                        <div className="flex items-center gap-2 text-sm font-medium mb-1">
                                            <div className={`p-1.5 rounded-md ${c.bg}`}>{c.icon}</div>
                                            {c.name}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-semibold text-muted-foreground w-1/3">
                                                <div className="text-xs font-normal opacity-70 mb-1">Sua Conta Atual</div>
                                                <div className="text-lg text-foreground">R$ {c.orig.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                                            </div>
                                            <div className="flex items-center gap-4 text-right">
                                                <div>
                                                    <div className="text-xs font-normal opacity-70 mb-1 text-brand-primary">Lá ({destCurrency})</div>
                                                    <div className="text-sm text-brand-primary font-medium mt-1">{c.destCurr}</div>
                                                </div>
                                                <div className="h-6 w-px bg-border mx-1"></div>
                                                <div>
                                                    <div className="text-xs font-normal opacity-70 mb-1">Custo Convertido</div>
                                                    <div className="text-lg font-bold text-foreground">R$ {c.dest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Income vs Savings Power */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="border-brand-primary/30 overflow-hidden bg-gradient-to-r from-card to-secondary/30">
                    <CardHeader>
                        <CardTitle className="text-xl">Poder de Compra Realmente Necessário</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-sm font-bold text-muted-foreground uppercase">No Brasil (Atual)</span>
                                    </div>
                                    <div className="space-y-2 text-sm bg-background p-4 rounded-lg border">
                                        <div className="flex justify-between">
                                            <span>Sua Renda Bruta</span>
                                            <span className="font-semibold text-brand-primary">R$ {originIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Seus Custos Totais</span>
                                            <span className="font-semibold text-destructive">- R$ {totalOrig.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="flex justify-between border-t border-border pt-2">
                                            <span className="font-bold">Capacidade Atual de Poupança</span>
                                            <span className="font-black">R$ {currentSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/20">
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-sm font-bold text-brand-primary uppercase">No Destino ({destinationName})</span>
                                    </div>
                                    <div className="space-y-2 text-sm font-medium">
                                        <div className="flex justify-between items-center text-destructive pb-2 border-b border-destructive/20">
                                            <span>Custo Estimado Base</span>
                                            <span className="font-black text-lg">R$ {totalDest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <span className="text-xs font-normal">/ mês</span></span>
                                        </div>
                                        <div className="pt-2 text-muted-foreground text-xs leading-relaxed">
                                            Para manter sua capacidade de poupança atual e cobrir o custo de vida no destino, sua exigência de renda seria de: <strong className="text-foreground">R$ {(totalDest + Math.max(0, currentSavings)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> ({destCurrency} {((totalDest + Math.max(0, currentSavings)) * fxRateBRLtoTarget).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs text-brand-primary/80 text-center font-semibold bg-brand-primary/10 rounded-md p-2 border border-brand-primary/20">
                                    {(totalDest > totalOrig) ? `O custo de vida é ${((totalDest / (totalOrig || 1)) * 100 - 100).toFixed(0)}% maior do que seus custos no Brasil.` : `O custo de vida é ${((1 - (totalDest / (totalOrig || 1))) * 100).toFixed(0)}% menor do que no Brasil.`}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
