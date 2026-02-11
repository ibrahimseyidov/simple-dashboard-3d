import { CreateDesignerInput, CreateObjectInput, Designer, SceneObject } from "./types";

const DESIGNERS_KEY = "simple-dashboard-3d:designers";
const OBJECTS_KEY = "simple-dashboard-3d:objects";

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function getLocalStorage(): Storage | null {
  if (typeof window === "undefined" || !window.localStorage) return null;
  return window.localStorage;
}

// Default seed data
const defaultDesigners: Designer[] = [
  { id: "d1", fullName: "Alice Cooper", workingHours: "09:00-17:00" },
  { id: "d2", fullName: "Bob Smith", workingHours: "10:00-18:00" },
  { id: "d3", fullName: "Clara Johnson", workingHours: "08:30-16:30" }
];

export function loadDesigners(): Designer[] {
  const ls = getLocalStorage();
  if (!ls) return [...defaultDesigners];

  const stored = safeParse<Designer[]>(ls.getItem(DESIGNERS_KEY));
  if (!stored || !Array.isArray(stored) || stored.length === 0) {
    ls.setItem(DESIGNERS_KEY, JSON.stringify(defaultDesigners));
    return [...defaultDesigners];
  }
  return stored;
}

export function saveDesigners(designers: Designer[]): void {
  const ls = getLocalStorage();
  if (!ls) return;
  ls.setItem(DESIGNERS_KEY, JSON.stringify(designers));
}

export function loadObjects(): SceneObject[] {
  const ls = getLocalStorage();
  if (!ls) return [];
  const stored = safeParse<SceneObject[]>(ls.getItem(OBJECTS_KEY));
  if (!stored || !Array.isArray(stored)) return [];
  return stored;
}

export function saveObjects(objects: SceneObject[]): void {
  const ls = getLocalStorage();
  if (!ls) return;
  ls.setItem(OBJECTS_KEY, JSON.stringify(objects));
}

function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

export function createDesignerInStorage(input: CreateDesignerInput): Designer {
  const existing = loadDesigners();
  const designer: Designer = { id: generateId("designer"), ...input };
  const updated = [...existing, designer];
  saveDesigners(updated);
  return designer;
}

export function createObjectInStorage(input: CreateObjectInput): SceneObject {
  const existing = loadObjects();
  const object: SceneObject = { id: generateId("obj"), ...input };
  const updated = [...existing, object];
  saveObjects(updated);
  return object;
}

export function updateObjectInStorage(
  id: string,
  patch: Partial<Omit<SceneObject, "id">>
): SceneObject | null {
  const existing = loadObjects();
  const idx = existing.findIndex((o) => o.id === id);
  if (idx === -1) return null;

  const existingObject = existing[idx];
  const updatedObject: SceneObject = { ...existingObject, ...patch };
  const updatedList = [...existing];
  updatedList[idx] = updatedObject;
  saveObjects(updatedList);
  return updatedObject;
}
