// import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
// import { Button } from '@/Components/ui/button';
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from '@/Components/ui/dropdown-menu';
// import { Sheet, SheetContent, SheetTrigger } from '@/Components/ui/sheet';
// import { useSidebarStore } from '@/Stores/useSidebarStore';
// import { PageProps } from '@/types'; // Import tipe dari langkah 1
// import { Link, usePage } from '@inertiajs/react';
// import { Menu } from 'lucide-react';
// import Sidebar from './Sidebar';

// export default function Header() {
//     // Generics <PageProps> memastikan TS tau struktur 'props'
//     const { props } = usePage<PageProps>();
//     const { auth } = props;
//     const { isOpen, setOpen } = useSidebarStore();

//     return (
//         <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
//             <Sheet open={isOpen} onOpenChange={setOpen}>
//                 <SheetTrigger asChild>
//                     <Button
//                         variant="outline"
//                         size="icon"
//                         className="shrink-0 md:hidden"
//                     >
//                         <Menu className="h-5 w-5" />
//                         <span className="sr-only">Toggle navigation menu</span>
//                     </Button>
//                 </SheetTrigger>
//                 <SheetContent side="left" className="w-64 p-0">
//                     <Sidebar className="border-none" />
//                 </SheetContent>
//             </Sheet>

//             <div className="w-full flex-1">
//                 <h1 className="text-lg font-semibold text-foreground">
//                     Dashboard
//                 </h1>
//             </div>

//             <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                     <Button
//                         variant="ghost"
//                         size="icon"
//                         className="rounded-full"
//                     >
//                         <Avatar>
//                             <AvatarImage
//                                 src="https://github.com/shadcn.png"
//                                 alt="@user"
//                             />
//                             <AvatarFallback>
//                                 {auth.user.name.charAt(0)}
//                             </AvatarFallback>
//                         </Avatar>
//                     </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                     <DropdownMenuLabel>My Account</DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem>Profile</DropdownMenuItem>
//                     <DropdownMenuItem>Settings</DropdownMenuItem>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem asChild>
//                         <Link
//                             href={route('logout')}
//                             method="post"
//                             as="button"
//                             className="w-full cursor-pointer text-left"
//                         >
//                             Log out
//                         </Link>
//                     </DropdownMenuItem>
//                 </DropdownMenuContent>
//             </DropdownMenu>
//         </header>
//     );
// }

import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/Components/ui/sheet';
import { useSidebarStore } from '@/Stores/useSidebarStore';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

export default function Header() {
    const { props } = usePage<PageProps>();
    const { auth } = props;

    // Ambil state dan action dari store
    const { isMobileOpen, setMobileOpen, toggleDesktop } = useSidebarStore();

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
            {/* --- 1. HAMBURGER MOBILE (Visible only on Mobile) --- */}
            <div className="md:hidden">
                <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">
                                Toggle navigation menu
                            </span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <Sidebar className="border-none" />
                    </SheetContent>
                </Sheet>
            </div>

            {/* --- 2. HAMBURGER DESKTOP (Visible only on Desktop) --- */}
            <Button
                variant="ghost"
                size="icon"
                className="hidden shrink-0 md:flex"
                onClick={toggleDesktop}
            >
                <Menu className="h-5 w-5" />
            </Button>

            <div className="w-full flex-1">
                <h1 className="text-lg font-semibold text-foreground">
                    Dashboard
                </h1>
            </div>

            {/* User Dropdown (Tetap sama) */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                    >
                        <Avatar>
                            <AvatarImage
                                src="https://github.com/shadcn.png"
                                alt="@user"
                            />
                            <AvatarFallback>
                                {auth.user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full cursor-pointer text-left"
                        >
                            Log out
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
