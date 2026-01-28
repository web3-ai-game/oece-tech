export type GenerationType = 'image' | 'video' | 'content';

export interface GenerationRequest {
  type: GenerationType;
  prompt?: string;
  description?: string;
  topic?: string;
  wordCount?: number;
  duration?: number;
  userId: string;
  parameters?: Record<string, unknown>;
}

export interface GenerationResult {
  id: string;
  type: GenerationType;
  userId: string;
  prompt: string;
  result: string; // URL for image/video, text for content
  cost: number;
  createdAt: Date;
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
    duration?: number;
    wordCount?: number;
  };
}

export interface GenerationHistory {
  generations: GenerationResult[];
  totalCost: number;
  count: number;
}

export interface GenerationStats {
  totalGenerations: number;
  totalCost: number;
  imageCount: number;
  videoCount: number;
  contentCount: number;
  lastGeneration?: Date;
}
