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
const t = __importStar(require("@babel/types"));
const DEFAULT_FILE_EXTENSION = "ts";
exports.DEFAULT_FILE_EXTENSION = DEFAULT_FILE_EXTENSION;
const builtInScalarMap = {
  [graphql_1.GraphQLString.name]: t.TSStringKeyword(),
  [graphql_1.GraphQLInt.name]: t.TSNumberKeyword(),
  [graphql_1.GraphQLFloat.name]: t.TSNumberKeyword(),
  [graphql_1.GraphQLBoolean.name]: t.TSBooleanKeyword(),
  [graphql_1.GraphQLID.name]: t.TSStringKeyword()
};
function createTypeFromGraphQLTypeFunction(compilerOptions) {
  const ArrayType = compilerOptions.useReadOnlyTypes
    ? e =>
        t.TSTypeReference(
          t.identifier("ReadonlyArray"),
          t.TSTypeParameterInstantiation([e])
        )
    : e => t.TSArrayType(e);
  function nonNullableTypeFromGraphQLType(graphQLType, typeName) {
    if (graphql_1.isListType(graphQLType)) {
      const elementType = typeFromGraphQLType(graphQLType.ofType, typeName);
      return ArrayType(
        t.isTSUnionType(elementType)
          ? t.TSParenthesizedType(elementType)
          : elementType
      );
    } else if (graphql_1.isScalarType(graphQLType)) {
      const builtIn = builtInScalarMap[typeName || graphQLType.name];
      if (builtIn != null) {
        return builtIn;
      } else if (compilerOptions.passthroughCustomScalars) {
        return t.TSTypeReference(
          t.identifier(
            (compilerOptions.customScalarsPrefix || "") + graphQLType.name
          )
        );
      } else {
        return t.TSAnyKeyword();
      }
    } else if (graphql_1.isNonNullType(graphQLType)) {
      return typeFromGraphQLType(graphQLType.ofType, typeName);
    } else {
      return t.TSTypeReference(t.identifier(typeName || graphQLType.name));
    }
  }
  function typeFromGraphQLType(graphQLType, typeName) {
    if (graphql_1.isNonNullType(graphQLType)) {
      return nonNullableTypeFromGraphQLType(graphQLType.ofType, typeName);
    } else {
      const type = nonNullableTypeFromGraphQLType(graphQLType, typeName);
      return t.TSUnionType([type, t.TSNullKeyword()]);
    }
  }
  return typeFromGraphQLType;
}
exports.createTypeFromGraphQLTypeFunction = createTypeFromGraphQLTypeFunction;
//# sourceMappingURL=helpers.js.map