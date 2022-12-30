import { ExecFailureError } from "./exec_failure_error";
import { ExecParam } from "./exec_param";

export class ExecResult extends ExecParam {
  failed: boolean = false

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