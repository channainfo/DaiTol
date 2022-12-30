import { describe, it, expect } from "@jest/globals";
import DaiTol from '../../src';


describe("ExecResult", () => {

  let describedClass = DaiTol.ExecResult

  describe("constructor", () => {
    it("set attributes correctly", () => {
      let subject = new describedClass()
      expect(subject.failed).toEqual(false)
    })
  })

  describe(".from", () => {
    it("return an ExecResult object", () => {
      let fields: Map<string, any> = new Map<string, any>([
        ["name", "Joe"],
        ["age", 27]
      ])

      let subject = describedClass.from(fields)

      expect(subject.get("name")).toEqual("Joe")
      expect(subject.get("age")).toEqual(27)
    })
  })

  describe("#isSuccess", () => {
    let subject = new describedClass()

    it("return true if failed is false", () => {
      subject.failed = false
      expect(subject.isSuccess()).toEqual(true)
    })

    it("return false if failed is true", () => {
      subject.failed = true
      expect(subject.isSuccess()).toEqual(false)
    })
  })

  describe("#failByMessage", () => {
    it("set 1: result -> failure and error message", () => {
      let subject = new describedClass()
      let message = "Network unreachable"
      subject.failByMessage(message)

      expect(subject.isSuccess()).toEqual(false)
      expect(subject.errorMessage()).toEqual(message)
    })
  })

  describe("#fail", () => {
    it("set 1: result -> failure and error message", () => {
      let subject = new describedClass()
      let message = "Network unreachable"

      expect(() => { subject.fail(message) }).toThrowError(DaiTol.ExecFailureError)
      expect(subject.isSuccess()).toEqual(false)
      expect(subject.errorMessage()).toEqual(message)
    })
  })

  describe("#errorMessage", () => {
    it("return error message if it failed", () => {
      let subject = new describedClass()
      let message = "Network unreachable"
      subject.failByMessage(message)

      expect(subject.errorMessage()).toEqual(message)
    })

    it("return null if it success", () => {
      let subject = new describedClass()

      expect(subject.errorMessage()).toEqual(null)
    })
  })
})