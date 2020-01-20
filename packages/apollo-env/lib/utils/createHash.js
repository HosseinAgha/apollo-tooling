"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isNodeLike_1 = require("./isNodeLike");
function createHash(kind) {
  if (isNodeLike_1.isNodeLike) {
    return module.require("crypto").createHash(kind);
  }
  return require("sha.js")(kind);
}
exports.createHash = createHash;
//# sourceMappingURL=createHash.js.map