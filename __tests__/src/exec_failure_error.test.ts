import { describe } from "@jest/globals";
import DaiTol from "../../src";

describe("ExecFailureError", () => {
  let describedClass = DaiTol.ExecFailureError;

  it("is a valid Error object", () => {
    expect(() => { throw new describedClass }).toThrowError(describedClass)
  })

})