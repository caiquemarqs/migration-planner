'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Plane,
    LayoutDashboard,
    MapPin,
    CheckSquare,
    LogOut,
    Settings,
    ShoppingCart,
    Wallet,
    Users,
    Share2,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const navigation = [
    { name: 'Visão Geral', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Meus Cenários', href: '/dashboard/scenarios', icon: MapPin },
    { name: 'Evolução Financeira', href: '/dashboard/finances', icon: Wallet },
    { name: 'Custo de Vida', href: '/dashboard/compare', icon: ShoppingCart },
    { name: 'Grupo Familiar', href: '/dashboard/family', icon: Users },
    { name: 'Checklist', href: '/dashboard/checklist', icon: CheckSquare },
    { name: 'Embaixador', href: '/dashboard/affiliate', icon: Share2 },
];

export function Sidebar({
    isCollapsed,
    isMobileOpen,
    onToggleDesktop,
    onCloseMobile
}: {
    isCollapsed?: boolean,
    isMobileOpen?: boolean,
    onToggleDesktop?: () => void,
    onCloseMobile?: () => void
}) {
    const pathname = usePathname();
    const logout = useAuthStore((state) => state.logout);

    return (
        <div className={`
            fixed inset-y-0 left-0 z-50 flex h-full flex-col bg-card border-r border-border transition-all duration-300 ease-in-out
            ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
            md:translate-x-0 
            ${isCollapsed ? 'md:w-20' : 'md:w-64'}
            w-64
        `}>
            {/* Header / Logo section */}
            <div className={`flex h-16 shrink-0 items-center border-b border-border ${isCollapsed ? 'md:justify-center md:px-0 px-6 justify-between' : 'px-6 justify-between'}`}>
                <Link href="/dashboard" className="flex items-center gap-2" onClick={onCloseMobile}>
                    <Plane className="h-6 w-6 text-brand-primary shrink-0" />
                    <span className={`text-xl font-bold tracking-tight ${isCollapsed ? 'md:hidden' : 'block'}`}>ImigraFlow</span>
                </Link>
                {/* Close button for mobile */}
                <button className="md:hidden text-muted-foreground hover:text-foreground" onClick={onCloseMobile}>
                    <ChevronLeft className="h-6 w-6" />
                </button>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto">
                <nav className="flex-1 space-y-1 px-4 py-4">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onCloseMobile}
                                className={`
                                  group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                                  ${isActive
                                        ? 'bg-brand-primary/10 text-brand-primary'
                                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                    }
                                `}
                            >
                                <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-brand-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                                <span className={`truncate ${isCollapsed ? 'md:hidden' : 'block'}`}>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t border-border p-4 space-y-2">
                {onToggleDesktop && (
                    <button
                        onClick={onToggleDesktop}
                        className={`hidden md:flex w-full group items-center rounded-lg py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'}`}
                        title={isCollapsed ? "Expandir" : "Recolher"}
                    >
                        {isCollapsed ? <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-foreground" /> : <ChevronLeft className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-foreground" />}
                        <span className={isCollapsed ? 'hidden' : 'block'}>Recolher Menu</span>
                    </button>
                )}
                <Link
                    href="/dashboard/settings"
                    onClick={onCloseMobile}
                    className={`group flex items-center rounded-lg py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors ${isCollapsed ? 'md:justify-center md:px-0 px-3 gap-3' : 'gap-3 px-3'}`}
                    title={isCollapsed ? "Configurações" : ""}
                >
                    <Settings className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-foreground" />
                    <span className={isCollapsed ? 'md:hidden block' : 'block'}>Configurações</span>
                </Link>
                <button
                    onClick={() => {
                        logout();
                        if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full group flex items-center rounded-lg py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors ${isCollapsed ? 'md:justify-center md:px-0 px-3 gap-3' : 'gap-3 px-3'}`}
                    title={isCollapsed ? "Sair" : ""}
                >
                    <LogOut className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-destructive" />
                    <span className={isCollapsed ? 'md:hidden block' : 'block'}>Sair</span>
                </button>
            </div>
        </div>
    );
}
