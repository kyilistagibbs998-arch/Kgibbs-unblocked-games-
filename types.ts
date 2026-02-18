
export interface EditHistoryItem {
  id: string;
  originalUrl: string;
  editedUrl: string;
  prompt: string;
  timestamp: number;
}

export interface ImageState {
  currentUrl: string | null;
  originalUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export enum FilterPreset {
  RETRO = "Add a retro 90s vintage film filter",
  SKETCH = "Turn this into a detailed pencil sketch",
  CYBERPUNK = "Add a cyberpunk neon aesthetic with blue and pink lights",
  REPAINT = "Re-paint this in the style of Van Gogh",
  HDR = "Make the colors pop with high dynamic range and vivid lighting",
  REMOVE_BG = "Remove the background and replace it with a clean minimalist studio gray",
  ANIME = "Transform this into a high-quality studio ghibli anime style illustration"
}
