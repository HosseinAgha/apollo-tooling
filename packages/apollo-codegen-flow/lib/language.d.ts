import { GraphQLEnumType, GraphQLInputObjectType } from "graphql";
import { CompilerOptions } from "apollo-codegen-core/lib/compiler";
import * as t from "@babel/types";
export declare type ObjectProperty = {
  name: string;
  description?: string | null | undefined;
  annotation: t.FlowTypeAnnotation;
};
export interface FlowCompilerOptions extends CompilerOptions {
  useFlowExactObjects: boolean;
}
export default class FlowGenerator {
  options: FlowCompilerOptions;
  typeAnnotationFromGraphQLType: Function;
  constructor(compilerOptions: FlowCompilerOptions);
  enumerationDeclaration(type: GraphQLEnumType): t.ExportNamedDeclaration;
  inputObjectDeclaration(inputObjectType: GraphQLInputObjectType): t.TypeAlias;
  objectTypeAnnotation(
    fields: ObjectProperty[],
    {
      keyInheritsNullability
    }?: {
      keyInheritsNullability?: boolean;
    }
  ): t.ObjectTypeAnnotation;
  typeAliasObject(
    name: string,
    fields: ObjectProperty[],
    {
      keyInheritsNullability,
      exact
    }?: {
      keyInheritsNullability?: boolean;
      exact?: boolean;
    }
  ): t.TypeAlias;
  typeAliasObjectUnion(name: string, members: ObjectProperty[][]): t.TypeAlias;
  typeAliasGenericUnion(
    name: string,
    members: t.FlowTypeAnnotation[]
  ): t.TypeAlias;
  exportDeclaration(
    declaration: t.Declaration,
    options?: {
      comments?: string;
    }
  ): t.ExportNamedDeclaration;
  annotationFromScopeStack(scope: string[]): t.GenericTypeAnnotation;
}
//# sourceMappingURL=language.d.ts.map