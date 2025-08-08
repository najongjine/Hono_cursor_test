export type BoundingBox = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export type Prediction = {
    id: string;
    label: string;
    confidence: number;
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
export declare const LOCAL_STORAGE_KEYS: {
    readonly settings: "plant-app:settings";
    readonly history: "plant-app:history";
};
export type HistoryItem = {
    id: string;
    timestamp: number;
    imageDataUrl: string;
    topLabel: string;
    topConfidence: number;
};
export type ClientSettings = {
    apiBaseUrl: string;
    modelId: string;
};
