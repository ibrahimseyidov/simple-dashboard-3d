import { z } from "zod";

export const workingHoursRegex =
  /^(?:[01]\d|2[0-3]):[0-5]\d-(?:[01]\d|2[0-3]):[0-5]\d$/;

export const designerFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .min(3, "Full name must be at least 3 characters"),
  workingHours: z
    .string()
    .trim()
    .min(1, "Working hours is required")
    .regex(workingHoursRegex, "Working hours must be in format HH:MM-HH:MM")
});

export type DesignerFormValues = z.infer<typeof designerFormSchema>;
