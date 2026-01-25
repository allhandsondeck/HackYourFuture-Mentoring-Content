import { describe, it, expect } from "vitest";
import { logAllProducts } from "./productCatalog.js";

describe("logAllProducts", () => {
  it("returns all product listings in order", () => {
    const result = logAllProducts();
    expect(result).toEqual([
      "LAPTOP - $1078.92",
      "MOUSE - $27.00",
      "KEYBOARD - $81.00",
    ]);
  });
});
