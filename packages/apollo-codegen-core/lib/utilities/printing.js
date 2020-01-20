"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
function join(maybeArray, separator) {
  return maybeArray ? maybeArray.filter(x => x).join(separator || "") : "";
}
exports.join = join;
function block(array) {
  return array && array.length !== 0
    ? indent("{\n" + join(array, "\n")) + "\n}"
    : "{}";
}
exports.block = block;
function wrap(start, maybeString, end) {
  return maybeString ? start + maybeString + (end || "") : "";
}
exports.wrap = wrap;
function indent(maybeString) {
  return maybeString && maybeString.replace(/\n/g, "\n  ");
}
exports.indent = indent;
function commentBlockContent(commentString) {
  return (
    "*\n" +
    commentString
      .split("\n")
      .map(line => ` * ${line.replace("*/", "")}`)
      .join("\n") +
    "\n "
  );
}
exports.commentBlockContent = commentBlockContent;
function unifyPaths(uri) {
  return uri.split(path_1.sep).join("/");
}
exports.unifyPaths = unifyPaths;
//# sourceMappingURL=printing.js.map