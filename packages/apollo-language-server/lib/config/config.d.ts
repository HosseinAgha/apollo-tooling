import { ServiceID, ServiceSpecifier, ClientID } from "../engine";
import URI from "vscode-uri";
import { WithRequired } from "apollo-env";
import { ValidationRule } from "graphql/validation/ValidationContext";
export interface EngineStatsWindow {
  to: number;
  from: number;
}
export declare const DefaultEngineStatsWindow: {
  to: number;
  from: number;
};
export interface HistoricalEngineStatsWindow extends EngineStatsWindow {}
export declare type EndpointURI = string;
export interface RemoteServiceConfig {
  name: ServiceID;
  url: EndpointURI;
  headers?: {
    [key: string]: string;
  };
  skipSSLValidation?: boolean;
}
export interface LocalServiceConfig {
  name: ServiceID;
  localSchemaFile: string | string[];
}
export interface EngineConfig {
  endpoint?: EndpointURI;
  frontend?: EndpointURI;
  readonly apiKey?: string;
}
export declare const DefaultEngineConfig: {
  endpoint: string;
  frontend: string;
};
export declare const DefaultConfigBase: {
  includes: string[];
  excludes: string[];
};
export interface ConfigBase {
  includes: string[];
  excludes: string[];
}
export declare type ClientServiceConfig =
  | RemoteServiceConfig
  | LocalServiceConfig;
export interface ClientConfigFormat extends ConfigBase {
  service?: ServiceSpecifier | ClientServiceConfig;
  name?: ClientID;
  referenceID?: string;
  version?: string;
  clientOnlyDirectives?: string[];
  clientSchemaDirectives?: string[];
  addTypename?: boolean;
  tagName?: string;
  statsWindow?: EngineStatsWindow;
  validationRules?: ValidationRule[] | ((rule: ValidationRule) => boolean);
}
export declare const DefaultClientConfig: {
  tagName: string;
  clientOnlyDirectives: string[];
  clientSchemaDirectives: string[];
  addTypename: boolean;
  statsWindow: {
    to: number;
    from: number;
  };
  includes: string[];
  excludes: string[];
};
export interface ServiceConfigFormat extends ConfigBase {
  name?: string;
  endpoint?: Exclude<RemoteServiceConfig, "name">;
  localSchemaFile?: string | string[];
}
export declare const DefaultServiceConfig: {
  endpoint: {
    url: string;
  };
  includes: string[];
  excludes: string[];
};
export interface ConfigBaseFormat {
  client?: ClientConfigFormat;
  service?: ServiceConfigFormat;
  engine?: EngineConfig;
}
export declare type ApolloConfigFormat =
  | WithRequired<ConfigBaseFormat, "client">
  | WithRequired<ConfigBaseFormat, "service">;
export declare class ApolloConfig {
  rawConfig: ApolloConfigFormat;
  configURI?: URI | undefined;
  isClient: boolean;
  isService: boolean;
  engine: EngineConfig;
  name?: string;
  service?: ServiceConfigFormat;
  client?: ClientConfigFormat;
  private _tag?;
  constructor(rawConfig: ApolloConfigFormat, configURI?: URI | undefined);
  get configDirURI(): URI | undefined;
  get projects(): (ClientConfig | ServiceConfig)[];
  set tag(tag: string);
  get tag(): string;
  setDefaults({ client, engine, service }: any): void;
}
export declare class ClientConfig extends ApolloConfig {
  client: ClientConfigFormat;
}
export declare class ServiceConfig extends ApolloConfig {
  service: ServiceConfigFormat;
}
//# sourceMappingURL=config.d.ts.map