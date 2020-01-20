"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const cosmiconfig_1 = __importDefault(require("cosmiconfig"));
const cosmiconfig_typescript_loader_1 = __importDefault(
  require("@endemolshinegroup/cosmiconfig-typescript-loader")
);
const path_1 = require("path");
const fs_1 = require("fs");
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const config_1 = require("./config");
const utils_1 = require("./utils");
const vscode_uri_1 = __importDefault(require("vscode-uri"));
const utilities_1 = require("../utilities");
const MODULE_NAME = "apollo";
const defaultFileNames = [
  "package.json",
  `${MODULE_NAME}.config.js`,
  `${MODULE_NAME}.config.ts`
];
const envFileNames = [".env", ".env.local"];
const loaders = {
  ".json": cosmiconfig_1.default.loadJson,
  ".js": cosmiconfig_1.default.loadJs,
  ".ts": {
    async: cosmiconfig_typescript_loader_1.default
  }
};
async function loadConfig({
  configPath,
  configFileName,
  requireConfig = false,
  name,
  type
}) {
  const explorer = cosmiconfig_1.default(MODULE_NAME, {
    searchPlaces: configFileName ? [configFileName] : defaultFileNames,
    loaders
  });
  let loadedConfig;
  try {
    loadedConfig = await explorer.search(configPath);
  } catch (error) {
    return utilities_1.Debug
      .error(`A config file failed to load with options: ${JSON.stringify(
      arguments[0]
    )}.
    The error was: ${error}`);
  }
  if (configPath && !loadedConfig) {
    return utilities_1.Debug.error(
      `A config file failed to load at '${configPath}'. This is likely because this file is empty or malformed. For more information, please refer to: https://bit.ly/2ByILPj`
    );
  }
  if (loadedConfig && loadedConfig.filepath.endsWith("package.json")) {
    utilities_1.Debug.warning(
      'The "apollo" package.json configuration key will no longer be supported in Apollo v3. Please use the apollo.config.js file for Apollo project configuration. For more information, see: https://bit.ly/2ByILPj'
    );
  }
  if (requireConfig && !loadedConfig) {
    return utilities_1.Debug
      .error(`No Apollo config found for project. For more information, please refer to:
      https://bit.ly/2ByILPj`);
  }
  let engineConfig = {},
    apiKey,
    nameFromKey;
  envFileNames.forEach(envFile => {
    const dotEnvPath = configPath
      ? path_1.resolve(configPath, envFile)
      : path_1.resolve(process.cwd(), envFile);
    if (fs_1.existsSync(dotEnvPath) && fs_1.lstatSync(dotEnvPath).isFile()) {
      const env = require("dotenv").parse(fs_1.readFileSync(dotEnvPath));
      if (env["ENGINE_API_KEY"]) {
        apiKey = env["ENGINE_API_KEY"];
      }
    }
  });
  if (apiKey) {
    engineConfig = { engine: { apiKey } };
    nameFromKey = utils_1.getServiceFromKey(apiKey);
  }
  let projectType;
  if (type) projectType = type;
  else if (loadedConfig && loadedConfig.config.client) projectType = "client";
  else if (loadedConfig && loadedConfig.config.service) projectType = "service";
  else
    return utilities_1.Debug.error(
      "Unable to resolve project type. Please add either a client or service config. For more information, please refer to https://bit.ly/2ByILPj"
    );
  let serviceName = name || nameFromKey;
  if (
    projectType === "client" &&
    loadedConfig &&
    loadedConfig.config.client &&
    typeof loadedConfig.config.client.service === "string"
  ) {
    serviceName = loadedConfig.config.client.service;
  }
  if (
    !loadedConfig ||
    serviceName ||
    !(loadedConfig.config.client || loadedConfig.config.service)
  ) {
    loadedConfig = {
      filepath: configPath || process.cwd(),
      config: Object.assign(
        Object.assign({}, loadedConfig && loadedConfig.config),
        projectType === "client"
          ? {
              client: Object.assign(
                Object.assign(
                  Object.assign({}, config_1.DefaultConfigBase),
                  loadedConfig && loadedConfig.config.client
                ),
                { service: serviceName }
              )
            }
          : {
              service: Object.assign(
                Object.assign(
                  Object.assign({}, config_1.DefaultConfigBase),
                  loadedConfig && loadedConfig.config.service
                ),
                { name: serviceName }
              )
            }
      )
    };
  }
  let { config, filepath } = loadedConfig;
  if (config.client)
    config = lodash_merge_1.default(
      { client: config_1.DefaultClientConfig },
      config
    );
  if (config.service)
    config = lodash_merge_1.default(
      { service: config_1.DefaultServiceConfig },
      config
    );
  if (engineConfig) config = lodash_merge_1.default(engineConfig, config);
  config = lodash_merge_1.default(
    { engine: config_1.DefaultEngineConfig },
    config
  );
  return new config_1.ApolloConfig(
    config,
    vscode_uri_1.default.file(path_1.resolve(filepath))
  );
}
exports.loadConfig = loadConfig;
//# sourceMappingURL=loadConfig.js.map