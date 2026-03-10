'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Loader2 } from 'lucide-react';
import { PageWrapper } from '@/components/PageWrapper';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { isAuthenticated, isLoading, fetchUser } = useAuthStore();
    const [isDesktopCollapsed, setIsDesktopCollapsed] = React.useState(false);
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);

    React.useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    React.useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Overlay for mobile sidebar */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <Sidebar
                isCollapsed={isDesktopCollapsed}
                isMobileOpen={isMobileOpen}
                onToggleDesktop={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
                onCloseMobile={() => setIsMobileOpen(false)}
            />
            <div className={`${isDesktopCollapsed ? 'md:pl-20' : 'md:pl-64'} flex flex-col min-h-screen transition-all duration-300`}>
                <Header
                    isSidebarCollapsed={isDesktopCollapsed}
                    onToggleDesktop={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
                    onToggleMobile={() => setIsMobileOpen(!isMobileOpen)}
                />
                <main className="flex-1 relative z-0">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                        <PageWrapper>{children}</PageWrapper>
                    </div>
                </main>
            </div>
        </div>
    );
}
