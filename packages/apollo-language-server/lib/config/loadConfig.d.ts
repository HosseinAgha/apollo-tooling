import { ApolloConfig } from "./config";
export interface LoadConfigSettings {
  configPath?: string;
  configFileName?: string;
  requireConfig?: boolean;
  name?: string;
  type?: "service" | "client";
}
export declare type ConfigResult<T> = {
  config: T;
  filepath: string;
} | null;
export declare function loadConfig({
  configPath,
  configFileName,
  requireConfig,
  name,
  type
}: LoadConfigSettings): Promise<void | ApolloConfig>;
//# sourceMappingURL=loadConfig.d.ts.map
