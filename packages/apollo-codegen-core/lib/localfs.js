"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fs = require("fs");
function withGlobalFS(thunk) {
  return thunk();
}
exports.withGlobalFS = withGlobalFS;
//# sourceMappingURL=localfs.js.map
