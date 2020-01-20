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
const builtInScalarMap = {
  [graphql_1.GraphQLString.name]: t.stringTypeAnnotation(),
  [graphql_1.GraphQLInt.name]: t.numberTypeAnnotation(),
  [graphql_1.GraphQLFloat.name]: t.numberTypeAnnotation(),
  [graphql_1.GraphQLBoolean.name]: t.booleanTypeAnnotation(),
  [graphql_1.GraphQLID.name]: t.stringTypeAnnotation()
};
function createTypeAnnotationFromGraphQLTypeFunction(compilerOptions) {
  const arrayType = compilerOptions.useReadOnlyTypes
    ? "$ReadOnlyArray"
    : "Array";
  function nonNullableTypeAnnotationFromGraphQLType(type, typeName) {
    if (graphql_1.isListType(type)) {
      return t.genericTypeAnnotation(
        t.identifier(arrayType),
        t.typeParameterInstantiation([
          typeAnnotationFromGraphQLType(type.ofType, typeName)
        ])
      );
    } else if (graphql_1.isScalarType(type)) {
      const builtIn = builtInScalarMap[typeName || type.name];
      if (builtIn != null) {
        return builtIn;
      } else if (compilerOptions.passthroughCustomScalars) {
        return t.genericTypeAnnotation(
          t.identifier(
            (compilerOptions.customScalarsPrefix || "") +
              (typeName || type.name)
          )
        );
      } else {
        return t.anyTypeAnnotation();
      }
    } else if (graphql_1.isNonNullType(type)) {
      return typeAnnotationFromGraphQLType(type.ofType, typeName);
    } else {
      return t.genericTypeAnnotation(t.identifier(typeName || type.name));
    }
  }
  function typeAnnotationFromGraphQLType(type, typeName) {
    if (graphql_1.isNonNullType(type)) {
      return nonNullableTypeAnnotationFromGraphQLType(type.ofType, typeName);
    } else {
      return t.nullableTypeAnnotation(
        nonNullableTypeAnnotationFromGraphQLType(type, typeName)
      );
    }
  }
  return typeAnnotationFromGraphQLType;
}
exports.createTypeAnnotationFromGraphQLTypeFunction = createTypeAnnotationFromGraphQLTypeFunction;
//# sourceMappingURL=helpers.js.map