"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const vscode_uri_1 = __importDefault(require("vscode-uri"));
const graphql_1 = require("graphql");
const vscode_languageserver_1 = require("vscode-languageserver");
const document_1 = require("../document");
const schema_1 = require("../providers/schema");
const engine_1 = require("../engine");
const fileAssociations = {
  ".graphql": "graphql",
  ".gql": "graphql",
  ".js": "javascript",
  ".ts": "typescript",
  ".jsx": "javascriptreact",
  ".tsx": "typescriptreact",
  ".vue": "vue",
  ".py": "python",
  ".rb": "ruby",
  ".dart": "dart",
  ".re": "reason"
};
class GraphQLProject {
  constructor({ config, fileSet, loadingHandler, clientIdentity }) {
    this.needsValidation = false;
    this.documentsByFile = new Map();
    this.config = config;
    this.fileSet = fileSet;
    this.loadingHandler = loadingHandler;
    this.schemaProvider = schema_1.schemaProviderFromConfig(
      config,
      clientIdentity
    );
    const { engine } = config;
    if (engine.apiKey) {
      this.engineClient = new engine_1.ApolloEngineClient(
        engine.apiKey,
        engine.endpoint,
        clientIdentity
      );
    }
    this._isReady = false;
    this.readyPromise = Promise.all(this.initialize())
      .then(() => {
        this._isReady = true;
      })
      .catch(error => {
        console.error(error);
        this.loadingHandler.showError(
          `Error initializing Apollo GraphQL project "${this.displayName}": ${error}`
        );
      });
  }
  get isReady() {
    return this._isReady;
  }
  get engine() {
    if (!this.engineClient) {
      throw new Error("Unable to find ENGINE_API_KEY");
    }
    return this.engineClient;
  }
  get whenReady() {
    return this.readyPromise;
  }
  updateConfig(config) {
    this.config = config;
    return this.initialize();
  }
  resolveSchema(config) {
    this.lastLoadDate = +new Date();
    return this.schemaProvider.resolveSchema(config);
  }
  resolveFederatedServiceSDL() {
    return this.schemaProvider.resolveFederatedServiceSDL();
  }
  onSchemaChange(handler) {
    this.lastLoadDate = +new Date();
    return this.schemaProvider.onSchemaChange(handler);
  }
  onDiagnostics(handler) {
    this._onDiagnostics = handler;
  }
  includesFile(uri) {
    return this.fileSet.includesFile(uri);
  }
  async scanAllIncludedFiles() {
    await this.loadingHandler.handle(
      `Loading queries for ${this.displayName}`,
      (async () => {
        for (const filePath of this.fileSet.allFiles()) {
          const uri = vscode_uri_1.default.file(filePath).toString();
          if (this.documentsByFile.has(uri)) continue;
          this.fileDidChange(uri);
        }
      })()
    );
  }
  fileDidChange(uri) {
    const filePath = vscode_uri_1.default.parse(uri).fsPath;
    const extension = path_1.extname(filePath);
    const languageId = fileAssociations[extension];
    if (!languageId) return;
    try {
      const contents = fs_1.readFileSync(filePath, "utf8");
      const document = vscode_languageserver_1.TextDocument.create(
        uri,
        languageId,
        -1,
        contents
      );
      this.documentDidChange(document);
    } catch (error) {
      console.error(error);
    }
  }
  fileWasDeleted(uri) {
    this.removeGraphQLDocumentsFor(uri);
    this.checkForDuplicateOperations();
  }
  documentDidChange(document) {
    const documents = document_1.extractGraphQLDocuments(
      document,
      this.config.client && this.config.client.tagName
    );
    if (documents) {
      this.documentsByFile.set(document.uri, documents);
      this.invalidate();
    } else {
      this.removeGraphQLDocumentsFor(document.uri);
    }
    this.checkForDuplicateOperations();
  }
  checkForDuplicateOperations() {
    const operations = Object.create(null);
    for (const document of this.documents) {
      if (!document.ast) continue;
      for (const definition of document.ast.definitions) {
        if (
          definition.kind === graphql_1.Kind.OPERATION_DEFINITION &&
          definition.name
        ) {
          if (operations[definition.name.value]) {
            throw new Error(
              `️️There are multiple definitions for the ${definition.name.value} operation. All operations in a project must have unique names. If generating types, only the types for the first definition found will be generated.`
            );
          }
          operations[definition.name.value] = definition;
        }
      }
    }
  }
  removeGraphQLDocumentsFor(uri) {
    if (this.documentsByFile.has(uri)) {
      this.documentsByFile.delete(uri);
      if (this._onDiagnostics) {
        this._onDiagnostics({ uri: uri, diagnostics: [] });
      }
      this.invalidate();
    }
  }
  invalidate() {
    if (!this.needsValidation && this.isReady) {
      setTimeout(() => {
        this.validateIfNeeded();
      }, 0);
      this.needsValidation = true;
    }
  }
  validateIfNeeded() {
    if (!this.needsValidation || !this.isReady) return;
    this.validate();
    this.needsValidation = false;
  }
  clearAllDiagnostics() {
    if (!this._onDiagnostics) return;
    for (const uri of this.documentsByFile.keys()) {
      this._onDiagnostics({ uri, diagnostics: [] });
    }
  }
  documentsAt(uri) {
    return this.documentsByFile.get(uri);
  }
  documentAt(uri, position) {
    const queryDocuments = this.documentsByFile.get(uri);
    if (!queryDocuments) return undefined;
    return queryDocuments.find(document => document.containsPosition(position));
  }
  get documents() {
    const documents = [];
    for (const documentsForFile of this.documentsByFile.values()) {
      documents.push(...documentsForFile);
    }
    return documents;
  }
  get definitions() {
    const definitions = [];
    for (const document of this.documents) {
      if (!document.ast) continue;
      definitions.push(...document.ast.definitions);
    }
    return definitions;
  }
  definitionsAt(uri) {
    const documents = this.documentsAt(uri);
    if (!documents) return [];
    const definitions = [];
    for (const document of documents) {
      if (!document.ast) continue;
      definitions.push(...document.ast.definitions);
    }
    return definitions;
  }
  get typeSystemDefinitionsAndExtensions() {
    const definitionsAndExtensions = [];
    for (const document of this.documents) {
      if (!document.ast) continue;
      for (const definition of document.ast.definitions) {
        if (
          graphql_1.isTypeSystemDefinitionNode(definition) ||
          graphql_1.isTypeSystemExtensionNode(definition)
        ) {
          definitionsAndExtensions.push(definition);
        }
      }
    }
    return definitionsAndExtensions;
  }
}
exports.GraphQLProject = GraphQLProject;
//# sourceMappingURL=base.js.map