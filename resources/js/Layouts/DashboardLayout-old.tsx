import Header from '@/Components/Dashboard/Header';
import Sidebar from '@/Components/Dashboard/Sidebar';
import { cn } from '@/Lib/utils'; // Fungsi helper bawaan Shadcn untuk merge class
import { useSidebarStore } from '@/Stores/useSidebarStore';
import { PropsWithChildren, ReactNode } from 'react';

interface DashboardLayoutProps extends PropsWithChildren<{
    header?: ReactNode;
}> {}

export default function DashboardLayoutOld({
    // header,
    children,
}: DashboardLayoutProps) {
    // Ambil state desktop
    const { isDesktopOpen } = useSidebarStore();

    return (
        <div className="flex min-h-screen w-full bg-muted/40">
            {/* 1. Desktop Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 z-20 hidden flex-col border-r bg-background transition-all duration-300 ease-in-out md:flex',
                    // Jika Open: Lebar 64 (16rem/256px), Jika Closed: Lebar 0 dan geser ke kiri
                    isDesktopOpen
                        ? 'w-64 translate-x-0'
                        : 'w-0 -translate-x-full overflow-hidden',
                )}
            >
                <Sidebar className="border-r-0" />
            </aside>

            {/* 2. Main Content Wrapper */}
            <div
                className={cn(
                    'flex w-full flex-col transition-all duration-300 ease-in-out',
                    // Sesuaikan padding kiri wrapper agar konten tidak tertutup sidebar
                    isDesktopOpen ? 'md:pl-64' : 'md:pl-0',
                )}
            >
                <Header />

                <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
