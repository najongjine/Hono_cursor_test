import { InferenceResponse } from '@pkg/shared';
import { useSettings } from '../state/settings';

export async function inferImage(file: File, modelId?: string): Promise<InferenceResponse> {
  const { apiBaseUrl, modelId: storedModel } = useSettings.getState();
  const fm = new FormData();
  fm.append('image', file);
  fm.append('modelId', modelId ?? storedModel);
  const res = await fetch(`${apiBaseUrl}/v1/infer`, { method: 'POST', body: fm });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Inference failed');
  }
  return (await res.json()) as InferenceResponse;
}