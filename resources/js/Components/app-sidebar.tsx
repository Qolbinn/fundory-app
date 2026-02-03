import {
    AudioWaveform,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
} from 'lucide-react';
import * as React from 'react';

import { TeamSwitcher } from '@/Components/team-switcher';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar';
import { NavAsset } from './nav-asset';
import { NavOperational } from './nav-operational';
import { NavSetting } from './nav-setting';
import { NavUser } from './nav-user';

// This is sample data.
const data = {
    user: {
        name: 'shadcn',
        email: 'm@example.com',
        avatar: '/avatars/shadcn.jpg',
    },
    teams: [
        {
            name: 'Acme Inc',
            logo: GalleryVerticalEnd,
            plan: 'Enterprise',
        },
        {
            name: 'Acme Corp.',
            logo: AudioWaveform,
            plan: 'Startup',
        },
        {
            name: 'Evil Corp.',
            logo: Command,
            plan: 'Free',
        },
    ],
    navOperationals: [
        {
            name: 'Dashboard Operasional',
            url: route('dashboard'),
            icon: Frame,
        },
        {
            name: 'Transaksi Operasional',
            url: route('operational.transaction'),
            icon: PieChart,
        },
        {
            name: 'Kategori Operasional',
            url: route('operational.category'),
            icon: Map,
        },
    ],
    navAssets: [
        {
            name: 'Dashboard Asset',
            url: '#',
            icon: Frame,
        },
        {
            name: 'Transaksi Asset',
            url: route('asset.transaction'),
            icon: PieChart,
        },
        {
            name: 'Kategori Asset',
            url: route('asset.category'),
            icon: Map,
        },
    ],
    navSettings: [
        {
            name: 'Profile',
            url: route('profile.edit'),
            icon: Frame,
        },
        {
            name: 'Information',
            url: '/settings/information',
            icon: PieChart,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavOperational operationals={data.navOperationals} />
                <NavAsset assets={data.navAssets} />
            </SidebarContent>
            <SidebarFooter>
                <NavSetting settings={data.navSettings} />
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
