import * as React from 'react';
import Link from 'next/link';
import { Plane, Twitter, Github, Linkedin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="w-full bg-secondary/30 border-t border-border mt-20 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Plane className="h-6 w-6 text-brand-primary" />
                            <span className="text-xl font-bold tracking-tight">Imigra<span className="text-gradient">Flow</span></span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Simplifique seu planejamento financeiro para mudar de país. Da reserva de emergência ao custo de vida no destino.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="p-2 bg-background rounded-full hover:bg-brand-primary hover:text-white transition-colors border shadow-sm"><Twitter className="h-4 w-4" /></Link>
                            <Link href="#" className="p-2 bg-background rounded-full hover:bg-brand-primary hover:text-white transition-colors border shadow-sm"><Github className="h-4 w-4" /></Link>
                            <Link href="#" className="p-2 bg-background rounded-full hover:bg-brand-primary hover:text-white transition-colors border shadow-sm"><Linkedin className="h-4 w-4" /></Link>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider">Produto</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#features" className="hover:text-brand-primary transition-colors">Funcionalidades</Link></li>
                            <li><Link href="#pricing" className="hover:text-brand-primary transition-colors">Planos PRO</Link></li>
                            <li><Link href="#" className="hover:text-brand-primary transition-colors">Comparador (Exclusivo)</Link></li>
                            <li><Link href="#" className="hover:text-brand-primary transition-colors">Roadmap</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider">Recursos</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-brand-primary transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-brand-primary transition-colors">Calculadora de Câmbio</Link></li>
                            <li><Link href="#" className="hover:text-brand-primary transition-colors">Central de Ajuda</Link></li>
                            <li><Link href="#" className="hover:text-brand-primary transition-colors">Programa de Afiliados</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider">Legal</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-brand-primary transition-colors">Termos de Uso</Link></li>
                            <li><Link href="#" className="hover:text-brand-primary transition-colors">Política de Privacidade</Link></li>
                            <li><Link href="#" className="hover:text-brand-primary transition-colors">Cookies</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} ImigraFlow. Todos os direitos reservados.
                    </p>
                    <div className="flex gap-4 text-xs font-semibold text-muted-foreground">
                        <span>Desenvolvido com</span>
                        <span className="text-red-500">♥</span>
                        <span>para imigrantes</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
