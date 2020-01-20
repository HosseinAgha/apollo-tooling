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
const change_case_1 = require("change-case");
const Inflector = __importStar(require("inflected"));
const printing_1 = require("apollo-codegen-core/lib/utilities/printing");
const language_1 = require("./language");
const types_1 = require("./types");
const graphql_1 = require("graphql");
function enumCaseName(name) {
  return change_case_1.camelCase(name);
}
exports.enumCaseName = enumCaseName;
function operationClassName(name) {
  return change_case_1.pascalCase(name);
}
exports.operationClassName = operationClassName;
function traitNameForPropertyName(propertyName) {
  return change_case_1.pascalCase(Inflector.singularize(propertyName));
}
exports.traitNameForPropertyName = traitNameForPropertyName;
function traitNameForFragmentName(fragmentName) {
  return change_case_1.pascalCase(fragmentName);
}
exports.traitNameForFragmentName = traitNameForFragmentName;
function traitNameForInlineFragment(inlineFragment) {
  return "As" + change_case_1.pascalCase(String(inlineFragment.typeCondition));
}
exports.traitNameForInlineFragment = traitNameForInlineFragment;
function propertyFromInputField(context, field, namespace, parentTraitName) {
  const name = field.name;
  const unescapedPropertyName = isMetaFieldName(name)
    ? name
    : change_case_1.camelCase(name);
  const propertyName = language_1.escapeIdentifierIfNeeded(
    unescapedPropertyName
  );
  const type = field.type;
  const isList = graphql_1.isListType(type);
  const isOptional = !graphql_1.isNonNullType(type);
  const bareType = graphql_1.getNamedType(type);
  const bareTypeName = graphql_1.isCompositeType(bareType)
    ? printing_1.join(
        [
          namespace,
          parentTraitName,
          language_1.escapeIdentifierIfNeeded(
            change_case_1.pascalCase(Inflector.singularize(name))
          )
        ],
        "."
      )
    : undefined;
  const typeName = types_1.typeNameFromGraphQLType(
    context,
    type,
    bareTypeName,
    isOptional,
    true
  );
  return Object.assign(Object.assign({}, field), {
    propertyName,
    typeName,
    isOptional,
    isList,
    description: field.description || undefined
  });
}
exports.propertyFromInputField = propertyFromInputField;
function propertyFromLegacyField(context, field, namespace, parentTraitName) {
  const name = field.responseName;
  const propertyName = language_1.escapeIdentifierIfNeeded(name);
  const type = field.type;
  const isList = graphql_1.isListType(type);
  const isOptional = field.isConditional || !graphql_1.isNonNullType(type);
  const bareType = graphql_1.getNamedType(type);
  const bareTypeName = graphql_1.isCompositeType(bareType)
    ? printing_1.join(
        [
          namespace,
          parentTraitName,
          language_1.escapeIdentifierIfNeeded(
            change_case_1.pascalCase(Inflector.singularize(name))
          )
        ],
        "."
      )
    : undefined;
  const typeName = types_1.typeNameFromGraphQLType(
    context,
    type,
    bareTypeName,
    isOptional
  );
  return Object.assign(Object.assign({}, field), {
    propertyName,
    typeName,
    isOptional,
    isList
  });
}
exports.propertyFromLegacyField = propertyFromLegacyField;
function isMetaFieldName(name) {
  return name.startsWith("__");
}
//# sourceMappingURL=naming.js.map