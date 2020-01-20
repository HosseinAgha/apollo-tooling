"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GraphQLDataSource_1 = require("./GraphQLDataSource");
const config_1 = require("../config");
const checkSchema_1 = require("./operations/checkSchema");
const uploadSchema_1 = require("./operations/uploadSchema");
const validateOperations_1 = require("./operations/validateOperations");
const registerOperations_1 = require("./operations/registerOperations");
const schemaTagsAndFieldStats_1 = require("./operations/schemaTagsAndFieldStats");
const uploadAndComposePartialSchema_1 = require("./operations/uploadAndComposePartialSchema");
const checkPartialSchema_1 = require("./operations/checkPartialSchema");
const removeServiceAndCompose_1 = require("./operations/removeServiceAndCompose");
const listServices_1 = require("./operations/listServices");
function noServiceError(service, endpoint) {
  return `Could not find service ${
    service ? service : ""
  } from Apollo Graph Manager at ${endpoint}. Please check your API key and service name`;
}
exports.noServiceError = noServiceError;
class ApolloEngineClient extends GraphQLDataSource_1.GraphQLDataSource {
  constructor(
    engineKey,
    engineEndpoint = config_1.DefaultEngineConfig.endpoint,
    clientIdentity
  ) {
    super();
    this.engineKey = engineKey;
    this.clientIdentity = clientIdentity;
    this.baseURL = engineEndpoint;
  }
  willSendRequest(request) {
    if (!request.headers) request.headers = {};
    request.headers["x-api-key"] = this.engineKey;
    if (this.clientIdentity && this.clientIdentity.name) {
      request.headers["apollo-client-name"] = this.clientIdentity.name;
      request.headers[
        "apollo-client-reference-id"
      ] = this.clientIdentity.referenceID;
      request.headers["apollo-client-version"] = this.clientIdentity.version;
      return;
    }
    request.headers["apollo-client-name"] = "Apollo Language Server";
    request.headers["apollo-client-reference-id"] =
      "146d29c0-912c-46d3-b686-920e52586be6";
    request.headers[
      "apollo-client-version"
    ] = require("../../package.json").version;
  }
  async listServices(variables) {
    return this.execute({
      query: listServices_1.LIST_SERVICES,
      variables
    }).then(({ data, errors }) => {
      if (errors) {
        throw new Error(errors.map(error => error.message).join("\n"));
      }
      if (data && !data.service) {
        throw new Error(
          noServiceError(
            config_1.getServiceFromKey(this.engineKey),
            this.baseURL
          )
        );
      }
      if (!(data && data.service)) {
        throw new Error("Error in request from Apollo Graph Manager");
      }
      return data.service;
    });
  }
  async checkSchema(variables) {
    return this.execute({
      query: checkSchema_1.CHECK_SCHEMA,
      variables
    }).then(({ data, errors }) => {
      if (errors) {
        throw new Error(errors.map(error => error.message).join("\n"));
      }
      if (data && !data.service) {
        throw new Error(
          noServiceError(
            config_1.getServiceFromKey(this.engineKey),
            this.baseURL
          )
        );
      }
      if (!(data && data.service)) {
        throw new Error("Error in request from Apollo Graph Manager");
      }
      return data.service.checkSchema;
    });
  }
  async uploadSchema(variables) {
    return this.execute({
      query: uploadSchema_1.UPLOAD_SCHEMA,
      variables
    }).then(({ data, errors }) => {
      if (errors) {
        throw new Error(errors.map(error => error.message).join("\n"));
      }
      if (data && !data.service) {
        throw new Error(
          noServiceError(
            config_1.getServiceFromKey(this.engineKey),
            this.baseURL
          )
        );
      }
      if (!(data && data.service)) {
        throw new Error("Error in request from Apollo Graph Manager");
      }
      return data.service.uploadSchema;
    });
  }
  async uploadAndComposePartialSchema(variables) {
    return this.execute({
      query: uploadAndComposePartialSchema_1.UPLOAD_AND_COMPOSE_PARTIAL_SCHEMA,
      variables
    }).then(({ data, errors }) => {
      if (errors) {
        throw new Error(errors.map(error => error.message).join("\n"));
      }
      if (data && !data.service) {
        throw new Error(
          noServiceError(
            config_1.getServiceFromKey(this.engineKey),
            this.baseURL
          )
        );
      }
      if (!(data && data.service)) {
        throw new Error("Error in request from Apollo Graph Manager");
      }
      return data.service.upsertImplementingServiceAndTriggerComposition;
    });
  }
  async checkPartialSchema(variables) {
    return this.execute({
      query: checkPartialSchema_1.CHECK_PARTIAL_SCHEMA,
      variables
    }).then(({ data, errors }) => {
      if (errors) {
        throw new Error(errors.map(error => error.message).join("\n"));
      }
      if (data && !data.service) {
        throw new Error(
          noServiceError(
            config_1.getServiceFromKey(this.engineKey),
            this.baseURL
          )
        );
      }
      if (!(data && data.service)) {
        throw new Error("Error in request from Apollo Graph Manager");
      }
      return data.service.checkPartialSchema;
    });
  }
  async removeServiceAndCompose(variables) {
    return this.execute({
      query: removeServiceAndCompose_1.REMOVE_SERVICE_AND_COMPOSE,
      variables
    }).then(({ data, errors }) => {
      if (errors) {
        throw new Error(errors.map(error => error.message).join("\n"));
      }
      if (!data || !data.service) {
        throw new Error("Error in request from Apollo Graph Manager");
      }
      return data.service.removeImplementingServiceAndTriggerComposition;
    });
  }
  async validateOperations(variables) {
    return this.execute({
      query: validateOperations_1.VALIDATE_OPERATIONS,
      variables
    }).then(({ data, errors }) => {
      if (errors) {
        throw new Error(errors.map(error => error.message).join("\n"));
      }
      if (data && !data.service) {
        throw new Error(
          noServiceError(
            config_1.getServiceFromKey(this.engineKey),
            this.baseURL
          )
        );
      }
      if (!(data && data.service)) {
        throw new Error("Error in request from Apollo Graph Manager");
      }
      return data.service.validateOperations.validationResults;
    });
  }
  async registerOperations(variables) {
    return this.execute({
      query: registerOperations_1.REGISTER_OPERATIONS,
      variables
    }).then(({ data, errors }) => {
      if (errors) {
        throw new Error(errors.map(error => error.message).join("\n"));
      }
      if (data && !data.service) {
        throw new Error(
          noServiceError(
            config_1.getServiceFromKey(this.engineKey),
            this.baseURL
          )
        );
      }
      if (
        !(data && data.service && data.service.registerOperationsWithResponse)
      ) {
        throw new Error("Error in request from Apollo Graph Manager");
      }
      return data.service.registerOperationsWithResponse;
    });
  }
  async loadSchemaTagsAndFieldStats(serviceID) {
    const { data, errors } = await this.execute({
      query: schemaTagsAndFieldStats_1.SCHEMA_TAGS_AND_FIELD_STATS,
      variables: {
        id: serviceID
      }
    });
    if (!(data && data.service) || errors) {
      throw new Error(
        errors
          ? errors.map(error => error.message).join("\n")
          : "No service returned. Make sure your service name and API key match"
      );
    }
    const schemaTags = data.service.schemaTags.map(({ tag }) => tag);
    const fieldStats = new Map();
    data.service.stats.fieldStats.forEach(fieldStat => {
      const [parentType = null, fieldName = null] = fieldStat.groupBy.field
        ? fieldStat.groupBy.field.split(/\.|:/)
        : [];
      if (!parentType || !fieldName) {
        return;
      }
      const fieldsMap =
        fieldStats.get(parentType) ||
        fieldStats.set(parentType, new Map()).get(parentType);
      fieldsMap.set(fieldName, fieldStat.metrics.fieldHistogram.durationMs);
    });
    return { schemaTags, fieldStats };
  }
}
exports.ApolloEngineClient = ApolloEngineClient;
//# sourceMappingURL=index.js.map