"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecResult = void 0;
const exec_failure_error_1 = require("./exec_failure_error");
const exec_param_1 = require("./exec_param");
class ExecResult extends exec_param_1.ExecParam {
    constructor() {
        super(...arguments);
        this.failed = false;
    }
    fail(message) {
        this.failByMessage(message);
        throw new exec_failure_error_1.ExecFailureError(message);
    }
    failByMessage(message) {
        this.set("__message", message);
        this.failed = true;
    }
    errorMessage() {
        if (this.isSuccess())
            return null;
        return this.get("__message");
    }
    isSuccess() {
        return !this.failed;
    }
}
exports.ExecResult = ExecResult;
