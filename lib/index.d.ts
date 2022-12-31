import { ExecParam } from './exec_param';
import { Executor } from './executor';
import { ExecResult } from "./exec_result";
import { ExecFailureError } from "./exec_failure_error";
declare const DaiTol: {
    ExecParam: typeof ExecParam;
    ExecResult: typeof ExecResult;
    ExecFailureError: typeof ExecFailureError;
    Executor: typeof Executor;
};
export default DaiTol;
