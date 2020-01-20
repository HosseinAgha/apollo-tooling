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
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const change_case_1 = require("change-case");
const Inflector = __importStar(require("inflected"));
const printing_1 = require("apollo-codegen-core/lib/utilities/printing");
const language_1 = require("./language");
const graphql_2 = require("apollo-codegen-core/lib/utilities/graphql");
const collectAndMergeFields_1 = require("apollo-codegen-core/lib/compiler/visitors/collectAndMergeFields");
const builtInScalarMap = {
  [graphql_1.GraphQLString.name]: "String",
  [graphql_1.GraphQLInt.name]: "Int",
  [graphql_1.GraphQLFloat.name]: "Double",
  [graphql_1.GraphQLBoolean.name]: "Bool",
  [graphql_1.GraphQLID.name]: "GraphQLID"
};
class Helpers {
  constructor(options) {
    this.options = options;
  }
  typeNameFromGraphQLType(type, unmodifiedTypeName, isOptional) {
    if (graphql_1.isNonNullType(type)) {
      return this.typeNameFromGraphQLType(
        type.ofType,
        unmodifiedTypeName,
        false
      );
    } else if (isOptional === undefined) {
      isOptional = true;
    }
    let typeName;
    if (graphql_1.isListType(type)) {
      typeName =
        "[" +
        this.typeNameFromGraphQLType(type.ofType, unmodifiedTypeName) +
        "]";
    } else if (graphql_1.isScalarType(type)) {
      typeName = this.typeNameForScalarType(type);
    } else {
      typeName = unmodifiedTypeName || type.name;
    }
    return isOptional ? typeName + "?" : typeName;
  }
  typeNameForScalarType(type) {
    return (
      builtInScalarMap[type.name] ||
      (this.options.passthroughCustomScalars
        ? this.options.customScalarsPrefix + type.name
        : graphql_1.GraphQLString.name)
    );
  }
  fieldTypeEnum(type, structName) {
    if (graphql_1.isNonNullType(type)) {
      return language_1.swift`.nonNull(${this.fieldTypeEnum(
        type.ofType,
        structName
      )})`;
    } else if (graphql_1.isListType(type)) {
      return language_1.swift`.list(${this.fieldTypeEnum(
        type.ofType,
        structName
      )})`;
    } else if (graphql_1.isScalarType(type)) {
      return language_1.swift`.scalar(${this.typeNameForScalarType(
        type
      )}.self)`;
    } else if (graphql_1.isEnumType(type)) {
      return language_1.swift`.scalar(${type.name}.self)`;
    } else if (graphql_1.isCompositeType(type)) {
      return language_1.swift`.object(${structName}.selections)`;
    } else {
      throw new Error(`Unknown field type: ${type}`);
    }
  }
  enumCaseName(name) {
    return camelCase(name);
  }
  enumDotCaseName(name) {
    return language_1.swift`.${language_1.SwiftSource.memberName(
      camelCase(name)
    )}`;
  }
  operationClassName(name) {
    return pascalCase(name);
  }
  structNameForPropertyName(propertyName) {
    return pascalCase(Inflector.singularize(propertyName));
  }
  structNameForFragmentName(fragmentName) {
    return pascalCase(fragmentName);
  }
  structNameForVariant(variant) {
    return (
      "As" + variant.possibleTypes.map(type => pascalCase(type.name)).join("Or")
    );
  }
  internalParameterName(propertyName, properties) {
    return language_1.SwiftSource.isValidParameterName(propertyName)
      ? propertyName
      : makeUniqueName(`_${propertyName}`, properties);
  }
  propertyFromField(field, namespace) {
    const { responseKey, isConditional } = field;
    const propertyName = graphql_2.isMetaFieldName(responseKey)
      ? responseKey
      : camelCase(responseKey);
    const structName = printing_1.join(
      [namespace, this.structNameForPropertyName(responseKey)],
      "."
    );
    let type = field.type;
    if (isConditional && graphql_1.isNonNullType(type)) {
      type = type.ofType;
    }
    const isOptional = !graphql_1.isNonNullType(type);
    const unmodifiedType = graphql_1.getNamedType(field.type);
    const unmodifiedTypeName = graphql_1.isCompositeType(unmodifiedType)
      ? structName
      : unmodifiedType.name;
    const typeName = this.typeNameFromGraphQLType(type, unmodifiedTypeName);
    return Object.assign({}, field, {
      responseKey,
      propertyName,
      typeName,
      structName,
      isOptional
    });
  }
  propertyFromVariant(variant) {
    const structName = this.structNameForVariant(variant);
    return Object.assign(variant, {
      propertyName: camelCase(structName),
      typeName: structName + "?",
      structName
    });
  }
  propertyFromFragmentSpread(fragmentSpread, isConditional) {
    const structName = this.structNameForFragmentName(
      fragmentSpread.fragmentName
    );
    return Object.assign({}, fragmentSpread, {
      propertyName: camelCase(fragmentSpread.fragmentName),
      typeName: isConditional ? structName + "?" : structName,
      structName,
      isConditional
    });
  }
  propertyFromInputField(field) {
    return Object.assign({}, field, {
      propertyName: camelCase(field.name),
      typeName: this.typeNameFromGraphQLType(field.type),
      isOptional: !graphql_1.isNonNullType(field.type)
    });
  }
  propertiesForSelectionSet(selectionSet, namespace) {
    const properties = collectAndMergeFields_1
      .collectAndMergeFields(selectionSet, true)
      .filter(field => field.name !== "__typename")
      .map(field => this.propertyFromField(field, namespace));
    if (
      selectionSet.selections.some(
        selection => selection.kind === "FragmentSpread"
      ) &&
      properties.some(property =>
        graphql_1.isCompositeType(graphql_1.getNamedType(property.type))
      )
    ) {
      return undefined;
    }
    return properties;
  }
  dictionaryLiteralForFieldArguments(args) {
    function expressionFromValue(value) {
      if (value === null) {
        return language_1.swift`nil`;
      } else if (value.kind === "Variable") {
        return language_1.swift`GraphQLVariable(${language_1.SwiftSource.string(
          value.variableName
        )})`;
      } else if (Array.isArray(value)) {
        return (
          language_1.SwiftSource.wrap(
            language_1.swift`[`,
            language_1.SwiftSource.join(value.map(expressionFromValue), ", "),
            language_1.swift`]`
          ) || language_1.swift`[]`
        );
      } else if (typeof value === "object") {
        return (
          language_1.SwiftSource.wrap(
            language_1.swift`[`,
            language_1.SwiftSource.join(
              Object.entries(value).map(([key, value]) => {
                return language_1.swift`${language_1.SwiftSource.string(
                  key
                )}: ${expressionFromValue(value)}`;
              }),
              ", "
            ),
            language_1.swift`]`
          ) || language_1.swift`[:]`
        );
      } else if (typeof value === "string") {
        return language_1.SwiftSource.string(value);
      } else {
        return new language_1.SwiftSource(JSON.stringify(value));
      }
    }
    return (
      language_1.SwiftSource.wrap(
        language_1.swift`[`,
        language_1.SwiftSource.join(
          args.map(arg => {
            return language_1.swift`${language_1.SwiftSource.string(
              arg.name
            )}: ${expressionFromValue(arg.value)}`;
          }),
          ", "
        ),
        language_1.swift`]`
      ) || language_1.swift`[:]`
    );
  }
  mapExpressionForType(
    type,
    isConditional = false,
    makeExpression,
    expression,
    inputTypeName,
    outputTypeName
  ) {
    let isOptional;
    if (graphql_1.isNonNullType(type)) {
      isOptional = !!isConditional;
      type = type.ofType;
    } else {
      isOptional = true;
    }
    if (graphql_1.isListType(type)) {
      const elementType = type.ofType;
      if (isOptional) {
        return language_1.swift`${expression}.flatMap { ${makeClosureSignature(
          this.typeNameFromGraphQLType(type, inputTypeName, false),
          this.typeNameFromGraphQLType(type, outputTypeName, false)
        )} value.map { ${makeClosureSignature(
          this.typeNameFromGraphQLType(elementType, inputTypeName),
          this.typeNameFromGraphQLType(elementType, outputTypeName)
        )} ${this.mapExpressionForType(
          elementType,
          undefined,
          makeExpression,
          language_1.swift`value`,
          inputTypeName,
          outputTypeName
        )} } }`;
      } else {
        return language_1.swift`${expression}.map { ${makeClosureSignature(
          this.typeNameFromGraphQLType(elementType, inputTypeName),
          this.typeNameFromGraphQLType(elementType, outputTypeName)
        )} ${this.mapExpressionForType(
          elementType,
          undefined,
          makeExpression,
          language_1.swift`value`,
          inputTypeName,
          outputTypeName
        )} }`;
      }
    } else if (isOptional) {
      return language_1.swift`${expression}.flatMap { ${makeClosureSignature(
        this.typeNameFromGraphQLType(type, inputTypeName, false),
        this.typeNameFromGraphQLType(type, outputTypeName, false)
      )} ${makeExpression(language_1.swift`value`)} }`;
    } else {
      return makeExpression(expression);
    }
  }
}
exports.Helpers = Helpers;
function makeClosureSignature(parameterTypeName, returnTypeName) {
  let closureSignature = language_1.swift`(value: ${parameterTypeName})`;
  if (returnTypeName) {
    closureSignature.append(language_1.swift` -> ${returnTypeName}`);
  }
  closureSignature.append(language_1.swift` in`);
  return closureSignature;
}
function makeUniqueName(proposedName, properties) {
  for (let name = proposedName; ; name += "_") {
    if (properties.every(prop => prop.propertyName != name)) {
      return name;
    }
  }
}
function camelCase(value) {
  const [_, prefix, middle, suffix] = value.match(/^(_*)(.*?)(_*)$/) || [
    "",
    "",
    value,
    ""
  ];
  return `${prefix}${change_case_1.camelCase(middle)}${suffix}`;
}
function pascalCase(value) {
  const [_, prefix, middle, suffix] = value.match(/^(_*)(.*?)(_*)$/) || [
    "",
    "",
    value,
    ""
  ];
  return `${prefix}${change_case_1.pascalCase(middle)}${suffix}`;
}
//# sourceMappingURL=helpers.js.map