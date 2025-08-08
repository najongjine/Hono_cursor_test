import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LOCAL_STORAGE_KEYS } from '@pkg/shared';
const defaultBaseUrl = typeof window !== 'undefined' ? `${window.location.origin.replace(/\/$/, '')}/api` : 'http://localhost:8787';
export const useSettings = create()(persist((set, get) => ({
    apiBaseUrl: defaultBaseUrl,
    modelId: 'plant-diseases/1',
    set: (s) => set({ ...get(), ...s }),
    loadFromServer: async (baseUrl) => {
        const api = baseUrl ?? get().apiBaseUrl;
        try {
            const res = await fetch(`${api}/v1/config/expose`);
            if (!res.ok)
                return;
            const data = (await res.json());
            set({ modelId: data.defaultModelId, mockMode: data.mockMode });
        }
        catch { }
    },
}), { name: LOCAL_STORAGE_KEYS.settings }));
