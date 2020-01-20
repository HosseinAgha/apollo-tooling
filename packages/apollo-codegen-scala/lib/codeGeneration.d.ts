import CodeGenerator from "apollo-codegen-core/lib/utilities/CodeGenerator";
import {
  LegacyCompilerContext,
  LegacyOperation,
  LegacyFragment,
  LegacyField,
  LegacyInlineFragment
} from "apollo-codegen-core/lib/compiler/legacyIR";
import { GraphQLType } from "graphql";
import { Property } from "./language";
import { GraphQLCompositeType } from "graphql";
export declare function generateSource(context: LegacyCompilerContext): string;
export declare function classDeclarationForOperation(
  generator: CodeGenerator<LegacyCompilerContext, any>,
  {
    operationName,
    operationType,
    rootType,
    variables,
    fields,
    inlineFragments,
    fragmentSpreads,
    fragmentsReferenced,
    source,
    operationId
  }: LegacyOperation
): void;
export declare function traitDeclarationForFragment(
  generator: CodeGenerator<LegacyCompilerContext, any>,
  {
    fragmentName,
    typeCondition,
    fields,
    inlineFragments,
    fragmentSpreads,
    source
  }: LegacyFragment
): void;
export declare function traitDeclarationForSelectionSet(
  generator: CodeGenerator<LegacyCompilerContext, any>,
  {
    traitName,
    parentType,
    fields,
    inlineFragments,
    fragmentSpreads,
    viewableAs,
    parentFragments
  }: {
    traitName: string;
    parentType: GraphQLCompositeType;
    fields: LegacyField[];
    inlineFragments?: LegacyInlineFragment[];
    fragmentSpreads?: string[];
    viewableAs?: {
      traitName: string;
      properties: (LegacyField & Property)[];
    };
    parentFragments?: string[];
  },
  objectClosure?: () => void
): void;
export declare function typeDeclarationForGraphQLType(
  generator: CodeGenerator<LegacyCompilerContext, any>,
  type: GraphQLType
): void;
//# sourceMappingURL=codeGeneration.d.ts.map