import { ExecFailureError } from "./exec_failure_error";

export class ExecResult extends Map<string, any> {
  failed: boolean = false

  public static from(options: Map<string, any>): ExecResult {
    let execResult = new this()

    options.forEach((value: any, key: string) => {
      execResult.set(key, value);
    })

    return execResult;
  }

  public fail(message: string) {
    this.failByMessage(message)
    throw new ExecFailureError(message)
  }

  public failByMessage(message: string) {
    this.set("__message", message);
    this.failed = true
  }

  public errorMessage(): string | null {
    if (this.isSuccess())
      return null;

    return this.get("__message")
  }

  public isSuccess() {
    return !this.failed
  }
}