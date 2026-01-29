// import { create } from 'zustand';

// interface SidebarState {
//     isOpen: boolean;
//     toggleOpen: () => void;
//     setOpen: (open: boolean) => void;
// }

// export const useSidebarStore = create<SidebarState>((set) => ({
//     isOpen: false,
//     toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
//     setOpen: (open) => set({ isOpen: open }),
// }));

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SidebarState {
    isMobileOpen: boolean;
    setMobileOpen: (open: boolean) => void;

    isDesktopOpen: boolean;
    toggleDesktop: () => void;
}

export const useSidebarStore = create<SidebarState>()(
    persist(
        // (Opsional) Gunakan persist agar state 'ingat' posisi terakhir saat refresh
        (set) => ({
            // State untuk Mobile (Sheet)
            isMobileOpen: false,
            setMobileOpen: (open) => set({ isMobileOpen: open }),

            // State untuk Desktop (Collapsible), default true
            isDesktopOpen: true,
            toggleDesktop: () =>
                set((state) => ({ isDesktopOpen: !state.isDesktopOpen })),
        }),
        {
            name: 'sidebar-storage', // nama key di localStorage
            storage: createJSONStorage(() => localStorage), // simpan di localStorage
            partialize: (state) => ({ isDesktopOpen: state.isDesktopOpen }), // Cuma simpan state desktop
        },
    ),
);
