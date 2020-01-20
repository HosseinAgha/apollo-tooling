"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
  };
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const t = __importStar(require("@babel/types"));
const common_tags_1 = require("common-tags");
const typeCase_1 = require("apollo-codegen-core/lib/compiler/visitors/typeCase");
const collectAndMergeFields_1 = require("apollo-codegen-core/lib/compiler/visitors/collectAndMergeFields");
const language_1 = __importDefault(require("./language"));
const printer_1 = __importDefault(require("./printer"));
const helpers_1 = require("./helpers");
const definition_1 = require("graphql/type/definition");
const graphql_1 = require("graphql");
const array_1 = require("apollo-codegen-core/lib/utilities/array");
const printing_1 = require("apollo-codegen-core/lib/utilities/printing");
class TypescriptGeneratedFile {
  constructor(fileContents) {
    this.fileContents = fileContents;
  }
  get output() {
    return this.fileContents;
  }
}
function printEnumsAndInputObjects(generator, typesUsed) {
  generator.printer.enqueue(common_tags_1.stripIndent`
    //==============================================================
    // START Enums and Input Objects
    //==============================================================
  `);
  typesUsed
    .filter(definition_1.isEnumType)
    .sort()
    .forEach(enumType => {
      generator.typeAliasForEnumType(enumType);
    });
  typesUsed
    .filter(definition_1.isInputObjectType)
    .sort()
    .forEach(inputObjectType => {
      generator.typeAliasForInputObjectType(inputObjectType);
    });
  generator.printer.enqueue(common_tags_1.stripIndent`
    //==============================================================
    // END Enums and Input Objects
    //==============================================================
  `);
}
function printGlobalImport(
  generator,
  typesUsed,
  outputPath,
  tsFileExtension,
  globalSourcePath
) {
  if (typesUsed.length > 0) {
    const relative = path_1.default.relative(
      path_1.default.dirname(outputPath),
      path_1.default.join(
        path_1.default.dirname(globalSourcePath),
        path_1.default.basename(globalSourcePath, `.${tsFileExtension}`)
      )
    );
    generator.printer.enqueue(
      generator.import(typesUsed, "./" + printing_1.unifyPaths(relative))
    );
  }
}
function generateSource(context) {
  const generator = new TypescriptAPIGenerator(context);
  const generatedFiles = [];
  Object.values(context.operations).forEach(operation => {
    generator.fileHeader();
    generator.interfacesForOperation(operation);
    const output = generator.printer.printAndClear();
    generatedFiles.push({
      sourcePath: operation.filePath,
      fileName: `${operation.operationName}.${context.options.tsFileExtension ||
        helpers_1.DEFAULT_FILE_EXTENSION}`,
      content: new TypescriptGeneratedFile(output)
    });
  });
  Object.values(context.fragments).forEach(fragment => {
    generator.fileHeader();
    generator.interfacesForFragment(fragment);
    const output = generator.printer.printAndClear();
    generatedFiles.push({
      sourcePath: fragment.filePath,
      fileName: `${fragment.fragmentName}.ts`,
      content: new TypescriptGeneratedFile(output)
    });
  });
  generator.fileHeader();
  printEnumsAndInputObjects(generator, context.typesUsed);
  const common = generator.printer.printAndClear();
  return {
    generatedFiles,
    common
  };
}
exports.generateSource = generateSource;
function generateLocalSource(context) {
  const generator = new TypescriptAPIGenerator(context);
  const operations = Object.values(context.operations).map(operation => ({
    sourcePath: operation.filePath,
    fileName: `${operation.operationName}.${context.options.tsFileExtension ||
      helpers_1.DEFAULT_FILE_EXTENSION}`,
    content: options => {
      generator.fileHeader();
      if (options && options.outputPath && options.globalSourcePath) {
        printGlobalImport(
          generator,
          generator.getGlobalTypesUsedForOperation(operation),
          options.outputPath,
          context.options.tsFileExtension || helpers_1.DEFAULT_FILE_EXTENSION,
          options.globalSourcePath
        );
      }
      generator.interfacesForOperation(operation);
      const output = generator.printer.printAndClear();
      return new TypescriptGeneratedFile(output);
    }
  }));
  const fragments = Object.values(context.fragments).map(fragment => ({
    sourcePath: fragment.filePath,
    fileName: `${fragment.fragmentName}.${context.options.tsFileExtension ||
      helpers_1.DEFAULT_FILE_EXTENSION}`,
    content: options => {
      generator.fileHeader();
      if (options && options.outputPath && options.globalSourcePath) {
        printGlobalImport(
          generator,
          generator.getGlobalTypesUsedForFragment(fragment),
          options.outputPath,
          context.options.tsFileExtension || helpers_1.DEFAULT_FILE_EXTENSION,
          options.globalSourcePath
        );
      }
      generator.interfacesForFragment(fragment);
      const output = generator.printer.printAndClear();
      return new TypescriptGeneratedFile(output);
    }
  }));
  return operations.concat(fragments);
}
exports.generateLocalSource = generateLocalSource;
function generateGlobalSource(context) {
  const generator = new TypescriptAPIGenerator(context);
  generator.fileHeader();
  printEnumsAndInputObjects(generator, context.typesUsed);
  const output = generator.printer.printAndClear();
  return new TypescriptGeneratedFile(output);
}
exports.generateGlobalSource = generateGlobalSource;
class TypescriptAPIGenerator extends language_1.default {
  constructor(context) {
    super(context.options);
    this.getGlobalTypesUsedForOperation = doc => {
      const typesUsed = doc.variables.reduce((acc, { type }) => {
        const t = this.getUnderlyingType(type);
        if (this.isGlobalType(t)) {
          return array_1.maybePush(acc, t);
        }
        return acc;
      }, []);
      return doc.selectionSet.selections.reduce(
        this.reduceSelection,
        typesUsed
      );
    };
    this.getGlobalTypesUsedForFragment = doc => {
      return doc.selectionSet.selections.reduce(this.reduceSelection, []);
    };
    this.reduceSelection = (acc, selection) => {
      if (selection.kind === "Field" || selection.kind === "TypeCondition") {
        const type = this.getUnderlyingType(selection.type);
        if (this.isGlobalType(type)) {
          acc = array_1.maybePush(acc, type);
        }
      }
      if (selection.selectionSet) {
        return selection.selectionSet.selections.reduce(
          this.reduceSelection,
          acc
        );
      }
      return acc;
    };
    this.isGlobalType = type => {
      return (
        definition_1.isEnumType(type) || definition_1.isInputObjectType(type)
      );
    };
    this.getUnderlyingType = type => {
      if (definition_1.isNonNullType(type)) {
        return this.getUnderlyingType(graphql_1.getNullableType(type));
      }
      if (definition_1.isListType(type)) {
        return this.getUnderlyingType(type.ofType);
      }
      return type;
    };
    this.reduceTypesUsed = (acc, type) => {
      if (definition_1.isNonNullType(type)) {
        type = graphql_1.getNullableType(type);
      }
      if (definition_1.isListType(type)) {
        type = type.ofType;
      }
      if (
        definition_1.isInputObjectType(type) ||
        definition_1.isObjectType(type)
      ) {
        acc = array_1.maybePush(acc, type);
        const fields = type.getFields();
        acc = Object.keys(fields)
          .map(key => fields[key] && fields[key].type)
          .reduce(this.reduceTypesUsed, acc);
      } else {
        acc = array_1.maybePush(acc, type);
      }
      return acc;
    };
    this.context = context;
    this.printer = new printer_1.default();
    this.scopeStack = [];
  }
  fileHeader() {
    this.printer.enqueue(common_tags_1.stripIndent`
        /* tslint:disable */
        /* eslint-disable */
        // This file was automatically generated and should not be edited.
      `);
  }
  typeAliasForEnumType(enumType) {
    this.printer.enqueue(this.enumerationDeclaration(enumType));
  }
  typeAliasForInputObjectType(inputObjectType) {
    this.printer.enqueue(this.inputObjectDeclaration(inputObjectType));
  }
  interfacesForOperation(operation) {
    const { operationType, operationName, variables, selectionSet } = operation;
    this.scopeStackPush(operationName);
    this.printer.enqueue(common_tags_1.stripIndent`
      // ====================================================
      // GraphQL ${operationType} operation: ${operationName}
      // ====================================================
    `);
    const variants = this.getVariantsForSelectionSet(selectionSet);
    const variant = variants[0];
    const properties = this.getPropertiesForVariant(variant);
    const exportedTypeAlias = this.exportDeclaration(
      this.interface(operationName, properties)
    );
    this.printer.enqueue(exportedTypeAlias);
    this.scopeStackPop();
    if (variables.length > 0) {
      const interfaceName = operationName + "Variables";
      this.scopeStackPush(interfaceName);
      this.printer.enqueue(
        this.exportDeclaration(
          this.interface(
            interfaceName,
            variables.map(variable => ({
              name: variable.name,
              type: this.typeFromGraphQLType(variable.type)
            })),
            { keyInheritsNullability: true }
          )
        )
      );
      this.scopeStackPop();
    }
  }
  interfacesForFragment(fragment) {
    const { fragmentName, selectionSet } = fragment;
    this.scopeStackPush(fragmentName);
    this.printer.enqueue(common_tags_1.stripIndent`
      // ====================================================
      // GraphQL fragment: ${fragmentName}
      // ====================================================
    `);
    const variants = this.getVariantsForSelectionSet(selectionSet);
    if (variants.length === 1) {
      const properties = this.getPropertiesForVariant(variants[0]);
      const name = this.nameFromScopeStack(this.scopeStack);
      const exportedTypeAlias = this.exportDeclaration(
        this.interface(name, properties)
      );
      this.printer.enqueue(exportedTypeAlias);
    } else {
      const unionMembers = [];
      variants.forEach(variant => {
        this.scopeStackPush(variant.possibleTypes[0].toString());
        const properties = this.getPropertiesForVariant(variant);
        const name = this.nameFromScopeStack(this.scopeStack);
        const exportedTypeAlias = this.exportDeclaration(
          this.interface(name, properties)
        );
        this.printer.enqueue(exportedTypeAlias);
        unionMembers.push(
          t.identifier(this.nameFromScopeStack(this.scopeStack))
        );
        this.scopeStackPop();
      });
      this.printer.enqueue(
        this.exportDeclaration(
          this.typeAliasGenericUnion(
            this.nameFromScopeStack(this.scopeStack),
            unionMembers.map(id => t.TSTypeReference(id))
          )
        )
      );
    }
    this.scopeStackPop();
  }
  getTypesUsedForOperation(doc, context) {
    let docTypesUsed = [];
    if (doc.hasOwnProperty("operationName")) {
      const operation = doc;
      docTypesUsed = operation.variables.map(({ type }) => type);
    }
    const reduceTypesForDocument = (nestDoc, acc) => {
      const {
        selectionSet: { possibleTypes, selections }
      } = nestDoc;
      acc = possibleTypes.reduce(array_1.maybePush, acc);
      acc = selections.reduce((selectionAcc, selection) => {
        switch (selection.kind) {
          case "Field":
          case "TypeCondition":
            selectionAcc = array_1.maybePush(selectionAcc, selection.type);
            break;
          case "FragmentSpread":
            selectionAcc = reduceTypesForDocument(selection, selectionAcc);
            break;
          default:
            break;
        }
        return selectionAcc;
      }, acc);
      return acc;
    };
    docTypesUsed = reduceTypesForDocument(doc, docTypesUsed).reduce(
      this.reduceTypesUsed,
      []
    );
    return context.typesUsed.filter(type => {
      return docTypesUsed.find(typeUsed => type === typeUsed);
    });
  }
  getVariantsForSelectionSet(selectionSet) {
    return this.getTypeCasesForSelectionSet(selectionSet).exhaustiveVariants;
  }
  getTypeCasesForSelectionSet(selectionSet) {
    return typeCase_1.typeCaseForSelectionSet(
      selectionSet,
      this.context.options.mergeInFieldsFromFragmentSpreads
    );
  }
  getPropertiesForVariant(variant) {
    const fields = collectAndMergeFields_1.collectAndMergeFields(
      variant,
      this.context.options.mergeInFieldsFromFragmentSpreads
    );
    return fields.map(field => {
      const fieldName = field.alias !== undefined ? field.alias : field.name;
      this.scopeStackPush(fieldName);
      let res;
      if (field.selectionSet) {
        res = this.handleFieldSelectionSetValue(
          t.identifier(this.nameFromScopeStack(this.scopeStack)),
          field
        );
      } else {
        res = this.handleFieldValue(field, variant);
      }
      this.scopeStackPop();
      return res;
    });
  }
  handleFieldSelectionSetValue(generatedIdentifier, field) {
    const { selectionSet } = field;
    const type = this.typeFromGraphQLType(field.type, generatedIdentifier.name);
    const typeCase = this.getTypeCasesForSelectionSet(selectionSet);
    const variants = typeCase.exhaustiveVariants;
    let exportedTypeAlias;
    if (variants.length === 1) {
      const variant = variants[0];
      const properties = this.getPropertiesForVariant(variant);
      exportedTypeAlias = this.exportDeclaration(
        this.interface(this.nameFromScopeStack(this.scopeStack), properties)
      );
    } else {
      const identifiers = variants.map(variant => {
        this.scopeStackPush(variant.possibleTypes[0].toString());
        const properties = this.getPropertiesForVariant(variant);
        const identifierName = this.nameFromScopeStack(this.scopeStack);
        this.printer.enqueue(
          this.exportDeclaration(this.interface(identifierName, properties))
        );
        this.scopeStackPop();
        return t.identifier(identifierName);
      });
      exportedTypeAlias = this.exportDeclaration(
        this.typeAliasGenericUnion(
          generatedIdentifier.name,
          identifiers.map(i => t.TSTypeReference(i))
        )
      );
    }
    this.printer.enqueue(exportedTypeAlias);
    return {
      name: field.alias ? field.alias : field.name,
      description: field.description,
      type
    };
  }
  handleFieldValue(field, variant) {
    let res;
    if (field.name === "__typename") {
      const types = variant.possibleTypes.map(type => {
        return t.TSLiteralType(t.stringLiteral(type.toString()));
      });
      res = {
        name: field.alias ? field.alias : field.name,
        description: field.description,
        type: t.TSUnionType(types)
      };
    } else {
      res = {
        name: field.alias ? field.alias : field.name,
        description: field.description,
        type: this.typeFromGraphQLType(field.type)
      };
    }
    return res;
  }
  get output() {
    return this.printer.print();
  }
  scopeStackPush(name) {
    this.scopeStack.push(name);
  }
  scopeStackPop() {
    const popped = this.scopeStack.pop();
    return popped;
  }
}
exports.TypescriptAPIGenerator = TypescriptAPIGenerator;
//# sourceMappingURL=codeGeneration.js.map