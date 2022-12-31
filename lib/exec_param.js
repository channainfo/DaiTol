"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecParam = void 0;
class ExecParam extends Map {
    static from(options) {
        let execResult = new this();
        options.forEach((value, key) => {
            execResult.set(key, value);
        });
        return execResult;
    }
}
exports.ExecParam = ExecParam;
