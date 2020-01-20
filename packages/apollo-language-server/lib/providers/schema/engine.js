"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const graphql_1 = require("graphql");
const engine_1 = require("../../engine");
const config_1 = require("../../config");
const utils_1 = require("../../config/utils");
const utilities_1 = require("../../utilities");
class EngineSchemaProvider {
  constructor(config, clientIdentity) {
    this.config = config;
    this.clientIdentity = clientIdentity;
  }
  async resolveSchema(override) {
    if (this.schema && (!override || !override.force)) return this.schema;
    const { engine, client } = this.config;
    if (typeof client.service !== "string") {
      throw new Error(
        `Service name not found for client, found ${client.service}`
      );
    }
    if (!this.client) {
      if (!engine.apiKey) {
        throw new Error("ENGINE_API_KEY not found");
      }
      this.client = new engine_1.ApolloEngineClient(
        engine.apiKey,
        engine.endpoint,
        this.clientIdentity
      );
    }
    const [id, tag = "current"] = config_1.parseServiceSpecifier(
      client.service
    );
    if (utils_1.isServiceKey(engine.apiKey)) {
      const keyServiceName = utils_1.getServiceFromKey(engine.apiKey);
      if (id !== keyServiceName) {
        throw new Error(
          `API key service name \`${keyServiceName}\` does not match the service name in your config \`${id}\`. Try changing the service name in your config to \`${keyServiceName}\` or get a new key.`
        );
      }
    }
    const { data, errors } = await this.client.execute({
      query: exports.SCHEMA_QUERY,
      variables: {
        id,
        tag: override && override.tag ? override.tag : tag
      }
    });
    if (errors) {
      throw new Error(errors.map(({ message }) => message).join("\n"));
    }
    if (!(data && data.service && data.service.__typename === "Service")) {
      throw new Error(
        `Unable to get schema from Apollo Graph Manager for graph ${id}`
      );
    }
    this.schema = graphql_1.buildClientSchema(data.service.schema);
    return this.schema;
  }
  onSchemaChange(_handler) {
    throw new Error("Polling of Apollo Graph Manager not implemented yet");
    return () => {};
  }
  async resolveFederatedServiceSDL() {
    utilities_1.Debug.error(
      "Cannot resolve a federated service's SDL from Apollo Graph Manager. Use an endpoint or a file instead"
    );
    return;
  }
}
exports.EngineSchemaProvider = EngineSchemaProvider;
exports.SCHEMA_QUERY = graphql_tag_1.default`
  query GetSchemaByTag($tag: String!, $id: ID!) {
    service(id: $id) {
      ... on Service {
        __typename
        schema(tag: $tag) {
          hash
          __schema: introspection {
            queryType {
              name
            }
            mutationType {
              name
            }
            subscriptionType {
              name
            }
            types(filter: { includeBuiltInTypes: true }) {
              ...IntrospectionFullType
            }
            directives {
              name
              description
              locations
              args {
                ...IntrospectionInputValue
              }
            }
          }
        }
      }
    }
  }

  fragment IntrospectionFullType on IntrospectionType {
    kind
    name
    description
    fields {
      name
      description
      args {
        ...IntrospectionInputValue
      }
      type {
        ...IntrospectionTypeRef
      }
      isDeprecated
      deprecationReason
    }
    inputFields {
      ...IntrospectionInputValue
    }
    interfaces {
      ...IntrospectionTypeRef
    }
    enumValues(includeDeprecated: true) {
      name
      description
      isDeprecated
      deprecationReason
    }
    possibleTypes {
      ...IntrospectionTypeRef
    }
  }

  fragment IntrospectionInputValue on IntrospectionInputValue {
    name
    description
    type {
      ...IntrospectionTypeRef
    }
    defaultValue
  }

  fragment IntrospectionTypeRef on IntrospectionType {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;
//# sourceMappingURL=engine.js.map
