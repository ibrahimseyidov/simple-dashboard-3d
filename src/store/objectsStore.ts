import { create } from "zustand";
import { CreateObjectInput, SceneObject } from "../api/types";
import * as api from "../api/client";

interface ObjectsState {
  objects: SceneObject[];
  loading: boolean;
  error?: string;
  selectedObjectId?: string;
  hoveredObjectId?: string;
  fetchObjects: () => Promise<void>;
  createObject: (input: CreateObjectInput) => Promise<void>;
  updateObject: (id: string, patch: Partial<Omit<SceneObject, "id">>) => Promise<void>;
  setSelectedObjectId: (id?: string) => void;
  setHoveredObjectId: (id?: string) => void;
}

export const useObjectsStore = create<ObjectsState>((set, get) => ({
  objects: [],
  loading: false,
  error: undefined,
  selectedObjectId: undefined,
  hoveredObjectId: undefined,

  fetchObjects: async () => {
    if (get().loading) return;
    set({ loading: true, error: undefined });
    try {
      const objects = await api.getObjects();
      set({ objects, loading: false });
    } catch (err) {
      set({ error: (err as Error).message ?? "Failed to fetch objects", loading: false });
    }
  },

  createObject: async (input: CreateObjectInput) => {
    set({ loading: true, error: undefined });
    try {
      const created = await api.createObject(input);
      set((state) => ({
        objects: [...state.objects, created],
        loading: false
      }));
    } catch (err) {
      set({ error: (err as Error).message ?? "Failed to create object", loading: false });
    }
  },

  updateObject: async (id, patch) => {
    set({ loading: true, error: undefined });
    try {
      const updated = await api.updateObject({ id, patch });
      set((state) => ({
        objects: state.objects.map((o) => (o.id === id ? updated : o)),
        loading: false
      }));
    } catch (err) {
      set({ error: (err as Error).message ?? "Failed to update object", loading: false });
    }
  },

  setSelectedObjectId: (id?: string) => set({ selectedObjectId: id }),
  setHoveredObjectId: (id?: string) => set({ hoveredObjectId: id })
}));
