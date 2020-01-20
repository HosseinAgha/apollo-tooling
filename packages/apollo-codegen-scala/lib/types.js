"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const builtInScalarMap = {
  [graphql_1.GraphQLString.name]: "String",
  [graphql_1.GraphQLInt.name]: "Int",
  [graphql_1.GraphQLFloat.name]: "Double",
  [graphql_1.GraphQLBoolean.name]: "Boolean",
  [graphql_1.GraphQLID.name]: "String"
};
function possibleTypesForType(context, type) {
  if (graphql_1.isAbstractType(type)) {
    return context.schema.getPossibleTypes(type);
  } else {
    return [type];
  }
}
exports.possibleTypesForType = possibleTypesForType;
function typeNameFromGraphQLType(
  context,
  type,
  bareTypeName,
  isOptional,
  isInputObject
) {
  if (graphql_1.isNonNullType(type)) {
    return typeNameFromGraphQLType(
      context,
      type.ofType,
      bareTypeName,
      isOptional || false,
      isInputObject
    );
  } else if (isOptional === undefined) {
    isOptional = true;
  }
  let typeName;
  if (graphql_1.isListType(type)) {
    if (isInputObject) {
      typeName =
        "Seq[" +
        typeNameFromGraphQLType(
          context,
          type.ofType,
          bareTypeName,
          undefined,
          isInputObject
        ) +
        "]";
    } else {
      typeName =
        "scala.scalajs.js.Array[" +
        typeNameFromGraphQLType(
          context,
          type.ofType,
          bareTypeName,
          undefined,
          isInputObject
        ) +
        "]";
    }
  } else if (graphql_1.isScalarType(type)) {
    typeName = typeNameForScalarType(context, type);
  } else if (graphql_1.isEnumType(type)) {
    typeName = "String";
  } else {
    typeName = bareTypeName || type.name;
  }
  return isOptional
    ? `com.apollographql.scalajs.OptionalValue[${typeName}]`
    : typeName;
}
exports.typeNameFromGraphQLType = typeNameFromGraphQLType;
function typeNameForScalarType(context, type) {
  return (
    builtInScalarMap[type.name] ||
    (context.options.passthroughCustomScalars
      ? context.options.customScalarsPrefix + type.name
      : graphql_1.GraphQLString.name)
  );
}
//# sourceMappingURL=types.js.map