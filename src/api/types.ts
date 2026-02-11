export interface Designer {
  id: string;
  fullName: string;
  /**
   * Format HH:MM-HH:MM (24-hour)
   * Example: 09:00-17:00
   */
  workingHours: string;
}

export type ObjectSize = "small" | "normal" | "large";

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface SceneObject {
  id: string;
  name: string;
  designerId: string;
  color: string;
  position: Vector3;
  size: ObjectSize;
}

export type CreateDesignerInput = Omit<Designer, "id">;

export type CreateObjectInput = Omit<SceneObject, "id">;

export interface UpdateObjectInput {
  id: string;
  patch: Partial<Omit<SceneObject, "id">>;
}
