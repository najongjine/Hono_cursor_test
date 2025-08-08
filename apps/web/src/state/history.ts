import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HistoryItem, LOCAL_STORAGE_KEYS } from '@pkg/shared';

type HistoryState = {
  items: HistoryItem[];
  add: (item: HistoryItem) => void;
  clear: () => void;
};

export const useHistory = create<HistoryState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        const next = [item, ...get().items].slice(0, 20);
        set({ items: next });
      },
      clear: () => set({ items: [] }),
    }),
    { name: LOCAL_STORAGE_KEYS.history },
  ),
);