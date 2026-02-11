import { create } from "zustand";
import { CreateDesignerInput, Designer } from "../api/types";
import * as api from "../api/client";

interface DesignersState {
  designers: Designer[];
  loading: boolean;
  error?: string;
  selectedDesignerId?: string;
  fetchDesigners: () => Promise<void>;
  createDesigner: (input: CreateDesignerInput) => Promise<void>;
  setSelectedDesignerId: (id?: string) => void;
}

export const useDesignersStore = create<DesignersState>((set, get) => ({
  designers: [],
  loading: false,
  error: undefined,
  selectedDesignerId: undefined,

  fetchDesigners: async () => {
    if (get().loading) return;
    set({ loading: true, error: undefined });
    try {
      const designers = await api.getDesigners();
      set({ designers, loading: false });
    } catch (err) {
      set({ error: (err as Error).message ?? "Failed to fetch designers", loading: false });
    }
  },

  createDesigner: async (input: CreateDesignerInput) => {
    set({ loading: true, error: undefined });
    try {
      const created = await api.createDesigner(input);
      set((state) => ({
        designers: [...state.designers, created],
        loading: false
      }));
    } catch (err) {
      set({ error: (err as Error).message ?? "Failed to create designer", loading: false });
    }
  },

  setSelectedDesignerId: (id?: string) => {
    set({ selectedDesignerId: id });
  }
}));
