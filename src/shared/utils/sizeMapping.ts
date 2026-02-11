import { ObjectSize } from "../../api/types";

export function sizeToScale(size: ObjectSize): number {
  switch (size) {
    case "small":
      return 0.5;
    case "large":
      return 1.5;
    case "normal":
    default:
      return 1;
  }
}
