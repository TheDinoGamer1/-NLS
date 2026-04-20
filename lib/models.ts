export const SUPPORTED_MODELS = ["gpt-4.1-mini", "gpt-4.1"] as const;
export type SupportedModel = (typeof SUPPORTED_MODELS)[number];

export const MODEL_LABELS: Record<SupportedModel, string> = {
  "gpt-4.1-mini": "Fast",
  "gpt-4.1": "Premium",
};
