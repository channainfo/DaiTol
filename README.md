
# Get Started with Dai Tol

Dai Tol is a lib that encapsulate a sequence of interactions to handle complex business logics in your application.

It is inspired by [Rails Service Object](https://www.google.com/search?q=ruby+service+object) and [Interactor](<https://github.com/collectiveidea/interactor>)

## Why do you need this package?

Everytime I start working on a typescript project, I somehow need a way to implement a Service Object my code to handle complex user interactions. I keep repeating the same thing over and over.This time, when I worked on a side project in the Solana blockchain <https://github.com/channainfo/solapp> I decided to extract this to its own package.

### Easy, consistent and minimal

You just need to extends from the Executor and then define a public instance method ```call``` or ```calAsyc``` if it is an async.

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

### Code discoverability

There are two choices, I've experienced with:

```ts
// The first variant
let registration = new PrimaryStudentRegistrationExecutor()
let execResult = registration.call()

// The second variant
let execResult = PrimaryStudentRegistrationExecutor.call()

```

I found that the variant 2 is more precise, short and easy to discover than the variant 1. Searching **PrimaryStudentRegistrationExecutor.call** in the code is very straght forward.

### Interaction as a building block

This is the part I like the most, for every ***call*** / ***callAsync*** definations are instruction-based and failed-safe, for example imagine  ***PrimaryStudentRegistrationExecutor*** we have to handle 3 instructions:

1. Check if the age of the registrant is valid.
2. Check if the registrant already exists to avoid duplicates registration.
3. Process payment and register. If the registration has enough credit to pay then register.

**if any of the blocks above fails, the execution will stop. When an execution fails, you should provide infos, normally an error message and/or error code.**

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

There are three main methods ( 3 blocks of code ) in the call() method. If any of the method fails, the call() will exited and return an execution result object.

## Usage

```ts
import DaiTol from "dai_tol";

class PrimaryStudentRegistrationExecutor extends DaiTol.Executor {

  public call() {
    this.confirmAgeEligibility()
    this.confirmRegistrationFile()
    this.confirmRegistrationFeePayment()
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

Invocation

```ts
// it is failed to register if age is too young < 6
let options: Map<string, any> = new Map<string, any>([["age", 5]])
let execResult = PrimaryStudentRegistrationExecutor.call(options)

console.log(execResult.isSuccess())    // false
console.log(execResult.errorMessage()) // "Too young"


// it is failed to register if user try to registed again
let options: Map<string, any> = new Map<string, any>([["age", 6], ["firstName", "Joe"], ["lastName", "ann"]])
let execResult = PrimaryStudentRegistrationExecutor.call(options)

console.log(execResult.isSuccess())    // false
console.log(execResult.errorMessage()) // "Already registred"


// it is failed to register if the user does not have enough to pay for the registration fee
let options: Map<string, any> = new Map<string, any>([
  ["age", 9],
  ["firstName", "Enrique"],
  ["lastName", "Ly"],
  ["accountAvailable", 3]
])
let execResult = PrimaryStudentRegistrationExecutor.call(options)

console.log(execResult.isSuccess())    // false
console.log(execResult.errorMessage()) // "Not enough credit"


// it return fullname, registration code and transaction id if input params are valid
let options: Map<string, any> = new Map<string, any>([
  ["age", 9],
  ["firstName", "Enrique"],
  ["lastName", "Ly"],
  ["accountAvailable", 20]
])
let execResult = PrimaryStudentRegistrationExecutor.call(options)

console.log(execResult.isSuccess())             // true
console.log(execResult.get("remainingBalance")) // 15
console.log(execResult.get("transactionId"))    // transactionId
console.log(execResult.get("registrationCode")) // registrationCode

```

- You can see the detail of the Executor class here:  <https://github.com/channainfo/DaiTol/blob/master/src/executor.ts> receives an optional parameter  Map<string,any>
- The Executor.call/callAsync method return a ExecResult <https://github.com/channainfo/DaiTol/blob/master/src/exec_result.ts>

A full example here <https://github.com/channainfo/DaiTol/blob/master/tests/src/executor.test.ts> and another example <https://github.com/channainfo/solapp/blob/main/prompts/keygen.ts>

## Requirement

You might face this error when compiling the ts script:

```js
TypeError: Class constructor cannot be invoked without 'new'

```

The error occurs when the target property in **tsconfig.json** is set to lower than es6. If so, update your tsconfig.json target to:

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
