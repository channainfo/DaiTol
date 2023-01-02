
import { describe } from "@jest/globals";
import DaiTol from "../../src";

describe("Executor", () => {
  let describedClass = DaiTol.Executor

  describe("constructor", () => {
    it("accept default options", () => {
      let subject = new describedClass()

      expect(subject.execResult).toBeInstanceOf(DaiTol.ExecResult)
    })

    it("accept options", () => {
      let accountOptions: Map<string, any> = new Map<string, any>(
        [
          ["name", "Joe ann"],
          ["age", 27]
        ]
      )

      let subject = new DaiTol.Executor(accountOptions)

      expect(subject.getParam("name")).toEqual("Joe ann")
      expect(subject.getParam("age")).toEqual(27)
    })
  })

  describe("#getParam", () => {
    it("return value from exec result if key exists", () => {
      let accountOptions: Map<string, any> = new Map<string, any>(
        [
          ["name", "Joe ann"],
        ]
      )

      let subject = new DaiTol.Executor(accountOptions)

      let result = subject.getParam("name")
      expect(result).toEqual(result)
    })

    it("return undefined if key does not exist", () => {
      let accountOptions: Map<string, any> = new Map<string, any>(
        [
          ["name", "Joe ann"],
        ]
      )

      let subject = new DaiTol.Executor(accountOptions)
      let result = subject.getParam("non_available")

      expect(result).toEqual(undefined)
    })
  })

  describe("#getResult", () => {

    it("return value from execResult by name", () => {
      let subject = new describedClass()
      let execResult = new DaiTol.ExecResult();

      execResult.set("name", "Joe")
      subject.execResult = execResult;

      let result = subject.getResult("name")
      expect(result).toEqual("Joe")
    })

    it("return result from execResult", () => {
      let subject = new describedClass()
      let result = subject.getResult("name")
      expect(result).toBeUndefined()
    })
  })

  describe('#handleError', () => {
    let subject = new describedClass()

    it("return set exec result failed and set error message", () => {
      let errorMessage = "Error set from executor"
      let error = new DaiTol.ExecFailureError(errorMessage)

      let execResult = subject.handleError(error)

      expect(execResult.isSuccess()).toEqual(false)
      expect(execResult.errorMessage()).toEqual(errorMessage)
    })
  })

  describe(".call", () => {
    it("accept default options", () => {
      let execResult = describedClass.call()
      expect(execResult).toBeInstanceOf(DaiTol.ExecResult)
    })

    it("require call to be implemented", () => {
      let execResult = describedClass.call()

      expect(execResult.errorMessage()).toEqual('call need to be implemented')
      expect(execResult.isSuccess()).toEqual(false)
    })

    it("execute the call and return exec result", () => {
      jest.spyOn(describedClass.prototype, 'call').mockImplementation(() => { });

      let options = new Map<string, any>()
      let execResult = describedClass.call(options)

      expect(execResult).toBeInstanceOf(DaiTol.ExecResult)
      expect(execResult.isSuccess()).toEqual(true)

      jest.restoreAllMocks();
    })
  })

  describe('#call', () => {
    it("throw an ExecFailureError", () => {
      let subject = new describedClass()
      expect(() => { subject.call() }).toThrowError(DaiTol.ExecFailureError)
    })
  })

  describe(".callAsyn", () => {
    it("accept default options", async () => {
      let execResult = await describedClass.callAsync()
      expect(execResult).toBeInstanceOf(DaiTol.ExecResult)
    })

    it("require callAsync to be implemented", async () => {
      let execResult = await describedClass.callAsync()

      expect(execResult.isSuccess()).toEqual(false)
      expect(execResult.errorMessage()).toEqual('callAsync need to be implemented')
    })

    it("execute the call and return exec result", async () => {
      jest.spyOn(describedClass.prototype, 'callAsync').mockImplementation(async () => { jest.fn().mockResolvedValue('') });

      let options = new Map<string, any>()
      let execResult = await describedClass.callAsync(options)

      expect(execResult).toBeInstanceOf(DaiTol.ExecResult)
      expect(execResult.isSuccess()).toEqual(true)

      jest.restoreAllMocks();
    })
  })

  describe('#callAsync', () => {
    it("throw an ExecFailureError", async () => {
      let subject = new describedClass()
      expect(subject.callAsync()).rejects.toThrowError(DaiTol.ExecFailureError)
    })
  })

  describe("ExecutorSample", () => {
    let transactionId = "pay-random"
    let registrationCode = "calculated-code"

    class PrimaryStudentRegistrationSample extends DaiTol.Executor {

      public call() {
        this.confirmAgeEligibility()
        this.confirmRegistrationFile()
        this.confirmRegistrationFeePayment()
      }

      public async callAsync() {
        this.execResult.set("someResult", true)
      }

      private confirmAgeEligibility() {
        let age = this.getParam("age")

        if (age < 6.0) {
          this.execResult.fail('Too young')
        }
      }

      private confirmRegistrationFile() {
        let firstName = this.getParam("firstName")
        let lastName = this.getParam("lastName")
        let fullName = [firstName, lastName].join(" ")

        let existingRecords = ["Joe ann", "Dom mony"]
        this.execResult.set("fullName", fullName)

        let found = existingRecords.indexOf(fullName)

        if (found != -1) {
          this.execResult.fail("Already registred")
        }
      }

      private registrationFee() {
        let age = this.getParam("age") as number
        if (age == 6.0)
          return 0.0

        if (age < 9)
          return 3.0

        if (age < 15)
          return 5.0

        return 8
      }

      private confirmRegistrationFeePayment() {
        let available = this.getParam("accountAvailable") as number
        let fee = this.registrationFee()

        if (available < fee)
          this.execResult.fail("Not enough credit")

        this.execResult.set("remainingBalance", available - fee)
        this.execResult.set("transactionId", transactionId)
        this.execResult.set("registrationCode", registrationCode)
      }

    }

    let describedClass = PrimaryStudentRegistrationSample;

    describe('.call', () => {
      describe("with invalid input", () => {
        it("is failed to register if age is too young < 6", () => {
          let options: Map<string, any> = new Map<string, any>([["age", 5]])
          let execResult = describedClass.call(options)

          expect(execResult.isSuccess()).toEqual(false)
          expect(execResult.errorMessage()).toEqual("Too young")
        })

        it("is failed to register if user try to registed again", () => {
          let options: Map<string, any> = new Map<string, any>([["age", 6], ["firstName", "Joe"], ["lastName", "ann"]])
          let execResult = describedClass.call(options)

          expect(execResult.isSuccess()).toEqual(false)
          expect(execResult.errorMessage()).toEqual("Already registred")
        })

        it("is failed to register if the user does not have enough to pay for the registration fee", () => {
          let options: Map<string, any> = new Map<string, any>([
            ["age", 9],
            ["firstName", "Enrique"],
            ["lastName", "Ly"],
            ["accountAvailable", 3]
          ])
          let execResult = describedClass.call(options)

          expect(execResult.isSuccess()).toEqual(false)
          expect(execResult.errorMessage()).toEqual("Not enough credit")
        })
      })
    })

    describe("with valid user input", () => {
      it("return fullname, registration code and transaction id if ", () => {
        let options: Map<string, any> = new Map<string, any>([
          ["age", 9],
          ["firstName", "Enrique"],
          ["lastName", "Ly"],
          ["accountAvailable", 20]
        ])
        let execResult = describedClass.call(options)

        expect(execResult.isSuccess()).toEqual(true)
        expect(execResult.get("remainingBalance")).toEqual(15)
        expect(execResult.get("transactionId")).toEqual(transactionId)
        expect(execResult.get("registrationCode")).toEqual(registrationCode)
      })
    })
  })
})
