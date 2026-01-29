import { cn } from '@/Lib/utils';
import { Link } from '@inertiajs/react';
import { FileText, LayoutDashboard, LucideIcon, Settings } from 'lucide-react';
import { HTMLAttributes } from 'react';

// Interface untuk Props
interface SidebarProps extends HTMLAttributes<HTMLDivElement> {}

// Interface untuk Nav Item biar rapi
interface NavItem {
    name: string;
    href: string;
    icon: LucideIcon;
    active: boolean;
}

export default function Sidebar({ className }: SidebarProps) {
    // Di TS, route() kadang butuh deklarasi global, tapi biasanya aman via Ziggy
    // Kalau error 'route is not defined', kita bahas config Ziggy-nya nanti.

    const navItems: NavItem[] = [
        {
            name: 'Rekap Operational',
            href: route('dashboard'),
            icon: LayoutDashboard,
            active: route().current('dashboard'),
        },
        {
            name: 'Transaksi Operational',
            href: '#',
            icon: FileText,
            active: false,
        },
        {
            name: 'Kategori Operational',
            href: '#',
            icon: FileText,
            active: false,
        },
        {
            name: 'Rekap Asset',
            href: '#',
            icon: FileText,
            active: false,
        },
        {
            name: 'Transaksi Asset',
            href: '#',
            icon: FileText,
            active: false,
        },
        {
            name: 'Kategori Asset',
            href: '#',
            icon: Settings,
            active: false,
        },
    ];

    return (
        <div
            className={cn(
                'min-h-screen border-r bg-background pb-12',
                className,
            )}
        >
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-primary">
                        FinanceApp
                    </h2>
                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                                    item.active
                                        ? 'bg-accent text-accent-foreground'
                                        : 'text-muted-foreground',
                                )}
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
