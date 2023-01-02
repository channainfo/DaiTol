import { ExecResult } from "./exec_result";
import { ExecFailureError } from "./exec_failure_error";
import { ExecParam } from "./exec_param";
import DaiTol from ".";

export class Executor {
  public execResult: ExecResult
  public execParam: ExecParam

  constructor(options?: Map<string, any>) {

    this.execParam = options ? ExecParam.from(options) : new ExecResult()
    this.execResult = new ExecResult()
  }

  public getResult(name: string): any {
    return this.execResult.get(name)
  }

  public getParam(name: string): any {
    return this.execParam.get(name)
  }

  public static async callAsync(options?: Map<string, any>): Promise<ExecResult> {
    let object = options ? new this(options) : new this()

    try {
      await object.callAsync()
      return object.execResult
    }
    catch (ex) {
      return object.handleError(ex);
    }
  }

  public static call(options?: Map<string, any>): ExecResult {
    let object = options ? new this(options) : new this()

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
    throw new DaiTol.ExecFailureError('callAsync need to be implemented')
  }

  // override and set execResult
  public call() {
    throw new DaiTol.ExecFailureError('call need to be implemented')
  }
}