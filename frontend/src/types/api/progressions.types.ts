// Progressions
export interface ApiProgressionResponse {
  id: number;
  user: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiCreateProgressionRequest {
  title: string;
}
