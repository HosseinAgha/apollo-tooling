import {
  GraphQLCompositeType,
  GraphQLEnumValue,
  GraphQLSchema,
  GraphQLType,
  ASTNode,
  Location,
  ValueNode,
  OperationDefinitionNode,
  FieldNode,
  GraphQLField,
  DocumentNode
} from "graphql";
declare module "graphql/utilities/buildASTSchema" {
  function buildASTSchema(
    ast: DocumentNode,
    options?: {
      assumeValid?: boolean;
      commentDescriptions?: boolean;
    }
  ): GraphQLSchema;
}
export declare function sortEnumValues(
  values: GraphQLEnumValue[]
): GraphQLEnumValue[];
export declare function isList(type: GraphQLType): boolean;
export declare function isMetaFieldName(name: string): boolean;
export declare function removeConnectionDirectives(ast: ASTNode): any;
export declare function removeClientDirectives(ast: ASTNode): any;
export declare function withTypenameFieldAddedWhereNeeded(ast: ASTNode): any;
export declare function sourceAt(location: Location): string;
export declare function filePathForNode(node: ASTNode): string;
export declare function valueFromValueNode(
  valueNode: ValueNode
):
  | any
  | {
      kind: "Variable";
      variableName: string;
    };
export declare function isTypeProperSuperTypeOf(
  schema: GraphQLSchema,
  maybeSuperType: GraphQLCompositeType,
  subType: GraphQLCompositeType
): boolean;
export declare function getOperationRootType(
  schema: GraphQLSchema,
  operation: OperationDefinitionNode
): import("graphql/tsutils/Maybe").default<
  import("graphql").GraphQLObjectType<
    any,
    any,
    {
      [key: string]: any;
    }
  >
>;
export declare function getFieldDef(
  schema: GraphQLSchema,
  parentType: GraphQLCompositeType,
  fieldAST: FieldNode
): GraphQLField<any, any> | undefined;
//# sourceMappingURL=graphql.d.ts.map