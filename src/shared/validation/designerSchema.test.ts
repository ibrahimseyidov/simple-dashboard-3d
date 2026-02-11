import { describe, expect, it } from "vitest";
import { designerFormSchema } from "./designerSchema";

describe("designerFormSchema", () => {
  it("accepts valid fullName and workingHours", () => {
    const data = {
      fullName: "John Doe",
      workingHours: "09:00-17:30"
    };

    const parsed = designerFormSchema.parse(data);
    expect(parsed).toEqual(data);
  });

  it("rejects short fullName", () => {
    const data = {
      fullName: "Jo",
      workingHours: "09:00-17:00"
    };

    const result = designerFormSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("rejects invalid workingHours format", () => {
    const badTimes = [
      "9:00-17:00",
      "09:00-5:00",
      "24:00-01:00",
      "09:60-17:00",
      "09:00-17:000",
      "09-17"
    ];

    for (const workingHours of badTimes) {
      const result = designerFormSchema.safeParse({
        fullName: "Valid Name",
        workingHours
      });
      expect(result.success).toBe(false);
    }
  });
});
