"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const glob_1 = __importDefault(require("glob"));
const apollo_tools_1 = require("@apollographql/apollo-tools");
const utilities_1 = require("./utilities");
class FileSet {
  constructor({ rootURI, includes, excludes, configURI }) {
    apollo_tools_1.invariant(rootURI, `Must provide "rootURI".`);
    apollo_tools_1.invariant(includes, `Must provide "includes".`);
    apollo_tools_1.invariant(excludes, `Must provide "excludes".`);
    this.rootURI = rootURI;
    this.includes = includes;
    this.excludes = excludes;
  }
  includesFile(filePath) {
    return this.allFiles().includes(utilities_1.normalizeURI(filePath));
  }
  allFiles() {
    const joinedIncludes = `{${this.includes.join(",")}}`;
    return glob_1.default
      .sync(joinedIncludes, {
        cwd: this.rootURI.fsPath,
        absolute: true,
        ignore: this.excludes
      })
      .map(utilities_1.normalizeURI);
  }
}
exports.FileSet = FileSet;
//# sourceMappingURL=fileSet.js.map