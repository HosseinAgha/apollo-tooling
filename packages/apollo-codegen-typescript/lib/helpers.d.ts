import { GraphQLType } from "graphql";
import * as t from "@babel/types";
import { CompilerOptions } from "apollo-codegen-core/lib/compiler";
declare const DEFAULT_FILE_EXTENSION = "ts";
export declare function createTypeFromGraphQLTypeFunction(
  compilerOptions: CompilerOptions
): (graphQLType: GraphQLType, typeName?: string) => t.TSType;
export { DEFAULT_FILE_EXTENSION };
//# sourceMappingURL=helpers.d.ts.map
