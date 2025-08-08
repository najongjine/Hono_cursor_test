export type BoundingBox = {
  x: number; // center x
  y: number; // center y
  width: number;
  height: number;
};

export type Prediction = {
  id: string;
  label: string;
  confidence: number; // 0..1
  box: BoundingBox;
};

export type InferenceResponse = {
  modelId: string;
  timeMs: number;
  image: {
    width: number;
    height: number;
  };
  predictions: Prediction[];
  provider: "roboflow" | "mock";
};

export type ApiError = {
  error: string;
};

export type ServerExposeConfig = {
  defaultModelId: string;
  mockMode: boolean;
};

export const LOCAL_STORAGE_KEYS = {
  settings: "plant-app:settings",
  history: "plant-app:history",
} as const;

export type HistoryItem = {
  id: string;
  timestamp: number;
  imageDataUrl: string; // small thumbnail
  topLabel: string;
  topConfidence: number; // 0..1
};

export type ClientSettings = {
  apiBaseUrl: string;
  modelId: string;
};