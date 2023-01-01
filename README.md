# Get Started with Dai Tol

Very light weight and simple Single responsability for a nodejs project.

## Why do you need this package?

Everytime I start working in a typescript project, I some how need a way to implement single responsability in my code. I keep being repeated over and over so this time when I work on a side project in Solana blockchain <https://github.com:channainfo/solapp> I decide to extract this to its own package.

The goal of this packages:

- Making single responsability easy, consistent and minimal.
- Code discoverability
- Instruction as a building block

### Making single responsability easy, consistent and minimal

You just need to extends from the Executor and then define a public instance method ```call``` or ```calAsyc``` if your single responability is an async.

```ts
class PrimaryStudentRegistrationExecutor extends DaiTol.Executor {

  public call() {
    // implementation logic here
  }

}

// invocation
PrimaryStudentRegistrationExecutor.call()
```

```ts
class PrimaryStudentRegistrationExecutor extends DaiTol.Executor {

  // if it is an async
  public async callAsync() {
     // implementation logic here
  }
}

// invocation
PrimaryStudentRegistrationExecutor.callAsync().then((execResult)=> {

})
```

### Easy discoverability

There are two choices, I've experienced with:

```ts
// The first variant
let registration = new PrimaryStudentRegistrationExecutor()
let execResult = registration.call()

// The second variant
let execResult = PrimaryStudentRegistrationExecutor.call()

```

I found that the variant 2 is more precise, short and easy to discove than the variant 1. Searching **PrimaryStudentRegistrationExecutor.call** in the code is very straigh forward.

### Building block

This is the part I like the most, for every ***call*** / ***callAsync*** definations are instruction-based and failed-safe, for example imagine  ***PrimaryStudentRegistrationExecutor*** we have to handle 3 instructions:

- 1. Check if the age of the registrant is valid. If the age is valid go to the next instruction. If not break the execution and return an error with a error message.
- 2. Check if the registrant already exists to avoid duplicates registration. If the registrant does not exist in in the file, proceed to the next instruction otherwise stop the execution and return execution error with an error message.
- 3. Process payment and register. If the registration has enough credit to pay then register, otherwise return an execution error with an error message.

The implementation might look like this:

```sh
class PrimaryStudentRegistrationExecutor extends DaiTol.Executor  {
  public call() {
    this.confirmAgeEligibility()
    this.confirmRegistrationFile()
    this.confirmRegistrationFeePayment()
  }
}
```

There are three main methods ( 3 blocks of code ) in the call() method. If it failed safe and no condition needed to be added in the call() method.

## Usage

```ts
import DaiTol from "dai_tol";

class PrimaryStudentRegistrationExecutor extends DaiTol.Executor {

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
```

The test:

```ts
describe("PrimaryStudentRegistrationExecutor", () => {
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

```

- A Executor <https://github.com/channainfo/DaiTol/blob/master/src/executor.ts> receives an optional parameter  Map<string,any>
- The Executor.call/callAsync method return a ExecResult <https://github.com/channainfo/DaiTol/blob/master/src/exec_result.ts>

A full example here <https://github.com/channainfo/DaiTol/blob/master/>**tests**/src/executor.test.ts
Another example <https://github.com/channainfo/solapp/blob/main/prompts/keygen.ts>

## Requirement

You might face this error when compiling the ts script:

```js
TypeError: Class constructor cannot be invoked without 'new'

```

The error occurs when the target property in **tsconfig.json** is set to lower than es6 or you instantiate a class without the new operator.

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es2016",
  }
}

```

## Contributions

Any PR is more than welcome!

### Init package development

```sh
  npm init
  yarn add -D typescript
  yarn tsc --init

  npm adduser

  # make sure to build the ts first
  npm run build

  # publish the build to npm repo
  npm publish

  # bump a new version
  npm version patch
```
