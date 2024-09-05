import { expect, describe, it } from "vitest";
import register from "../register.js";

describe("register", () => {
  it("should be an Map", () => {
    expect(register).toBeInstanceOf(Map);
  });
});
