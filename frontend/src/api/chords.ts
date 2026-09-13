import { api } from "./client";
import type { ApiSavedChordResponse, ApiCreateSavedChordRequest, ApiProgressionResponse } from "@/types/api";

const savedChordsUrl = "/saved-chords/";
const progressionsUrl = "/progressions/";
const progressionChordsUrl = "/progression-chords/"

export const chordApi = {
  // Saved chords

  // Get all saved chords for the current user
  getAllSavedChords: async (): Promise<ApiSavedChordResponse[]> => {
    const response = await api.get<ApiSavedChordResponse[]>(savedChordsUrl);
    return response.data;
  },

  saveChord: async (input: ApiCreateSavedChordRequest): Promise<ApiSavedChordResponse> => {
    const response = await api.post<ApiSavedChordResponse>(savedChordsUrl, input);
    return response.data;
  },

  // Progressions

  // Get all progressions for the current user
  getProgressions: async (): Promise<ApiProgressionResponse[]> => {
    const response = await api.get<ApiProgressionResponse[]>(progressionsUrl);
    return response.data;
  },

  // Progression chords
  
  // Get all chords for a specific progression
  getProgressionChords: async (progressionId: number) => {
    const response = await api.get(`${progressionChordsUrl}?progression_id=${progressionId}`);
    return response.data;
  },
}