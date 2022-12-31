import { ExecResult } from "./exec_result";
import { ExecFailureError } from "./exec_failure_error";
import { ExecParam } from "./exec_param";

export class Executor {
  public execResult: ExecResult
  public execParam: ExecParam

  constructor(options: Map<string, any> = new Map<string, any>()) {
    this.execParam = ExecParam.from(options);
    this.execResult = new ExecResult()
  }

  public getResult(name: string): any {
    return this.execResult.get(name)
  }

  public getParam(name: string): any {
    return this.execParam.get(name)
  }

  public static async callAsync(options: Map<string, any> = new Map<string, any>()): Promise<ExecResult> {
    let object = new this(options)

    try {
      await object.callAsync()
      return object.execResult
    }
    catch (ex) {
      return object.handleError(ex);
    }
  }

  public static call(options: Map<string, any> = new Map<string, any>()): ExecResult {
    let object = new this(options)

    try {
      object.call()
      return object.execResult
    }
    catch (ex) {
      return object.handleError(ex);
    }
  }

  public handleError(ex: any): ExecResult {
    let error = ex as Error;
    this.execResult.failByMessage(error.message)
    return this.execResult
  }

  // override and set execResult
  public async callAsync() {

  }

  // override and set execResult
  public call() {

  }
}