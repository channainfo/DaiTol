import { ExecFailureError } from "./exec_failure_error";

export class ExecParam extends Map<string, any> {
  public static from(options: Map<string, any>): ExecParam {
    let execResult = new this()

    options.forEach((value: any, key: string) => {
      execResult.set(key, value);
    })

    return execResult;
  }

}