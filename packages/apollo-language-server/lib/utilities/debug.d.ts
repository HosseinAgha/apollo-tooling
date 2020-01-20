import { IConnection } from "vscode-languageserver";
declare type Logger = (message?: any) => void;
export declare class Debug {
  private static connection?;
  private static infoLogger;
  private static warningLogger;
  private static errorLogger;
  static SetConnection(conn: IConnection): void;
  static SetLoggers({
    info,
    warning,
    error
  }: {
    info?: Logger;
    warning?: Logger;
    error?: Logger;
  }): void;
  static info(message: string): void;
  static error(message: string): void;
  static warning(message: string): void;
  static sendErrorTelemetry(message: string): void;
}
export {};
//# sourceMappingURL=debug.d.ts.map