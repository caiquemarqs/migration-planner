'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  MapPin,
  Wallet,
  Calculator,
  CheckCircle2,
  Globe
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full relative py-32 md:py-48 flex items-center justify-center overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-background" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-40 -left-40 w-[30rem] h-[30rem] bg-brand-secondary/20 rounded-full blur-3xl" />

        <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-sm font-medium mb-8 border border-border"
          >
            <span className="flex h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
            Vagas abertas para o Early Access
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl"
          >
            Planeje sua vida no exterior com <span className="text-gradient">segurança financeira</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            A primeira plataforma feita para organizar seu fluxo de caixa de imigração. Do planejamento até o momento em que você pisa no seu destino.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mt-10"
          >
            <Link href="/register">
              <Button size="lg" variant="gradient" className="w-full sm:w-auto gap-2 group">
                Simular Meu Cenário Grátis
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto glass hover:bg-secondary">
                Entender como funciona
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full border-y border-border bg-secondary/50 py-12">
        <div className="container px-4 md:px-6 mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border">
          <div className="flex flex-col items-center justify-center space-y-1">
            <h4 className="text-3xl font-bold text-foreground">15+</h4>
            <p className="text-sm font-medium text-muted-foreground">Países Suportados</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1">
            <h4 className="text-3xl font-bold text-foreground">Automático</h4>
            <p className="text-sm font-medium text-muted-foreground">Conversão de Câmbio</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1">
            <h4 className="text-3xl font-bold text-foreground">100%</h4>
            <p className="text-sm font-medium text-muted-foreground">Previsibilidade Real</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-1">
            <h4 className="text-3xl font-bold text-foreground">2.4k</h4>
            <p className="text-sm font-medium text-muted-foreground">Imigrantes Aprovam</p>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section id="features" className="w-full py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Tudo que você precisa em um só lugar</h2>
            <p className="text-muted-foreground max-w-[800px] text-lg">
              Esqueça planilhas confusas e dados desatualizados. Nós integramos custos de vida reais para o seu destino desejado.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MapPin className="h-10 w-10 text-brand-primary" />}
              title="Comparador de Destinos"
              desc="Compare o custo de vida entre cidades. Descubra onde sua reserva de emergência dura mais e seu poder de compra é maior."
            />
            <FeatureCard
              icon={<Calculator className="h-10 w-10 text-brand-secondary" />}
              title="Custo de Vida Real"
              desc="Nossos dados consideram índices em tempo real e categorias de custos como aluguel e alimentação."
            />
            <FeatureCard
              icon={<Wallet className="h-10 w-10 text-teal-500" />}
              title="Gestão de Reservas"
              desc="Crie cenários de imigração e veja exatamente qual seu Runway (sua reserva em meses) considerando variação cambial."
            />
            <FeatureCard
              icon={<Globe className="h-10 w-10 text-indigo-500" />}
              title="Câmbio Integrado"
              desc="Cotação puxada sempre atualizada. Saiba na hora o quanto seu dinheiro na origem vale localmente."
            />
            <FeatureCard
              icon={<CheckCircle2 className="h-10 w-10 text-green-500" />}
              title="Checklist Dinâmico"
              desc="Acompanhe emissão de vistos, traduções juramentadas, passagens e reservas tudo pareado com seu orçamento."
            />
            <FeatureCard
              icon={<div className="h-10 w-10 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold select-none">PRO</div>}
              title="Planejador Vitalício"
              desc="Um acesso para sempre com funcionalidades premium e sem mensalidades para guiar você pela vida inteira."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="w-full py-24 bg-secondary/30 border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Planos simples e transparentes</h2>
            <p className="text-muted-foreground max-w-[800px] text-lg">
              Comece agora ou faça o upgrade para obter o poder completo analítico do ImigraFlow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="flex flex-col p-8 rounded-3xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <h3 className="text-2xl font-bold mb-2">Basic</h3>
              <p className="text-muted-foreground mb-6">Comece sua jornada</p>
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold">Grátis</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <PricingFeature text="1 Cenário Ativo" />
                <PricingFeature text="Custo de Vida Básico" />
                <PricingFeature text="Checklist Simples" />
              </ul>
              <Link href="/register">
                <Button className="w-full" variant="outline" size="lg">Criar Conta</Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="flex flex-col p-8 rounded-3xl border-2 border-brand-primary bg-card shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">Popular</div>
              <h3 className="text-2xl font-bold mb-2">Lifetime PRO</h3>
              <p className="text-muted-foreground mb-6">Para migrantes sérios</p>
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-2xl font-semibold text-muted-foreground line-through mr-2">R$ 199</span>
                <span className="text-5xl font-extrabold text-gradient">R$ 97</span>
                <span className="text-sm font-medium text-muted-foreground">/único</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <PricingFeature text="Cenários Ilimitados" />
                <PricingFeature text="Comparador Simultâneo de Cidades" />
                <PricingFeature text="Overrides de Custos Específicos" />
                <PricingFeature text="Acesso total ao Câmbio Real-time" />
              </ul>
              <Link href="/register?plan=lifetime">
                <Button className="w-full" variant="gradient" size="lg">Desbloquear PRO Agora</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="flex flex-col items-start p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all group"
    >
      <div className="mb-4 p-3 rounded-xl bg-secondary group-hover:bg-background transition-colors border border-transparent group-hover:border-border">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function PricingFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <CheckCircle2 className="h-5 w-5 text-brand-primary flex-shrink-0" />
      <span className="text-foreground">{text}</span>
    </li>
  );
}
