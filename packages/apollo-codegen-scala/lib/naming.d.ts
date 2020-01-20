import { Property } from "./language";
import {
  LegacyCompilerContext,
  LegacyField,
  LegacyInlineFragment
} from "apollo-codegen-core/lib/compiler/legacyIR";
import { GraphQLInputField } from "graphql";
export declare function enumCaseName(name: string): string;
export declare function operationClassName(name: string): string;
export declare function traitNameForPropertyName(propertyName: string): string;
export declare function traitNameForFragmentName(fragmentName: string): string;
export declare function traitNameForInlineFragment(
  inlineFragment: LegacyInlineFragment
): string;
export declare function propertyFromInputField(
  context: LegacyCompilerContext,
  field: GraphQLInputField,
  namespace?: string,
  parentTraitName?: string
): GraphQLInputField & Property;
export declare function propertyFromLegacyField(
  context: LegacyCompilerContext,
  field: LegacyField,
  namespace?: string,
  parentTraitName?: string
): LegacyField & Property;
//# sourceMappingURL=naming.d.ts.map