import { describe, it, expect } from "@jest/globals";
import DaiTol from '../../src';


describe("ExecParam", () => {

  let describedClass = DaiTol.ExecParam


  describe(".from", () => {
    it("return an ExecParam object", () => {
      let fields: Map<string, any> = new Map<string, any>([
        ["name", "Joe"],
        ["age", 27]
      ])

      let subject = describedClass.from(fields)

      expect(subject.get("name")).toEqual("Joe")
      expect(subject.get("age")).toEqual(27)
    })
  })
})