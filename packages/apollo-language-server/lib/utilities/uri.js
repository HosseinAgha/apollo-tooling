"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_uri_1 = __importDefault(require("vscode-uri"));
const withUnixSeparator = uriString => uriString.split(/[\/\\]/).join("/");
exports.normalizeURI = uriString => {
  let parsed;
  if (uriString.indexOf("file:///") === 0) {
    parsed = vscode_uri_1.default.file(
      vscode_uri_1.default.parse(uriString).fsPath
    );
  } else if (uriString.match(/^[a-zA-Z]:[\/\\].*/)) {
    parsed = vscode_uri_1.default.file(
      vscode_uri_1.default.parse("file:///" + withUnixSeparator(uriString))
        .fsPath
    );
  } else {
    parsed = vscode_uri_1.default.parse(withUnixSeparator(uriString));
  }
  return withUnixSeparator(parsed.fsPath);
};
//# sourceMappingURL=uri.js.map