import CodeGenerator from "apollo-codegen-core/lib/utilities/CodeGenerator";
import { LegacyCompilerContext } from "apollo-codegen-core/lib/compiler/legacyIR";
export interface Property {
  propertyName: string;
  typeName: string;
  traitName?: string;
  isOptional?: boolean;
  isList?: boolean;
  description?: string;
}
export declare function comment(
  generator: CodeGenerator<LegacyCompilerContext, any>,
  comment: string
): void;
export declare function packageDeclaration(
  generator: CodeGenerator<LegacyCompilerContext, any>,
  pkg: string
): void;
export declare function objectDeclaration(
  generator: CodeGenerator<LegacyCompilerContext, any>,
  {
    objectName,
    superclass
  }: {
    objectName: string;
    superclass?: string;
  },
  closure?: () => void
): void;
export declare function traitDeclaration(
  generator: CodeGenerator<LegacyCompilerContext, any>,
  {
    traitName,
    annotations,
    superclasses,
    description
  }: {
    traitName: string;
    annotations?: string[];
    superclasses?: string[];
    description?: string;
  },
  closure?: () => void
): void;
export declare function methodDeclaration(
  generator: CodeGenerator<LegacyCompilerContext, any>,
  {
    methodName,
    description,
    params
  }: {
    methodName: string;
    description?: string;
    params?: {
      name: string;
      type: string;
      defaultValue?: string;
    }[];
  },
  closure?: () => void
): void;
export declare function propertyDeclaration(
  generator: CodeGenerator<LegacyCompilerContext, any>,
  {
    jsName,
    propertyName,
    typeName,
    description
  }: {
    jsName?: string;
    propertyName: string;
    typeName: string;
    description?: string;
  },
  closure?: () => void
): void;
export declare function propertyDeclarations(
  generator: CodeGenerator<LegacyCompilerContext, any>,
  declarations: {
    propertyName: string;
    typeName: string;
    description: string;
  }[]
): void;
export declare function escapeIdentifierIfNeeded(identifier: string): string;
//# sourceMappingURL=language.d.ts.map