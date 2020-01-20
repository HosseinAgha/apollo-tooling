"use strict";
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
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const t = __importStar(require("@babel/types"));
const common_tags_1 = require("common-tags");
const graphql_1 = require("graphql");
const typeCase_1 = require("apollo-codegen-core/lib/compiler/visitors/typeCase");
const collectAndMergeFields_1 = require("apollo-codegen-core/lib/compiler/visitors/collectAndMergeFields");
const language_1 = __importDefault(require("./language"));
const printer_1 = __importDefault(require("./printer"));
class FlowGeneratedFile {
  constructor(fileContents) {
    this.fileContents = fileContents;
  }
  get output() {
    return this.fileContents;
  }
}
function printEnumsAndInputObjects(generator, context) {
  generator.printer.enqueue(common_tags_1.stripIndent`
    //==============================================================
    // START Enums and Input Objects
    //==============================================================
  `);
  context.typesUsed.filter(graphql_1.isEnumType).forEach(enumType => {
    generator.typeAliasForEnumType(enumType);
  });
  context.typesUsed
    .filter(graphql_1.isInputObjectType)
    .forEach(inputObjectType => {
      generator.typeAliasForInputObjectType(inputObjectType);
    });
  generator.printer.enqueue(common_tags_1.stripIndent`
    //==============================================================
    // END Enums and Input Objects
    //==============================================================
  `);
}
function generateSource(context) {
  const generator = new FlowAPIGenerator(context);
  const generatedFiles = [];
  Object.values(context.operations).forEach(operation => {
    generator.fileHeader();
    generator.typeAliasesForOperation(operation);
    const output = generator.printer.printAndClear();
    generatedFiles.push({
      sourcePath: operation.filePath,
      fileName: `${operation.operationName}.js`,
      content: new FlowGeneratedFile(output)
    });
  });
  Object.values(context.fragments).forEach(fragment => {
    generator.fileHeader();
    generator.typeAliasesForFragment(fragment);
    const output = generator.printer.printAndClear();
    generatedFiles.push({
      sourcePath: fragment.filePath,
      fileName: `${fragment.fragmentName}.js`,
      content: new FlowGeneratedFile(output)
    });
  });
  generator.fileHeader();
  printEnumsAndInputObjects(generator, context);
  const common = generator.printer.printAndClear();
  return {
    generatedFiles,
    common
  };
}
exports.generateSource = generateSource;
class FlowAPIGenerator extends language_1.default {
  constructor(context) {
    super(context.options);
    this.context = context;
    this.printer = new printer_1.default();
    this.scopeStack = [];
  }
  fileHeader() {
    this.printer.enqueue(common_tags_1.stripIndent`
        /* @flow */
        /* eslint-disable */
        // This file was automatically generated and should not be edited.
      `);
  }
  typeAliasForEnumType(enumType) {
    this.printer.enqueue(this.enumerationDeclaration(enumType));
  }
  typeAliasForInputObjectType(inputObjectType) {
    const typeAlias = this.inputObjectDeclaration(inputObjectType);
    const { description } = inputObjectType;
    const exportDeclarationOptions = description
      ? { comments: ` ${description.replace("\n", " ")}` }
      : {};
    const exportedTypeAlias = this.exportDeclaration(
      typeAlias,
      exportDeclarationOptions
    );
    this.printer.enqueue(exportedTypeAlias);
  }
  typeAliasesForOperation(operation) {
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
      this.typeAliasObject(operationName, properties)
    );
    this.printer.enqueue(exportedTypeAlias);
    this.scopeStackPop();
    if (variables.length > 0) {
      const interfaceName = operationName + "Variables";
      this.scopeStackPush(interfaceName);
      this.printer.enqueue(
        this.exportDeclaration(
          this.typeAliasObject(
            interfaceName,
            variables.map(variable => ({
              name: variable.name,
              annotation: this.typeAnnotationFromGraphQLType(variable.type)
            })),
            { keyInheritsNullability: true }
          )
        )
      );
      this.scopeStackPop();
    }
  }
  typeAliasesForFragment(fragment) {
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
      const name = this.annotationFromScopeStack(this.scopeStack).id.name;
      const exportedTypeAlias = this.exportDeclaration(
        this.typeAliasObject(name, properties)
      );
      this.printer.enqueue(exportedTypeAlias);
    } else {
      const unionMembers = [];
      variants.forEach(variant => {
        this.scopeStackPush(variant.possibleTypes[0].toString());
        const properties = this.getPropertiesForVariant(variant);
        const name = this.annotationFromScopeStack(this.scopeStack).id.name;
        const exportedTypeAlias = this.exportDeclaration(
          this.typeAliasObject(name, properties)
        );
        this.printer.enqueue(exportedTypeAlias);
        unionMembers.push(this.annotationFromScopeStack(this.scopeStack));
        this.scopeStackPop();
      });
      this.printer.enqueue(
        this.exportDeclaration(
          this.typeAliasGenericUnion(
            this.annotationFromScopeStack(this.scopeStack).id.name,
            unionMembers
          )
        )
      );
    }
    this.scopeStackPop();
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
        const generatedTypeName = this.annotationFromScopeStack(
          this.scopeStack
        );
        res = this.handleFieldSelectionSetValue(generatedTypeName, field);
      } else {
        res = this.handleFieldValue(field, variant);
      }
      this.scopeStackPop();
      return res;
    });
  }
  handleFieldSelectionSetValue(generatedTypeName, field) {
    const { selectionSet } = field;
    const annotation = this.typeAnnotationFromGraphQLType(
      field.type,
      generatedTypeName.id.name
    );
    const typeCase = this.getTypeCasesForSelectionSet(selectionSet);
    const variants = typeCase.exhaustiveVariants;
    let exportedTypeAlias;
    if (variants.length === 1) {
      const variant = variants[0];
      const properties = this.getPropertiesForVariant(variant);
      exportedTypeAlias = this.exportDeclaration(
        this.typeAliasObject(
          this.annotationFromScopeStack(this.scopeStack).id.name,
          properties
        )
      );
    } else {
      const propertySets = variants.map(variant => {
        this.scopeStackPush(variant.possibleTypes[0].toString());
        const properties = this.getPropertiesForVariant(variant);
        this.scopeStackPop();
        return properties;
      });
      exportedTypeAlias = this.exportDeclaration(
        this.typeAliasObjectUnion(generatedTypeName.id.name, propertySets)
      );
    }
    this.printer.enqueue(exportedTypeAlias);
    return {
      name: field.alias ? field.alias : field.name,
      description: field.description,
      annotation: annotation
    };
  }
  handleFieldValue(field, variant) {
    let res;
    if (field.name === "__typename") {
      const annotations = variant.possibleTypes.map(type => {
        const annotation = t.stringLiteralTypeAnnotation(type.toString());
        return annotation;
      });
      res = {
        name: field.alias ? field.alias : field.name,
        description: field.description,
        annotation: t.unionTypeAnnotation(annotations)
      };
    } else {
      res = {
        name: field.alias ? field.alias : field.name,
        description: field.description,
        annotation: this.typeAnnotationFromGraphQLType(field.type)
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
exports.FlowAPIGenerator = FlowAPIGenerator;
//# sourceMappingURL=codeGeneration.js.map