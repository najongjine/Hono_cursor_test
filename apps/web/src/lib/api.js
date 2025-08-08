import { useSettings } from '../state/settings';
export async function inferImage(file, modelId) {
    const { apiBaseUrl, modelId: storedModel } = useSettings.getState();
    const fm = new FormData();
    fm.append('image', file);
    fm.append('modelId', modelId ?? storedModel);
    const res = await fetch(`${apiBaseUrl}/v1/infer`, { method: 'POST', body: fm });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Inference failed');
    }
    return (await res.json());
}
