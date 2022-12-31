import { ExecResult } from "./exec_result";
import { ExecParam } from "./exec_param";
export declare class Executor {
    execResult: ExecResult;
    execParam: ExecParam;
    constructor(options?: Map<string, any>);
    getResult(name: string): any;
    getParam(name: string): any;
    static callAsync(options?: Map<string, any>): Promise<ExecResult>;
    static call(options?: Map<string, any>): ExecResult;
    handleError(ex: any): ExecResult;
    callAsync(): Promise<void>;
    call(): void;
}
