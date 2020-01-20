import { GraphQLEnumType, GraphQLInputObjectType } from "graphql";
import {
  CompilerContext,
  Operation,
  Fragment
} from "apollo-codegen-core/lib/compiler";
import { BasicGeneratedFile } from "apollo-codegen-core/lib/utilities/CodeGenerator";
import TypescriptGenerator from "./language";
import Printer from "./printer";
import { GraphQLType } from "graphql/type/definition";
declare class TypescriptGeneratedFile implements BasicGeneratedFile {
  fileContents: string;
  constructor(fileContents: string);
  get output(): string;
}
export declare function generateSource(
  context: CompilerContext
): {
  generatedFiles: {
    sourcePath: string;
    fileName: string;
    content: TypescriptGeneratedFile;
  }[];
  common: string;
};
interface IGeneratedFileOptions {
  outputPath?: string;
  globalSourcePath?: string;
}
interface IGeneratedFile {
  sourcePath: string;
  fileName: string;
  content: (options?: IGeneratedFileOptions) => TypescriptGeneratedFile;
}
export declare function generateLocalSource(
  context: CompilerContext
): IGeneratedFile[];
export declare function generateGlobalSource(
  context: CompilerContext
): TypescriptGeneratedFile;
export declare class TypescriptAPIGenerator extends TypescriptGenerator {
  context: CompilerContext;
  printer: Printer;
  scopeStack: string[];
  constructor(context: CompilerContext);
  fileHeader(): void;
  typeAliasForEnumType(enumType: GraphQLEnumType): void;
  typeAliasForInputObjectType(inputObjectType: GraphQLInputObjectType): void;
  interfacesForOperation(operation: Operation): void;
  interfacesForFragment(fragment: Fragment): void;
  getGlobalTypesUsedForOperation: (doc: Operation) => GraphQLType[];
  getGlobalTypesUsedForFragment: (doc: Fragment) => GraphQLType[];
  private reduceSelection;
  private isGlobalType;
  private getUnderlyingType;
  getTypesUsedForOperation(
    doc: Operation | Fragment,
    context: CompilerContext
  ): GraphQLType[];
  private reduceTypesUsed;
  private getVariantsForSelectionSet;
  private getTypeCasesForSelectionSet;
  private getPropertiesForVariant;
  private handleFieldSelectionSetValue;
  private handleFieldValue;
  get output(): string;
  scopeStackPush(name: string): void;
  scopeStackPop(): string | undefined;
}
export {};
//# sourceMappingURL=codeGeneration.d.ts.map
