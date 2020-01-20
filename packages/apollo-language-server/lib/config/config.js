"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const vscode_uri_1 = __importDefault(require("vscode-uri"));
const utils_1 = require("./utils");
exports.DefaultEngineStatsWindow = {
  to: -0,
  from: -86400
};
exports.DefaultEngineConfig = {
  endpoint: "https://engine-graphql.apollographql.com/api/graphql",
  frontend: "https://engine.apollographql.com"
};
exports.DefaultConfigBase = {
  includes: ["src/**/*.{ts,tsx,js,jsx,graphql,gql}"],
  excludes: ["**/node_modules", "**/__tests__"]
};
exports.DefaultClientConfig = Object.assign(
  Object.assign({}, exports.DefaultConfigBase),
  {
    tagName: "gql",
    clientOnlyDirectives: ["connection", "type"],
    clientSchemaDirectives: ["client", "rest"],
    addTypename: true,
    statsWindow: exports.DefaultEngineStatsWindow
  }
);
exports.DefaultServiceConfig = Object.assign(
  Object.assign({}, exports.DefaultConfigBase),
  {
    endpoint: {
      url: "http://localhost:4000/graphql"
    }
  }
);
class ApolloConfig {
  constructor(rawConfig, configURI) {
    this.rawConfig = rawConfig;
    this.configURI = configURI;
    this.isService = !!rawConfig.service;
    this.isClient = !!rawConfig.client;
    this.engine = rawConfig.engine;
    this.name = utils_1.getServiceName(rawConfig);
    this.client = rawConfig.client;
    this.service = rawConfig.service;
  }
  get configDirURI() {
    return this.configURI && this.configURI.fsPath.match(/\.(ts|js|json)$/i)
      ? vscode_uri_1.default.parse(path_1.dirname(this.configURI.fsPath))
      : this.configURI;
  }
  get projects() {
    const configs = [];
    const { client, service } = this.rawConfig;
    if (client) configs.push(new ClientConfig(this.rawConfig, this.configURI));
    if (service)
      configs.push(new ServiceConfig(this.rawConfig, this.configURI));
    return configs;
  }
  set tag(tag) {
    this._tag = tag;
  }
  get tag() {
    if (this._tag) return this._tag;
    let tag = "current";
    if (this.client && typeof this.client.service === "string") {
      const specifierTag = utils_1.parseServiceSpecifier(
        this.client.service
      )[1];
      if (specifierTag) tag = specifierTag;
    }
    return tag;
  }
  setDefaults({ client, engine, service }) {
    const config = lodash_merge_1.default(this.rawConfig, {
      client,
      engine,
      service
    });
    this.rawConfig = config;
    this.client = config.client;
    this.service = config.service;
    if (engine) this.engine = config.engine;
  }
}
exports.ApolloConfig = ApolloConfig;
class ClientConfig extends ApolloConfig {}
exports.ClientConfig = ClientConfig;
class ServiceConfig extends ApolloConfig {}
exports.ServiceConfig = ServiceConfig;
//# sourceMappingURL=config.js.map