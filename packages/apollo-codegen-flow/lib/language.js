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
const printing_1 = require("apollo-codegen-core/lib/utilities/printing");
const graphql_1 = require("apollo-codegen-core/lib/utilities/graphql");
const helpers_1 = require("./helpers");
const t = __importStar(require("@babel/types"));
class FlowGenerator {
  constructor(compilerOptions) {
    this.options = compilerOptions;
    this.typeAnnotationFromGraphQLType = helpers_1.createTypeAnnotationFromGraphQLTypeFunction(
      compilerOptions
    );
  }
  enumerationDeclaration(type) {
    const { name, description } = type;
    const unionValues = graphql_1
      .sortEnumValues(type.getValues())
      .map(({ value }) => {
        const type = t.stringLiteralTypeAnnotation(value);
        return type;
      });
    const typeAlias = t.exportNamedDeclaration(
      t.typeAlias(
        t.identifier(name),
        undefined,
        t.unionTypeAnnotation(unionValues)
      ),
      []
    );
    typeAlias.leadingComments = [
      {
        type: "CommentBlock",
        value: printing_1.commentBlockContent(description || "")
      }
    ];
    return typeAlias;
  }
  inputObjectDeclaration(inputObjectType) {
    const { name } = inputObjectType;
    const fieldMap = inputObjectType.getFields();
    const fields = Object.keys(inputObjectType.getFields()).map(fieldName => {
      const field = fieldMap[fieldName];
      return {
        name: fieldName,
        annotation: this.typeAnnotationFromGraphQLType(field.type)
      };
    });
    const typeAlias = this.typeAliasObject(name, fields, {
      keyInheritsNullability: true,
      exact: true
    });
    return typeAlias;
  }
  objectTypeAnnotation(fields, { keyInheritsNullability = false } = {}) {
    const objectTypeAnnotation = t.objectTypeAnnotation(
      fields.map(({ name, description, annotation }) => {
        const objectTypeProperty = t.objectTypeProperty(
          t.identifier(name),
          annotation
        );
        objectTypeProperty.optional =
          keyInheritsNullability &&
          annotation.type === "NullableTypeAnnotation";
        if (this.options.useReadOnlyTypes) {
          objectTypeProperty.variance = { kind: "plus" };
        }
        if (description) {
          objectTypeProperty.leadingComments = [
            {
              type: "CommentBlock",
              value: printing_1.commentBlockContent(description)
            }
          ];
        }
        return objectTypeProperty;
      })
    );
    if (this.options.useFlowExactObjects) {
      objectTypeAnnotation.exact = true;
    }
    return objectTypeAnnotation;
  }
  typeAliasObject(
    name,
    fields,
    { keyInheritsNullability = false, exact = false } = {}
  ) {
    const objectTypeAnnotation = this.objectTypeAnnotation(fields, {
      keyInheritsNullability
    });
    if (exact) {
      objectTypeAnnotation.exact = true;
    }
    return t.typeAlias(t.identifier(name), undefined, objectTypeAnnotation);
  }
  typeAliasObjectUnion(name, members) {
    return t.typeAlias(
      t.identifier(name),
      undefined,
      t.unionTypeAnnotation(
        members.map(member => {
          return this.objectTypeAnnotation(member);
        })
      )
    );
  }
  typeAliasGenericUnion(name, members) {
    return t.typeAlias(
      t.identifier(name),
      undefined,
      t.unionTypeAnnotation(members)
    );
  }
  exportDeclaration(declaration, options = {}) {
    const exportedDeclaration = t.exportNamedDeclaration(declaration, []);
    if (options.comments) {
      exportedDeclaration.trailingComments = [
        {
          type: "CommentBlock",
          value: printing_1.commentBlockContent(options.comments)
        }
      ];
    }
    return exportedDeclaration;
  }
  annotationFromScopeStack(scope) {
    return t.genericTypeAnnotation(t.identifier(scope.join("_")));
  }
}
exports.default = FlowGenerator;
//# sourceMappingURL=language.js.map