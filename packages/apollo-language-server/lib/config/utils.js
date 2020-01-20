"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isClientConfig(config) {
  return config.isClient;
}
exports.isClientConfig = isClientConfig;
function isLocalServiceConfig(config) {
  return !!config.localSchemaFile;
}
exports.isLocalServiceConfig = isLocalServiceConfig;
function isServiceConfig(config) {
  return config.isService;
}
exports.isServiceConfig = isServiceConfig;
function isServiceKey(key) {
  return key && /service:.*:.*/.test(key);
}
exports.isServiceKey = isServiceKey;
function getServiceFromKey(key) {
  if (key) {
    const [type, service] = key.split(":");
    if (type === "service") return service;
  }
  return;
}
exports.getServiceFromKey = getServiceFromKey;
function getServiceName(config) {
  if (config.service) return config.service.name;
  if (config.client) {
    if (typeof config.client.service === "string") {
      return parseServiceSpecifier(config.client.service)[0];
    }
    return config.client.service && config.client.service.name;
  } else {
    return undefined;
  }
}
exports.getServiceName = getServiceName;
function parseServiceSpecifier(specifier) {
  const [id, tag] = specifier.split("@").map(x => x.trim());
  return [id, tag];
}
exports.parseServiceSpecifier = parseServiceSpecifier;
//# sourceMappingURL=utils.js.map
