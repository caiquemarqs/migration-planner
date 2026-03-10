'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, TrendingUp, HandCoins, Users, Banknote, AlertCircle, Share2, DollarSign, Loader2, Check } from 'lucide-react';

export default function AffiliatePage() {
    const [isLoading, setIsLoading] = React.useState(true);
    const [isActivating, setIsActivating] = React.useState(false);
    const [isActive, setIsActive] = React.useState(false);
    const [affiliateData, setAffiliateData] = React.useState<any>(null);
    const [copied, setCopied] = React.useState(false);

    // PIX State
    const [pixKey, setPixKey] = React.useState('');
    const [isEditingPix, setIsEditingPix] = React.useState(false);
    const [isSavingPix, setIsSavingPix] = React.useState(false);

    // Payout State
    const [payoutAmount, setPayoutAmount] = React.useState('');
    const [isRequestingPayout, setIsRequestingPayout] = React.useState(false);
    const [payoutMsg, setPayoutMsg] = React.useState('');

    const fetchDashboard = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/affiliate/dashboard');
            if (res.data.data.affiliate) {
                setAffiliateData(res.data.data.affiliate);
                setPixKey(res.data.data.affiliate.pixKey || '');
                setIsActive(true);
            }
        } catch (error: any) {
            if (error.response?.status === 404 || error.response?.data?.message === 'Affiliate profile not found') {
                setIsActive(false);
            }
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchDashboard();
    }, []);

    const handleActivate = async () => {
        setIsActivating(true);
        try {
            await api.post('/affiliate/activate');
            await fetchDashboard();
        } catch (error) {
            alert('Erro ao ativar conta de afiliado');
        } finally {
            setIsActivating(false);
        }
    };

    const handleSavePix = async () => {
        if (!pixKey.trim()) return;
        setIsSavingPix(true);
        try {
            await api.put('/affiliate/pix', { pixKey });
            setIsEditingPix(false);
            setAffiliateData((prev: any) => ({ ...prev, pixKey }));
        } catch (error) {
            alert('Erro ao salvar Chave PIX');
        } finally {
            setIsSavingPix(false);
        }
    };

    const handleRequestPayout = async () => {
        const amount = parseFloat(payoutAmount);
        if (isNaN(amount) || amount <= 0) {
            setPayoutMsg('Valor inválido.');
            return;
        }
        if (amount > affiliateData.balance) {
            setPayoutMsg('Saldo insuficiente.');
            return;
        }

        setIsRequestingPayout(true);
        setPayoutMsg('');
        try {
            await api.post('/affiliate/payout', { amount });
            setPayoutAmount('');
            setPayoutMsg('Saque solicitado com sucesso! Processamento em D+1.');
            await fetchDashboard();
        } catch (error: any) {
            setPayoutMsg(error.response?.data?.message || 'Erro ao solicitar saque.');
        } finally {
            setIsRequestingPayout(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="h-10 w-10 animate-spin text-brand-primary" />
            </div>
        );
    }

    if (!isActive || !affiliateData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in zoom-in-95">
                <div className="h-24 w-24 bg-brand-primary/10 rounded-full flex items-center justify-center">
                    <Share2 className="h-12 w-12 text-brand-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Torne-se um Embaixador ImigraFlow</h1>
                    <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
                        Indique a plataforma que revolucionou seu planejamento financeiro e ganhe 30% de comissão recorrente em cada nova assinatura.
                    </p>
                </div>
                <Button
                    size="lg"
                    onClick={handleActivate}
                    disabled={isActivating}
                    className="bg-brand-primary text-white hover:bg-brand-primary/90 text-lg px-8 py-6 rounded-full shadow-lg shadow-brand-primary/25"
                >
                    {isActivating ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
                    Ativar Meu Código Agora
                </Button>
            </div>
        );
    }

    const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://imigraflow.com';
    const url = `${BASE_URL}/register?ref=${affiliateData.code}`;

    const stats = {
        clicks: affiliateData._count?.clicks || 0,
        conversions: affiliateData._count?.conversions || 0,
        balance: affiliateData.balance || 0,
        totalEarned: affiliateData.totalEarned || 0
    };

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Painel de Afiliado</h1>
                    <p className="text-muted-foreground mt-1">Acompanhe seus ganhos e seu impacto.</p>
                </div>
                <div className="flex items-center gap-2 bg-secondary/50 p-2 pl-4 rounded-xl border max-w-full overflow-hidden">
                    <span className="text-sm font-medium pr-2 truncate text-muted-foreground">{url}</span>
                    <Button onClick={handleCopy} size="sm" variant={copied ? "default" : "outline"} className={`gap-2 shrink-0 ${copied ? 'bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-500' : ''}`}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? 'Copiado' : 'Copiar Link'}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="border-brand-primary/20 bg-brand-primary/5 hover:border-brand-primary/40 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Saldo Disponível</p>
                                    <h3 className="text-3xl font-bold text-foreground">R$ {stats.balance.toFixed(2)}</h3>
                                </div>
                                <div className="p-2 bg-brand-primary/10 rounded-lg"><DollarSign className="h-5 w-5 text-brand-primary" /></div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="hover:border-border/80 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Cliques Únicos</p>
                                    <h3 className="text-3xl font-bold text-foreground">{stats.clicks}</h3>
                                </div>
                                <div className="p-2 bg-secondary rounded-lg"><TrendingUp className="h-5 w-5 text-muted-foreground" /></div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="hover:border-border/80 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Conversões (Vendas)</p>
                                    <h3 className="text-3xl font-bold text-foreground">{stats.conversions}</h3>
                                </div>
                                <div className="p-2 bg-secondary rounded-lg"><Users className="h-5 w-5 text-muted-foreground" /></div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Card className="border-brand-secondary/20 bg-brand-secondary/5 hover:border-brand-secondary/40 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Total Já Recebido</p>
                                    <h3 className="text-3xl font-bold text-foreground">R$ {stats.totalEarned.toFixed(2)}</h3>
                                </div>
                                <div className="p-2 bg-brand-secondary/10 rounded-lg"><HandCoins className="h-5 w-5 text-brand-secondary" /></div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Payout Section */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
                    <Card className="h-full border-border/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Banknote className="h-5 w-5 text-brand-primary" /> Saque PIX</CardTitle>
                            <CardDescription>Transfira seu saldo disponível para sua conta bancária sem taxas.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Chave PIX Cadastrada</label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="text"
                                        readOnly={!isEditingPix}
                                        value={pixKey}
                                        onChange={(e) => setPixKey(e.target.value)}
                                        placeholder="Sua Chave PIX"
                                        className={!isEditingPix ? "bg-secondary/50 opacity-70" : "bg-card"}
                                    />
                                    {isEditingPix ? (
                                        <Button onClick={handleSavePix} disabled={isSavingPix} size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                                            {isSavingPix ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}
                                        </Button>
                                    ) : (
                                        <Button onClick={() => setIsEditingPix(true)} variant="outline" size="sm">Editar</Button>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border/50">
                                <div className="flex items-center gap-2 mb-3">
                                    <Input
                                        type="number"
                                        placeholder="Valor do saque (R$)"
                                        value={payoutAmount}
                                        onChange={(e) => setPayoutAmount(e.target.value)}
                                        max={stats.balance}
                                        min="0"
                                    />
                                    <Button
                                        onClick={handleRequestPayout}
                                        disabled={isRequestingPayout || stats.balance <= 0 || !affiliateData.pixKey}
                                        className="bg-brand-primary hover:bg-brand-primary/90 text-white font-medium shadow-md shadow-brand-primary/20 shrink-0"
                                    >
                                        {isRequestingPayout ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                        Solicitar Saque
                                    </Button>
                                </div>
                                {payoutMsg && (
                                    <p className={`text-sm ${payoutMsg.includes('sucesso') ? 'text-emerald-500' : 'text-destructive'}`}>
                                        {payoutMsg}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> Pagamentos processados em D+1
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Info Feed */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
                    <Card className="h-full border-border/50 bg-secondary/10">
                        <CardHeader>
                            <CardTitle>Como funciona?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-muted-foreground">
                            <p>
                                <strong>1. Compartilhe seu Link:</strong> Copie seu link exclusivo de afiliado e envie para amigos, familiares ou poste nas suas redes sociais.
                            </p>
                            <p>
                                <strong>2. Acompanhamento:</strong> Sempre que alguém acessar o site pelo seu link, um cookie é gravado e rastreamos se essa pessoa criar uma conta e assinar um plano de assinatura em até 30 dias.
                            </p>
                            <p>
                                <strong>3. Comissão e Saque:</strong> Quando sua indicação efetua o pagamento da assinatura, o valor da sua comissão entra como Saldo Disponível imediatamente. Solicite o saque por PIX em poucos cliques.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
