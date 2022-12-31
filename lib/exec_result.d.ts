import { ExecParam } from "./exec_param";
export declare class ExecResult extends ExecParam {
    failed: boolean;
    fail(message: string): void;
    failByMessage(message: string): void;
    errorMessage(): string | null;
    isSuccess(): boolean;
}
