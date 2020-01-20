export interface CheckPartialSchema_service_checkPartialSchema_compositionValidationResult_compositionValidationDetails {
  __typename: "CompositionValidationDetails";
  schemaHash: string | null;
}
export interface CheckPartialSchema_service_checkPartialSchema_compositionValidationResult_errors {
  __typename: "SchemaCompositionError";
  message: string;
}
export interface CheckPartialSchema_service_checkPartialSchema_compositionValidationResult {
  __typename: "CompositionValidationResult";
  compositionValidationDetails: CheckPartialSchema_service_checkPartialSchema_compositionValidationResult_compositionValidationDetails | null;
  graphCompositionID: string;
  errors: (CheckPartialSchema_service_checkPartialSchema_compositionValidationResult_errors | null)[];
}
export interface CheckPartialSchema_service_checkPartialSchema_checkSchemaResult_diffToPrevious_affectedClients {
  __typename: "AffectedClient";
}
export interface CheckPartialSchema_service_checkPartialSchema_checkSchemaResult_diffToPrevious_affectedQueries {
  __typename: "AffectedQuery";
}
export interface CheckPartialSchema_service_checkPartialSchema_checkSchemaResult_diffToPrevious_changes {
  __typename: "Change";
  severity: ChangeSeverity;
  code: string;
  description: string;
}
export interface CheckPartialSchema_service_checkPartialSchema_checkSchemaResult_diffToPrevious_validationConfig {
  __typename: "SchemaDiffValidationConfig";
  from: any | null;
  to: any | null;
  queryCountThreshold: number | null;
  queryCountThresholdPercentage: number | null;
}
export interface CheckPartialSchema_service_checkPartialSchema_checkSchemaResult_diffToPrevious {
  __typename: "SchemaDiff";
  severity: ChangeSeverity;
  affectedClients:
    | CheckPartialSchema_service_checkPartialSchema_checkSchemaResult_diffToPrevious_affectedClients[]
    | null;
  affectedQueries:
    | CheckPartialSchema_service_checkPartialSchema_checkSchemaResult_diffToPrevious_affectedQueries[]
    | null;
  numberOfCheckedOperations: number | null;
  changes: CheckPartialSchema_service_checkPartialSchema_checkSchemaResult_diffToPrevious_changes[];
  validationConfig: CheckPartialSchema_service_checkPartialSchema_checkSchemaResult_diffToPrevious_validationConfig | null;
}
export interface CheckPartialSchema_service_checkPartialSchema_checkSchemaResult {
  __typename: "CheckSchemaResult";
  diffToPrevious: CheckPartialSchema_service_checkPartialSchema_checkSchemaResult_diffToPrevious;
  targetUrl: string | null;
}
export interface CheckPartialSchema_service_checkPartialSchema {
  __typename: "CheckPartialSchemaResult";
  compositionValidationResult: CheckPartialSchema_service_checkPartialSchema_compositionValidationResult;
  checkSchemaResult: CheckPartialSchema_service_checkPartialSchema_checkSchemaResult | null;
}
export interface CheckPartialSchema_service {
  __typename: "ServiceMutation";
  checkPartialSchema: CheckPartialSchema_service_checkPartialSchema;
}
export interface CheckPartialSchema {
  service: CheckPartialSchema_service | null;
}
export interface CheckPartialSchemaVariables {
  id: string;
  graphVariant: string;
  implementingServiceName: string;
  partialSchema: PartialSchemaInput;
  gitContext?: GitContextInput | null;
  historicParameters?: HistoricQueryParameters | null;
  frontend?: string | null;
}
export interface CheckSchema_service_checkSchema_diffToPrevious_affectedClients {
  __typename: "AffectedClient";
}
export interface CheckSchema_service_checkSchema_diffToPrevious_affectedQueries {
  __typename: "AffectedQuery";
}
export interface CheckSchema_service_checkSchema_diffToPrevious_changes {
  __typename: "Change";
  severity: ChangeSeverity;
  code: string;
  description: string;
}
export interface CheckSchema_service_checkSchema_diffToPrevious_validationConfig {
  __typename: "SchemaDiffValidationConfig";
  from: any | null;
  to: any | null;
  queryCountThreshold: number | null;
  queryCountThresholdPercentage: number | null;
}
export interface CheckSchema_service_checkSchema_diffToPrevious {
  __typename: "SchemaDiff";
  severity: ChangeSeverity;
  affectedClients:
    | CheckSchema_service_checkSchema_diffToPrevious_affectedClients[]
    | null;
  affectedQueries:
    | CheckSchema_service_checkSchema_diffToPrevious_affectedQueries[]
    | null;
  numberOfCheckedOperations: number | null;
  changes: CheckSchema_service_checkSchema_diffToPrevious_changes[];
  validationConfig: CheckSchema_service_checkSchema_diffToPrevious_validationConfig | null;
}
export interface CheckSchema_service_checkSchema {
  __typename: "CheckSchemaResult";
  targetUrl: string | null;
  diffToPrevious: CheckSchema_service_checkSchema_diffToPrevious;
}
export interface CheckSchema_service {
  __typename: "ServiceMutation";
  checkSchema: CheckSchema_service_checkSchema;
}
export interface CheckSchema {
  service: CheckSchema_service | null;
}
export interface CheckSchemaVariables {
  id: string;
  schema?: IntrospectionSchemaInput | null;
  schemaHash?: string | null;
  tag?: string | null;
  gitContext?: GitContextInput | null;
  historicParameters?: HistoricQueryParameters | null;
  frontend?: string | null;
}
export interface ListServices_service_implementingServices_NonFederatedImplementingService {
  __typename: "NonFederatedImplementingService";
}
export interface ListServices_service_implementingServices_FederatedImplementingServices_services {
  __typename: "FederatedImplementingService";
  graphID: string;
  graphVariant: string;
  name: string;
  url: string | null;
  updatedAt: any;
}
export interface ListServices_service_implementingServices_FederatedImplementingServices {
  __typename: "FederatedImplementingServices";
  services: ListServices_service_implementingServices_FederatedImplementingServices_services[];
}
export declare type ListServices_service_implementingServices =
  | ListServices_service_implementingServices_NonFederatedImplementingService
  | ListServices_service_implementingServices_FederatedImplementingServices;
export interface ListServices_service {
  __typename: "Service";
  implementingServices: ListServices_service_implementingServices | null;
}
export interface ListServices {
  service: ListServices_service | null;
}
export interface ListServicesVariables {
  id: string;
  graphVariant: string;
}
export interface RegisterOperations_service_registerOperationsWithResponse_invalidOperations_errors {
  __typename: "OperationValidationError";
  message: string;
}
export interface RegisterOperations_service_registerOperationsWithResponse_invalidOperations {
  __typename: "InvalidOperation";
  errors:
    | RegisterOperations_service_registerOperationsWithResponse_invalidOperations_errors[]
    | null;
  signature: string;
}
export interface RegisterOperations_service_registerOperationsWithResponse_newOperations {
  __typename: "RegisteredOperation";
  signature: string;
}
export interface RegisterOperations_service_registerOperationsWithResponse {
  __typename: "RegisterOperationsMutationResponse";
  invalidOperations:
    | RegisterOperations_service_registerOperationsWithResponse_invalidOperations[]
    | null;
  newOperations:
    | RegisterOperations_service_registerOperationsWithResponse_newOperations[]
    | null;
  registrationSuccess: boolean;
}
export interface RegisterOperations_service {
  __typename: "ServiceMutation";
  registerOperationsWithResponse: RegisterOperations_service_registerOperationsWithResponse | null;
}
export interface RegisterOperations {
  service: RegisterOperations_service | null;
}
export interface RegisterOperationsVariables {
  id: string;
  clientIdentity: RegisteredClientIdentityInput;
  operations: RegisteredOperationInput[];
  manifestVersion: number;
  graphVariant?: string | null;
}
export interface RemoveServiceAndCompose_service_removeImplementingServiceAndTriggerComposition_compositionConfig_implementingServiceLocations {
  __typename: "ImplementingServiceLocation";
  name: string;
  path: string;
}
export interface RemoveServiceAndCompose_service_removeImplementingServiceAndTriggerComposition_compositionConfig {
  __typename: "CompositionConfig";
  implementingServiceLocations: RemoveServiceAndCompose_service_removeImplementingServiceAndTriggerComposition_compositionConfig_implementingServiceLocations[];
}
export interface RemoveServiceAndCompose_service_removeImplementingServiceAndTriggerComposition_errors_locations {
  __typename: "SourceLocation";
  column: number;
  line: number;
}
export interface RemoveServiceAndCompose_service_removeImplementingServiceAndTriggerComposition_errors {
  __typename: "SchemaCompositionError";
  locations: (RemoveServiceAndCompose_service_removeImplementingServiceAndTriggerComposition_errors_locations | null)[];
  message: string;
}
export interface RemoveServiceAndCompose_service_removeImplementingServiceAndTriggerComposition {
  __typename: "CompositionAndRemoveResult";
  compositionConfig: RemoveServiceAndCompose_service_removeImplementingServiceAndTriggerComposition_compositionConfig | null;
  errors: (RemoveServiceAndCompose_service_removeImplementingServiceAndTriggerComposition_errors | null)[];
  updatedGateway: boolean;
}
export interface RemoveServiceAndCompose_service {
  __typename: "ServiceMutation";
  removeImplementingServiceAndTriggerComposition: RemoveServiceAndCompose_service_removeImplementingServiceAndTriggerComposition;
}
export interface RemoveServiceAndCompose {
  service: RemoveServiceAndCompose_service | null;
}
export interface RemoveServiceAndComposeVariables {
  id: string;
  graphVariant: string;
  name: string;
}
export interface SchemaTagsAndFieldStats_service_schemaTags {
  __typename: "SchemaTag";
  tag: string;
}
export interface SchemaTagsAndFieldStats_service_stats_fieldStats_groupBy {
  __typename: "ServiceFieldStatsDimensions";
  field: string | null;
}
export interface SchemaTagsAndFieldStats_service_stats_fieldStats_metrics_fieldHistogram {
  __typename: "DurationHistogram";
  durationMs: number | null;
}
export interface SchemaTagsAndFieldStats_service_stats_fieldStats_metrics {
  __typename: "ServiceFieldStatsMetrics";
  fieldHistogram: SchemaTagsAndFieldStats_service_stats_fieldStats_metrics_fieldHistogram;
}
export interface SchemaTagsAndFieldStats_service_stats_fieldStats {
  __typename: "ServiceFieldStatsRecord";
  groupBy: SchemaTagsAndFieldStats_service_stats_fieldStats_groupBy;
  metrics: SchemaTagsAndFieldStats_service_stats_fieldStats_metrics;
}
export interface SchemaTagsAndFieldStats_service_stats {
  __typename: "ServiceStatsWindow";
  fieldStats: SchemaTagsAndFieldStats_service_stats_fieldStats[];
}
export interface SchemaTagsAndFieldStats_service {
  __typename: "Service";
  schemaTags: SchemaTagsAndFieldStats_service_schemaTags[];
  stats: SchemaTagsAndFieldStats_service_stats;
}
export interface SchemaTagsAndFieldStats {
  service: SchemaTagsAndFieldStats_service | null;
}
export interface SchemaTagsAndFieldStatsVariables {
  id: string;
}
export interface UploadAndComposePartialSchema_service_upsertImplementingServiceAndTriggerComposition_compositionConfig {
  __typename: "CompositionConfig";
  schemaHash: string;
}
export interface UploadAndComposePartialSchema_service_upsertImplementingServiceAndTriggerComposition_errors {
  __typename: "SchemaCompositionError";
  message: string;
}
export interface UploadAndComposePartialSchema_service_upsertImplementingServiceAndTriggerComposition {
  __typename: "CompositionAndUpsertResult";
  compositionConfig: UploadAndComposePartialSchema_service_upsertImplementingServiceAndTriggerComposition_compositionConfig | null;
  errors: (UploadAndComposePartialSchema_service_upsertImplementingServiceAndTriggerComposition_errors | null)[];
  didUpdateGateway: boolean;
  serviceWasCreated: boolean;
}
export interface UploadAndComposePartialSchema_service {
  __typename: "ServiceMutation";
  upsertImplementingServiceAndTriggerComposition: UploadAndComposePartialSchema_service_upsertImplementingServiceAndTriggerComposition;
}
export interface UploadAndComposePartialSchema {
  service: UploadAndComposePartialSchema_service | null;
}
export interface UploadAndComposePartialSchemaVariables {
  id: string;
  graphVariant: string;
  name: string;
  url: string;
  revision: string;
  activePartialSchema: PartialSchemaInput;
}
export interface UploadSchema_service_uploadSchema_tag_schema {
  __typename: "Schema";
  hash: string;
}
export interface UploadSchema_service_uploadSchema_tag {
  __typename: "SchemaTag";
  tag: string;
  schema: UploadSchema_service_uploadSchema_tag_schema;
}
export interface UploadSchema_service_uploadSchema {
  __typename: "UploadSchemaMutationResponse";
  code: string;
  message: string;
  success: boolean;
  tag: UploadSchema_service_uploadSchema_tag | null;
}
export interface UploadSchema_service {
  __typename: "ServiceMutation";
  uploadSchema: UploadSchema_service_uploadSchema | null;
}
export interface UploadSchema {
  service: UploadSchema_service | null;
}
export interface UploadSchemaVariables {
  id: string;
  schema: IntrospectionSchemaInput;
  tag: string;
  gitContext?: GitContextInput | null;
}
export interface ValidateOperations_service_validateOperations_validationResults_operation {
  __typename: "OperationDocument";
  name: string | null;
}
export interface ValidateOperations_service_validateOperations_validationResults {
  __typename: "ValidationResult";
  type: ValidationErrorType;
  code: ValidationErrorCode;
  description: string;
  operation: ValidateOperations_service_validateOperations_validationResults_operation;
}
export interface ValidateOperations_service_validateOperations {
  __typename: "ValidateOperationsResult";
  validationResults: ValidateOperations_service_validateOperations_validationResults[];
}
export interface ValidateOperations_service {
  __typename: "ServiceMutation";
  validateOperations: ValidateOperations_service_validateOperations;
}
export interface ValidateOperations {
  service: ValidateOperations_service | null;
}
export interface ValidateOperationsVariables {
  id: string;
  operations: OperationDocumentInput[];
  tag?: string | null;
  gitContext?: GitContextInput | null;
}
export interface GetSchemaByTag_service_schema___schema_queryType {
  __typename: "IntrospectionType";
  name: string | null;
}
export interface GetSchemaByTag_service_schema___schema_mutationType {
  __typename: "IntrospectionType";
  name: string | null;
}
export interface GetSchemaByTag_service_schema___schema_subscriptionType {
  __typename: "IntrospectionType";
  name: string | null;
}
export interface GetSchemaByTag_service_schema___schema_types_fields_args_type_ofType_ofType_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
}
export interface GetSchemaByTag_service_schema___schema_types_fields_args_type_ofType_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_fields_args_type_ofType_ofType_ofType_ofType_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_fields_args_type_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_fields_args_type_ofType_ofType_ofType_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_fields_args_type_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_fields_args_type_ofType_ofType_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_fields_args_type_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_fields_args_type_ofType_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_fields_args_type_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_fields_args_type_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_fields_args_type_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_fields_args_type_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_fields_args_type {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_fields_args_type_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_fields_args {
  __typename: "IntrospectionInputValue";
  name: string;
  description: string | null;
  type: GetSchemaByTag_service_schema___schema_types_fields_args_type;
  defaultValue: string | null;
}
export interface GetSchemaByTag_service_schema___schema_types_fields_type_ofType_ofType_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
}
export interface GetSchemaByTag_service_schema___schema_types_fields_type_ofType_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_fields_type_ofType_ofType_ofType_ofType_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_fields_type_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_fields_type_ofType_ofType_ofType_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_fields_type_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_fields_type_ofType_ofType_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_fields_type_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_fields_type_ofType_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_fields_type_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_fields_type_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_fields_type_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_fields_type_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_fields_type {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_fields_type_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_fields {
  __typename: "IntrospectionField";
  name: string;
  description: string | null;
  args: GetSchemaByTag_service_schema___schema_types_fields_args[];
  type: GetSchemaByTag_service_schema___schema_types_fields_type;
  isDeprecated: boolean;
  deprecationReason: string | null;
}
export interface GetSchemaByTag_service_schema___schema_types_inputFields_type_ofType_ofType_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
}
export interface GetSchemaByTag_service_schema___schema_types_inputFields_type_ofType_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_inputFields_type_ofType_ofType_ofType_ofType_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_inputFields_type_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_inputFields_type_ofType_ofType_ofType_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_inputFields_type_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_inputFields_type_ofType_ofType_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_inputFields_type_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_inputFields_type_ofType_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_inputFields_type_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_inputFields_type_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_inputFields_type_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_inputFields_type_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_inputFields_type {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_inputFields_type_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_inputFields {
  __typename: "IntrospectionInputValue";
  name: string;
  description: string | null;
  type: GetSchemaByTag_service_schema___schema_types_inputFields_type;
  defaultValue: string | null;
}
export interface GetSchemaByTag_service_schema___schema_types_interfaces_ofType_ofType_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
}
export interface GetSchemaByTag_service_schema___schema_types_interfaces_ofType_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_interfaces_ofType_ofType_ofType_ofType_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_interfaces_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_interfaces_ofType_ofType_ofType_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_interfaces_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_interfaces_ofType_ofType_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_interfaces_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_interfaces_ofType_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_interfaces_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_interfaces_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_interfaces_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_interfaces_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_interfaces {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_interfaces_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_enumValues {
  __typename: "IntrospectionEnumValue";
  name: string;
  description: string | null;
  isDeprecated: boolean;
  deprecationReason: string | null;
}
export interface GetSchemaByTag_service_schema___schema_types_possibleTypes_ofType_ofType_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
}
export interface GetSchemaByTag_service_schema___schema_types_possibleTypes_ofType_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_possibleTypes_ofType_ofType_ofType_ofType_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_possibleTypes_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_possibleTypes_ofType_ofType_ofType_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_possibleTypes_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_possibleTypes_ofType_ofType_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_possibleTypes_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_possibleTypes_ofType_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_possibleTypes_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_possibleTypes_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_possibleTypes_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_possibleTypes_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types_possibleTypes {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_types_possibleTypes_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_types {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  description: string | null;
  fields: GetSchemaByTag_service_schema___schema_types_fields[] | null;
  inputFields:
    | GetSchemaByTag_service_schema___schema_types_inputFields[]
    | null;
  interfaces: GetSchemaByTag_service_schema___schema_types_interfaces[] | null;
  enumValues: GetSchemaByTag_service_schema___schema_types_enumValues[] | null;
  possibleTypes:
    | GetSchemaByTag_service_schema___schema_types_possibleTypes[]
    | null;
}
export interface GetSchemaByTag_service_schema___schema_directives_args_type_ofType_ofType_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
}
export interface GetSchemaByTag_service_schema___schema_directives_args_type_ofType_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_directives_args_type_ofType_ofType_ofType_ofType_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_directives_args_type_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_directives_args_type_ofType_ofType_ofType_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_directives_args_type_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_directives_args_type_ofType_ofType_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_directives_args_type_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_directives_args_type_ofType_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_directives_args_type_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_directives_args_type_ofType_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_directives_args_type_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_directives_args_type_ofType_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_directives_args_type {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: GetSchemaByTag_service_schema___schema_directives_args_type_ofType | null;
}
export interface GetSchemaByTag_service_schema___schema_directives_args {
  __typename: "IntrospectionInputValue";
  name: string;
  description: string | null;
  type: GetSchemaByTag_service_schema___schema_directives_args_type;
  defaultValue: string | null;
}
export interface GetSchemaByTag_service_schema___schema_directives {
  __typename: "IntrospectionDirective";
  name: string;
  description: string | null;
  locations: IntrospectionDirectiveLocation[];
  args: GetSchemaByTag_service_schema___schema_directives_args[];
}
export interface GetSchemaByTag_service_schema___schema {
  __typename: "IntrospectionSchema";
  queryType: GetSchemaByTag_service_schema___schema_queryType;
  mutationType: GetSchemaByTag_service_schema___schema_mutationType | null;
  subscriptionType: GetSchemaByTag_service_schema___schema_subscriptionType | null;
  types: GetSchemaByTag_service_schema___schema_types[];
  directives: GetSchemaByTag_service_schema___schema_directives[];
}
export interface GetSchemaByTag_service_schema {
  __typename: "Schema";
  hash: string;
  __schema: GetSchemaByTag_service_schema___schema;
}
export interface GetSchemaByTag_service {
  __typename: "Service";
  schema: GetSchemaByTag_service_schema | null;
}
export interface GetSchemaByTag {
  service: GetSchemaByTag_service | null;
}
export interface GetSchemaByTagVariables {
  tag: string;
  id: string;
}
export interface IntrospectionFullType_fields_args_type_ofType_ofType_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
}
export interface IntrospectionFullType_fields_args_type_ofType_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_fields_args_type_ofType_ofType_ofType_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionFullType_fields_args_type_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_fields_args_type_ofType_ofType_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionFullType_fields_args_type_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_fields_args_type_ofType_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionFullType_fields_args_type_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_fields_args_type_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionFullType_fields_args_type_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_fields_args_type_ofType_ofType_ofType | null;
}
export interface IntrospectionFullType_fields_args_type_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_fields_args_type_ofType_ofType | null;
}
export interface IntrospectionFullType_fields_args_type {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_fields_args_type_ofType | null;
}
export interface IntrospectionFullType_fields_args {
  __typename: "IntrospectionInputValue";
  name: string;
  description: string | null;
  type: IntrospectionFullType_fields_args_type;
  defaultValue: string | null;
}
export interface IntrospectionFullType_fields_type_ofType_ofType_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
}
export interface IntrospectionFullType_fields_type_ofType_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_fields_type_ofType_ofType_ofType_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionFullType_fields_type_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_fields_type_ofType_ofType_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionFullType_fields_type_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_fields_type_ofType_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionFullType_fields_type_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_fields_type_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionFullType_fields_type_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_fields_type_ofType_ofType_ofType | null;
}
export interface IntrospectionFullType_fields_type_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_fields_type_ofType_ofType | null;
}
export interface IntrospectionFullType_fields_type {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_fields_type_ofType | null;
}
export interface IntrospectionFullType_fields {
  __typename: "IntrospectionField";
  name: string;
  description: string | null;
  args: IntrospectionFullType_fields_args[];
  type: IntrospectionFullType_fields_type;
  isDeprecated: boolean;
  deprecationReason: string | null;
}
export interface IntrospectionFullType_inputFields_type_ofType_ofType_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
}
export interface IntrospectionFullType_inputFields_type_ofType_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_inputFields_type_ofType_ofType_ofType_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionFullType_inputFields_type_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_inputFields_type_ofType_ofType_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionFullType_inputFields_type_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_inputFields_type_ofType_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionFullType_inputFields_type_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_inputFields_type_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionFullType_inputFields_type_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_inputFields_type_ofType_ofType_ofType | null;
}
export interface IntrospectionFullType_inputFields_type_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_inputFields_type_ofType_ofType | null;
}
export interface IntrospectionFullType_inputFields_type {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_inputFields_type_ofType | null;
}
export interface IntrospectionFullType_inputFields {
  __typename: "IntrospectionInputValue";
  name: string;
  description: string | null;
  type: IntrospectionFullType_inputFields_type;
  defaultValue: string | null;
}
export interface IntrospectionFullType_interfaces_ofType_ofType_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
}
export interface IntrospectionFullType_interfaces_ofType_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_interfaces_ofType_ofType_ofType_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionFullType_interfaces_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_interfaces_ofType_ofType_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionFullType_interfaces_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_interfaces_ofType_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionFullType_interfaces_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_interfaces_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionFullType_interfaces_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_interfaces_ofType_ofType_ofType | null;
}
export interface IntrospectionFullType_interfaces_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_interfaces_ofType_ofType | null;
}
export interface IntrospectionFullType_interfaces {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_interfaces_ofType | null;
}
export interface IntrospectionFullType_enumValues {
  __typename: "IntrospectionEnumValue";
  name: string;
  description: string | null;
  isDeprecated: boolean;
  deprecationReason: string | null;
}
export interface IntrospectionFullType_possibleTypes_ofType_ofType_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
}
export interface IntrospectionFullType_possibleTypes_ofType_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_possibleTypes_ofType_ofType_ofType_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionFullType_possibleTypes_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_possibleTypes_ofType_ofType_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionFullType_possibleTypes_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_possibleTypes_ofType_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionFullType_possibleTypes_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_possibleTypes_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionFullType_possibleTypes_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_possibleTypes_ofType_ofType_ofType | null;
}
export interface IntrospectionFullType_possibleTypes_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_possibleTypes_ofType_ofType | null;
}
export interface IntrospectionFullType_possibleTypes {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionFullType_possibleTypes_ofType | null;
}
export interface IntrospectionFullType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  description: string | null;
  fields: IntrospectionFullType_fields[] | null;
  inputFields: IntrospectionFullType_inputFields[] | null;
  interfaces: IntrospectionFullType_interfaces[] | null;
  enumValues: IntrospectionFullType_enumValues[] | null;
  possibleTypes: IntrospectionFullType_possibleTypes[] | null;
}
export interface IntrospectionInputValue_type_ofType_ofType_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
}
export interface IntrospectionInputValue_type_ofType_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionInputValue_type_ofType_ofType_ofType_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionInputValue_type_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionInputValue_type_ofType_ofType_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionInputValue_type_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionInputValue_type_ofType_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionInputValue_type_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionInputValue_type_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionInputValue_type_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionInputValue_type_ofType_ofType_ofType | null;
}
export interface IntrospectionInputValue_type_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionInputValue_type_ofType_ofType | null;
}
export interface IntrospectionInputValue_type {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionInputValue_type_ofType | null;
}
export interface IntrospectionInputValue {
  __typename: "IntrospectionInputValue";
  name: string;
  description: string | null;
  type: IntrospectionInputValue_type;
  defaultValue: string | null;
}
export interface IntrospectionTypeRef_ofType_ofType_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
}
export interface IntrospectionTypeRef_ofType_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionTypeRef_ofType_ofType_ofType_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionTypeRef_ofType_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionTypeRef_ofType_ofType_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionTypeRef_ofType_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionTypeRef_ofType_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionTypeRef_ofType_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionTypeRef_ofType_ofType_ofType_ofType | null;
}
export interface IntrospectionTypeRef_ofType_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionTypeRef_ofType_ofType_ofType | null;
}
export interface IntrospectionTypeRef_ofType {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionTypeRef_ofType_ofType | null;
}
export interface IntrospectionTypeRef {
  __typename: "IntrospectionType";
  kind: IntrospectionTypeKind | null;
  name: string | null;
  ofType: IntrospectionTypeRef_ofType | null;
}
export declare enum ChangeSeverity {
  FAILURE = "FAILURE",
  NOTICE = "NOTICE",
  WARNING = "WARNING"
}
export declare enum IntrospectionDirectiveLocation {
  ARGUMENT_DEFINITION = "ARGUMENT_DEFINITION",
  ENUM = "ENUM",
  ENUM_VALUE = "ENUM_VALUE",
  FIELD = "FIELD",
  FIELD_DEFINITION = "FIELD_DEFINITION",
  FRAGMENT_DEFINITION = "FRAGMENT_DEFINITION",
  FRAGMENT_SPREAD = "FRAGMENT_SPREAD",
  INLINE_FRAGMENT = "INLINE_FRAGMENT",
  INPUT_FIELD_DEFINITION = "INPUT_FIELD_DEFINITION",
  INPUT_OBJECT = "INPUT_OBJECT",
  INTERFACE = "INTERFACE",
  MUTATION = "MUTATION",
  OBJECT = "OBJECT",
  QUERY = "QUERY",
  SCALAR = "SCALAR",
  SCHEMA = "SCHEMA",
  SUBSCRIPTION = "SUBSCRIPTION",
  UNION = "UNION"
}
export declare enum IntrospectionTypeKind {
  ENUM = "ENUM",
  INPUT_OBJECT = "INPUT_OBJECT",
  INTERFACE = "INTERFACE",
  LIST = "LIST",
  NON_NULL = "NON_NULL",
  OBJECT = "OBJECT",
  SCALAR = "SCALAR",
  UNION = "UNION"
}
export declare enum ValidationErrorCode {
  DEPRECATED_FIELD = "DEPRECATED_FIELD",
  INVALID_OPERATION = "INVALID_OPERATION",
  NON_PARSEABLE_DOCUMENT = "NON_PARSEABLE_DOCUMENT"
}
export declare enum ValidationErrorType {
  FAILURE = "FAILURE",
  INVALID = "INVALID",
  WARNING = "WARNING"
}
export interface GitContextInput {
  remoteUrl?: string | null;
  commit: string;
  committer?: string | null;
  message?: string | null;
  branch?: string | null;
}
export interface HistoricQueryParameters {
  from?: any | null;
  to?: any | null;
  queryCountThreshold?: number | null;
  queryCountThresholdPercentage?: number | null;
}
export interface IntrospectionDirectiveInput {
  name: string;
  description?: string | null;
  locations: IntrospectionDirectiveLocation[];
  args: IntrospectionInputValueInput[];
}
export interface IntrospectionEnumValueInput {
  name: string;
  description?: string | null;
  isDeprecated: boolean;
  deprecationReason?: string | null;
}
export interface IntrospectionFieldInput {
  name: string;
  description?: string | null;
  args: IntrospectionInputValueInput[];
  type: IntrospectionTypeInput;
  isDeprecated: boolean;
  deprecationReason?: string | null;
}
export interface IntrospectionInputValueInput {
  name: string;
  description?: string | null;
  type: IntrospectionTypeInput;
  defaultValue?: string | null;
}
export interface IntrospectionSchemaInput {
  types?: IntrospectionTypeInput[] | null;
  queryType: IntrospectionTypeRefInput;
  mutationType?: IntrospectionTypeRefInput | null;
  subscriptionType?: IntrospectionTypeRefInput | null;
  directives: IntrospectionDirectiveInput[];
}
export interface IntrospectionTypeInput {
  kind: IntrospectionTypeKind;
  name?: string | null;
  description?: string | null;
  fields?: IntrospectionFieldInput[] | null;
  interfaces?: IntrospectionTypeInput[] | null;
  possibleTypes?: IntrospectionTypeInput[] | null;
  enumValues?: IntrospectionEnumValueInput[] | null;
  inputFields?: IntrospectionInputValueInput[] | null;
  ofType?: IntrospectionTypeInput | null;
}
export interface IntrospectionTypeRefInput {
  name: string;
  kind?: string | null;
}
export interface OperationDocumentInput {
  body: string;
  name?: string | null;
}
export interface PartialSchemaInput {
  sdl?: string | null;
  hash?: string | null;
}
export interface RegisteredClientIdentityInput {
  identifier: string;
  name: string;
  version?: string | null;
}
export interface RegisteredOperationInput {
  signature: string;
  document?: string | null;
  metadata?: RegisteredOperationMetadataInput | null;
}
export interface RegisteredOperationMetadataInput {
  engineSignature?: string | null;
}
//# sourceMappingURL=graphqlTypes.d.ts.map