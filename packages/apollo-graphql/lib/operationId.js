"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_env_1 = require("apollo-env");
const transforms_1 = require("./transforms");
function defaultEngineReportingSignature(ast, operationName) {
  return transforms_1.printWithReducedWhitespace(
    transforms_1.sortAST(
      transforms_1.removeAliases(
        transforms_1.hideLiterals(
          transforms_1.dropUnusedDefinitions(ast, operationName)
        )
      )
    )
  );
}
exports.defaultEngineReportingSignature = defaultEngineReportingSignature;
function defaultOperationRegistrySignature(ast, operationName) {
  return transforms_1.printWithReducedWhitespace(
    transforms_1.sortAST(
      transforms_1.hideStringAndNumericLiterals(
        transforms_1.dropUnusedDefinitions(ast, operationName)
      )
    )
  );
}
exports.defaultOperationRegistrySignature = defaultOperationRegistrySignature;
function operationHash(operation) {
  return apollo_env_1
    .createHash("sha256")
    .update(operation)
    .digest("hex");
}
exports.operationHash = operationHash;
//# sourceMappingURL=operationId.js.map