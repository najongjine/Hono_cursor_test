import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ClientSettings, LOCAL_STORAGE_KEYS, ServerExposeConfig } from '@pkg/shared';

const defaultBaseUrl = typeof window !== 'undefined' ? `${window.location.origin.replace(/\/$/, '')}/api` : 'http://localhost:8787';

type SettingsState = ClientSettings & {
  mockMode?: boolean;
  set: (s: Partial<ClientSettings>) => void;
  loadFromServer: (baseUrl?: string) => Promise<void>;
};

export const useSettings = create<SettingsState>()(
  persist(
    (set, get) => ({
      apiBaseUrl: defaultBaseUrl,
      modelId: 'plant-diseases/1',
      set: (s) => set({ ...get(), ...s }),
      loadFromServer: async (baseUrl) => {
        const api = baseUrl ?? get().apiBaseUrl;
        try {
          const res = await fetch(`${api}/v1/config/expose`);
          if (!res.ok) return;
          const data = (await res.json()) as ServerExposeConfig;
          set({ modelId: data.defaultModelId, mockMode: data.mockMode });
        } catch {}
      },
    }),
    { name: LOCAL_STORAGE_KEYS.settings },
  ),
);