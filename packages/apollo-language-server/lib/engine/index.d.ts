import { GraphQLDataSource } from "./GraphQLDataSource";
import {
  ListServicesVariables,
  CheckSchemaVariables,
  UploadSchemaVariables,
  UploadAndComposePartialSchemaVariables,
  RegisterOperationsVariables,
  ValidateOperationsVariables,
  CheckPartialSchemaVariables,
  RemoveServiceAndComposeVariables,
  CheckPartialSchema_service_checkPartialSchema
} from "../graphqlTypes";
export interface ClientIdentity {
  name?: string;
  version?: string;
  referenceID?: string;
}
export declare type ServiceID = string;
export declare type ClientID = string;
export declare type SchemaTag = string;
export declare type ServiceIDAndTag = [ServiceID, SchemaTag?];
export declare type ServiceSpecifier = string;
export declare type FieldStats = Map<string, Map<string, number | null>>;
export declare function noServiceError(
  service: string | undefined,
  endpoint?: string
): string;
export declare class ApolloEngineClient extends GraphQLDataSource {
  private engineKey;
  private clientIdentity?;
  constructor(
    engineKey: string,
    engineEndpoint?: string,
    clientIdentity?: ClientIdentity | undefined
  );
  willSendRequest(request: any): void;
  listServices(
    variables: ListServicesVariables
  ): Promise<import("../graphqlTypes").ListServices_service>;
  checkSchema(
    variables: CheckSchemaVariables
  ): Promise<import("../graphqlTypes").CheckSchema_service_checkSchema>;
  uploadSchema(
    variables: UploadSchemaVariables
  ): Promise<
    import("../graphqlTypes").UploadSchema_service_uploadSchema | null
  >;
  uploadAndComposePartialSchema(
    variables: UploadAndComposePartialSchemaVariables
  ): Promise<
    import("../graphqlTypes").UploadAndComposePartialSchema_service_upsertImplementingServiceAndTriggerComposition
  >;
  checkPartialSchema(
    variables: CheckPartialSchemaVariables
  ): Promise<CheckPartialSchema_service_checkPartialSchema>;
  removeServiceAndCompose(
    variables: RemoveServiceAndComposeVariables
  ): Promise<
    import("../graphqlTypes").RemoveServiceAndCompose_service_removeImplementingServiceAndTriggerComposition
  >;
  validateOperations(
    variables: ValidateOperationsVariables
  ): Promise<
    import("../graphqlTypes").ValidateOperations_service_validateOperations_validationResults[]
  >;
  registerOperations(
    variables: RegisterOperationsVariables
  ): Promise<
    import("../graphqlTypes").RegisterOperations_service_registerOperationsWithResponse
  >;
  loadSchemaTagsAndFieldStats(
    serviceID: string
  ): Promise<{
    schemaTags: string[];
    fieldStats: FieldStats;
  }>;
}
//# sourceMappingURL=index.d.ts.map
