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
    Settings
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const navigation = [
    { name: 'Visão Geral', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Meus Cenários', href: '/dashboard/scenarios', icon: MapPin },
    { name: 'Checklist', href: '/dashboard/checklist', icon: CheckSquare },
];

export function Sidebar() {
    const pathname = usePathname();
    const logout = useAuthStore((state) => state.logout);

    return (
        <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-50 bg-card border-r border-border">
            <div className="flex h-16 shrink-0 items-center px-6 border-b border-border">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <Plane className="h-6 w-6 text-brand-primary" />
                    <span className="text-xl font-bold tracking-tight">ImigraFlow</span>
                </Link>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto">
                <nav className="flex-1 space-y-1 px-4 py-4">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                  group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                  ${isActive
                                        ? 'bg-brand-primary/10 text-brand-primary'
                                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                    }
                `}
                            >
                                <item.icon className={`h-5 w-5 ${isActive ? 'text-brand-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t border-border p-4 space-y-1">
                <Link
                    href="/dashboard/settings"
                    className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                    <Settings className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                    Configurações
                </Link>
                <button
                    onClick={logout}
                    className="w-full group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                    <LogOut className="h-5 w-5 text-muted-foreground group-hover:text-destructive" />
                    Sair
                </button>
            </div>
        </div>
    );
}
