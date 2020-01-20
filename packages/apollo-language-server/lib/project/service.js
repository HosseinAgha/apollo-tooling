"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
const fileSet_1 = require("../fileSet");
function isServiceProject(project) {
  return project instanceof GraphQLServiceProject;
}
exports.isServiceProject = isServiceProject;
class GraphQLServiceProject extends base_1.GraphQLProject {
  constructor({ clientIdentity, config, rootURI, loadingHandler }) {
    const fileSet = new fileSet_1.FileSet({
      rootURI: config.configDirURI || rootURI,
      includes: [...config.service.includes, ".env", "apollo.config.js"],
      excludes: config.service.excludes,
      configURI: config.configURI
    });
    super({ config, fileSet, loadingHandler, clientIdentity });
    this.config = config;
  }
  get displayName() {
    return this.config.name || "Unnamed Project";
  }
  initialize() {
    return [];
  }
  validate() {}
  getProjectStats() {
    return { loaded: true, type: "service" };
  }
  resolveFederationInfo() {
    return this.schemaProvider.resolveFederatedServiceSDL();
  }
}
exports.GraphQLServiceProject = GraphQLServiceProject;
//# sourceMappingURL=service.js.map