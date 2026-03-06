'use client';

import * as React from 'react';
import Link from 'next/link';
import { Plane, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={cn(
                'fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent',
                isScrolled ? 'glass shadow-sm py-3' : 'bg-transparent py-5'
            )}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <Plane className="h-6 w-6 text-brand-primary group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                    <span className="text-xl font-bold tracking-tight">Imigra<span className="text-gradient">Flow</span></span>
                </Link>

                {/* Desktop Menu */}
                <nav className="hidden md:flex gap-6 items-center">
                    <Link href="#features" className="text-sm font-medium hover:text-brand-primary transition-colors">Funcionalidades</Link>
                    <Link href="#pricing" className="text-sm font-medium hover:text-brand-primary transition-colors">Planos</Link>
                    <Link href="#testimonials" className="text-sm font-medium hover:text-brand-primary transition-colors">Depoimentos</Link>
                    <div className="h-4 w-px bg-border mx-2"></div>
                    <Link href="/login">
                        <Button variant="ghost">Entrar</Button>
                    </Link>
                    <Link href="/register">
                        <Button variant="gradient">Começar Grátis</Button>
                    </Link>
                </nav>

                {/* Mobile Menu Toggle */}
                <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full glass border-b shadow-lg flex flex-col p-4 gap-4 md:hidden"
                    >
                        <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium p-2 hover:bg-white/10 rounded-md">Funcionalidades</Link>
                        <Link href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium p-2 hover:bg-white/10 rounded-md">Planos</Link>
                        <div className="h-px bg-border w-full my-2"></div>
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full">Entrar</Button>
                        </Link>
                        <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="gradient" className="w-full">Criar Conta</Button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
