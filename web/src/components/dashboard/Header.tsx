'use client';

import * as React from 'react';
import { useAuthStore } from '@/store/authStore';
import { Bell, Menu, Plane, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header({
    isSidebarCollapsed,
    onToggleDesktop,
    onToggleMobile
}: {
    isSidebarCollapsed?: boolean,
    onToggleDesktop?: () => void,
    onToggleMobile?: () => void
}) {
    const { user, toggleMode } = useAuthStore();
    const isResident = user?.appMode === 'RESIDENT';

    return (
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background/80 backdrop-blur px-4 sm:gap-x-6 sm:px-6 lg:px-8">
            <button type="button" onClick={onToggleMobile} className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground md:hidden">
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
            {onToggleDesktop && (
                <button type="button" onClick={onToggleDesktop} className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground hidden md:block">
                    <span className="sr-only">Toggle sidebar</span>
                    <Menu className="h-6 w-6" aria-hidden="true" />
                </button>
            )}

            {/* Separator */}
            <div className="h-6 w-px bg-border md:hidden" aria-hidden="true" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <div className="flex flex-1 items-center justify-center sm:justify-start">
                    {/* Mode Switcher */}
                    <div className="relative flex items-center bg-secondary/50 rounded-full p-1 border border-border w-[200px] sm:w-[240px]">
                        <motion.div
                            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-brand-primary rounded-full"
                            layout
                            initial={false}
                            animate={{
                                x: isResident ? "100%" : "0%",
                                backgroundColor: isResident ? '#f59e0b' : '#3b82f6' // Secondary vs Primary 
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                        <button
                            className={`relative py-1.5 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 flex-1 justify-center transition-colors z-10 ${!isResident ? 'text-white' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => toggleMode('PLANNER')}
                        >
                            <Plane className="w-3 h-3 sm:w-4 sm:h-4" />
                            Planejador
                        </button>
                        <button
                            className={`relative py-1.5 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 flex-1 justify-center transition-colors z-10 ${isResident ? 'text-white' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={() => toggleMode('RESIDENT')}
                        >
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                            Residente
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    <button type="button" className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground">
                        <span className="sr-only">View notifications</span>
                        <Bell className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Separator */}
                    <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" aria-hidden="true" />

                    {/* Profile dropdown */}
                    <div className="flex items-center gap-x-4">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary flex items-center justify-center text-white font-bold uppercase text-sm">
                            {user?.name?.charAt(0) || user?.email.charAt(0) || 'U'}
                        </div>
                        <span className="hidden lg:flex lg:items-center">
                            <span className="ml-2 text-sm font-semibold leading-6 text-foreground" aria-hidden="true">
                                {user?.name || user?.email.split('@')[0]}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
