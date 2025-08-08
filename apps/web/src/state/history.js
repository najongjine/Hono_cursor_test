import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LOCAL_STORAGE_KEYS } from '@pkg/shared';
export const useHistory = create()(persist((set, get) => ({
    items: [],
    add: (item) => {
        const next = [item, ...get().items].slice(0, 20);
        set({ items: next });
    },
    clear: () => set({ items: [] }),
}), { name: LOCAL_STORAGE_KEYS.history }));
