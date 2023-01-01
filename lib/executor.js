"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Executor = void 0;
const exec_result_1 = require("./exec_result");
const exec_param_1 = require("./exec_param");
class Executor {
    constructor(options) {
        this.execParam = options ? exec_param_1.ExecParam.from(options) : new exec_result_1.ExecResult();
        this.execResult = new exec_result_1.ExecResult();
    }
    getResult(name) {
        return this.execResult.get(name);
    }
    getParam(name) {
        return this.execParam.get(name);
    }
    static callAsync(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let object = options ? new this(options) : new this();
            try {
                yield object.callAsync();
                return object.execResult;
            }
            catch (ex) {
                return object.handleError(ex);
            }
        });
    }
    static call(options) {
        let object = options ? new this(options) : new this();
        try {
            object.call();
            return object.execResult;
        }
        catch (ex) {
            return object.handleError(ex);
        }
    }
    handleError(ex) {
        let error = ex;
        this.execResult.failByMessage(error.message);
        return this.execResult;
    }
    // override and set execResult
    callAsync() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    // override and set execResult
    call() {
    }
}
exports.Executor = Executor;
