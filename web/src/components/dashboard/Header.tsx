'use client';

import * as React from 'react';
import { useAuthStore } from '@/store/authStore';
import { Bell, Menu } from 'lucide-react';

export function Header() {
    const user = useAuthStore((state) => state.user);

    return (
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background/80 backdrop-blur px-4 sm:gap-x-6 sm:px-6 lg:px-8">
            <button type="button" className="-m-2.5 p-2.5 text-muted-foreground md:hidden hover:text-foreground">
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-border md:hidden" aria-hidden="true" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <div className="flex flex-1 items-center">
                    {/* We can put a global search here if needed */}
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
