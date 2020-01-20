import { GraphQLScalarType } from "graphql";
import { LegacyCompilerContext } from "apollo-codegen-core/lib/compiler/legacyIR";
import { GraphQLType } from "graphql";
export declare function possibleTypesForType(
  context: LegacyCompilerContext,
  type: GraphQLType
):
  | readonly import("graphql").GraphQLObjectType<
      any,
      any,
      {
        [key: string]: any;
      }
    >[]
  | (
      | GraphQLScalarType
      | import("graphql").GraphQLObjectType<
          any,
          any,
          {
            [key: string]: any;
          }
        >
      | import("graphql").GraphQLEnumType
      | import("graphql").GraphQLInputObjectType
      | import("graphql").GraphQLList<any>
      | import("graphql").GraphQLNonNull<any>)[];
export declare function typeNameFromGraphQLType(
  context: LegacyCompilerContext,
  type: GraphQLType,
  bareTypeName?: string,
  isOptional?: boolean,
  isInputObject?: boolean
): string;
//# sourceMappingURL=types.d.ts.map