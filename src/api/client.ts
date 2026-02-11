import {
  CreateDesignerInput,
  CreateObjectInput,
  Designer,
  SceneObject,
  UpdateObjectInput
} from "./types";
import {
  createDesignerInStorage,
  createObjectInStorage,
  loadDesigners,
  loadObjects,
  updateObjectInStorage
} from "./storage";

const ARTIFICIAL_DELAY_MS = 200;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getDesigners(): Promise<Designer[]> {
  await delay(ARTIFICIAL_DELAY_MS);
  return loadDesigners();
}

export async function createDesigner(input: CreateDesignerInput): Promise<Designer> {
  await delay(ARTIFICIAL_DELAY_MS);
  return createDesignerInStorage(input);
}

export async function getObjects(): Promise<SceneObject[]> {
  await delay(ARTIFICIAL_DELAY_MS);
  return loadObjects();
}

export async function createObject(input: CreateObjectInput): Promise<SceneObject> {
  await delay(ARTIFICIAL_DELAY_MS);
  return createObjectInStorage(input);
}

export async function updateObject({ id, patch }: UpdateObjectInput): Promise<SceneObject> {
  await delay(ARTIFICIAL_DELAY_MS);
  const updated = updateObjectInStorage(id, patch);
  if (!updated) {
    throw new Error("Object not found");
  }
  return updated;
}
