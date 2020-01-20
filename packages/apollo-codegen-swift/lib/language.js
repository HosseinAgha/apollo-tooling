"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const CodeGenerator_1 = __importDefault(
  require("apollo-codegen-core/lib/utilities/CodeGenerator")
);
const printing_1 = require("apollo-codegen-core/lib/utilities/printing");
const reservedKeywords = new Set([
  "associatedtype",
  "class",
  "deinit",
  "enum",
  "extension",
  "fileprivate",
  "func",
  "import",
  "init",
  "inout",
  "internal",
  "let",
  "open",
  "operator",
  "private",
  "protocol",
  "public",
  "static",
  "struct",
  "subscript",
  "typealias",
  "var",
  "break",
  "case",
  "continue",
  "default",
  "defer",
  "do",
  "else",
  "fallthrough",
  "for",
  "guard",
  "if",
  "in",
  "repeat",
  "return",
  "switch",
  "where",
  "while",
  "as",
  "Any",
  "catch",
  "false",
  "is",
  "nil",
  "rethrows",
  "super",
  "self",
  "Self",
  "throw",
  "throws",
  "true",
  "try",
  "_",
  "associativity",
  "convenience",
  "dynamic",
  "didSet",
  "final",
  "get",
  "infix",
  "indirect",
  "lazy",
  "left",
  "mutating",
  "none",
  "nonmutating",
  "optional",
  "override",
  "postfix",
  "precedence",
  "prefix",
  "Protocol",
  "required",
  "right",
  "set",
  "Type",
  "unowned",
  "weak",
  "willSet"
]);
const reservedMemberKeywords = new Set(["self", "Type", "Protocol"]);
class SwiftSource {
  constructor(source) {
    this.source = source;
  }
  static string(string, trim = false) {
    if (trim) {
      string = string
        .split(/\n/g)
        .map(line => line.trim())
        .join(" ");
    }
    return new SwiftSource(
      `"${string.replace(/[\0\\\t\n\r"]/g, c => {
        switch (c) {
          case "\0":
            return "\\0";
          case "\t":
            return "\\t";
          case "\n":
            return "\\n";
          case "\r":
            return "\\r";
          default:
            return `\\${c}`;
        }
      })}"`
    );
  }
  static multilineString(string) {
    let rawCount = 0;
    if (/"""|\\/.test(string)) {
      let re = /"""(#+)|\\(#+)/g;
      for (let ary = re.exec(string); ary !== null; ary = re.exec(string)) {
        rawCount = Math.max(
          rawCount,
          (ary[1] || "").length,
          (ary[2] || "").length
        );
      }
      rawCount += 1;
    }
    const rawToken = "#".repeat(rawCount);
    return new SwiftSource(
      `${rawToken}"""\n${string.replace(/[\0\r]/g, c => {
        switch (c) {
          case "\0":
            return `\\${rawToken}0`;
          case "\r":
            return `\\${rawToken}r`;
          default:
            return c;
        }
      })}\n"""${rawToken}`
    );
  }
  static identifier(input) {
    return new SwiftSource(
      input.replace(/[a-zA-Z_][a-zA-Z0-9_]*/g, (match, offset, fullString) => {
        if (reservedKeywords.has(match)) {
          if (
            offset == 0 ||
            fullString[offset - 1] !== "." ||
            reservedMemberKeywords.has(match)
          ) {
            return `\`${match}\``;
          }
        }
        return match;
      })
    );
  }
  static memberName(input) {
    return new SwiftSource(
      input.replace(/[a-zA-Z_][a-zA-Z0-9_]*/g, (match, offset, fullString) => {
        if (!reservedMemberKeywords.has(match)) {
          if (
            offset == 0 ||
            fullString[offset - 1] === "." ||
            !reservedKeywords.has(match)
          ) {
            return match;
          }
        }
        return `\`${match}\``;
      })
    );
  }
  static isValidParameterName(input) {
    return input !== "self";
  }
  static raw(literals, ...placeholders) {
    var result = literals[0];
    placeholders.forEach((value, i) => {
      result += `${value}${literals[i + 1]}`;
    });
    return new SwiftSource(result);
  }
  toString() {
    return this.source;
  }
  concat(...sources) {
    return new SwiftSource(
      sources.reduce((accum, value) => accum + value.source, this.source)
    );
  }
  append(...sources) {
    for (let value of sources) {
      this.source += value.source;
    }
  }
  static wrap(start, maybeSource, end) {
    const result = printing_1.wrap(
      start.source,
      maybeSource !== undefined ? maybeSource.source : undefined,
      end !== undefined ? end.source : undefined
    );
    return result ? new SwiftSource(result) : undefined;
  }
  static join(maybeArray, separator) {
    const result = printing_1.join(maybeArray, separator);
    return result ? new SwiftSource(result) : undefined;
  }
}
exports.SwiftSource = SwiftSource;
function swift(literals, ...placeholders) {
  let result = literals[0];
  placeholders.forEach((value, i) => {
    result += _escape(value);
    result += literals[i + 1];
  });
  return new SwiftSource(result);
}
exports.swift = swift;
function _escape(value) {
  if (value instanceof SwiftSource) {
    return value.source;
  } else if (typeof value === "string") {
    return SwiftSource.identifier(value).source;
  } else if (Array.isArray(value)) {
    return value.map(_escape).join();
  } else if (typeof value === "object") {
    return SwiftSource.identifier(`${value}`).source;
  } else if (value === undefined) {
    return "";
  } else {
    return `${value}`;
  }
}
const { wrap, join } = SwiftSource;
class SwiftGenerator extends CodeGenerator_1.default {
  constructor(context) {
    super(context);
  }
  multilineString(string, suppressMultilineStringLiterals) {
    if (suppressMultilineStringLiterals) {
      this.printOnNewline(SwiftSource.string(string, !string.includes('"""')));
    } else {
      SwiftSource.multilineString(string)
        .source.split("\n")
        .forEach(line => {
          this.printOnNewline(new SwiftSource(line));
        });
    }
  }
  comment(comment, trim = true) {
    comment &&
      comment.split("\n").forEach(line => {
        this.printOnNewline(SwiftSource.raw`/// ${trim ? line.trim() : line}`);
      });
  }
  deprecationAttributes(isDeprecated, deprecationReason) {
    if (isDeprecated !== undefined && isDeprecated) {
      deprecationReason =
        deprecationReason !== undefined && deprecationReason.length > 0
          ? deprecationReason
          : "";
      this.printOnNewline(
        swift`@available(*, deprecated, message: ${SwiftSource.string(
          deprecationReason,
          true
        )})`
      );
    }
  }
  namespaceDeclaration(namespace, closure) {
    if (namespace) {
      this.printNewlineIfNeeded();
      this.printOnNewline(SwiftSource.raw`/// ${namespace} namespace`);
      this.printOnNewline(swift`public enum ${namespace}`);
      this.pushScope({ typeName: namespace });
      this.withinBlock(closure);
      this.popScope();
    } else {
      if (closure) {
        closure();
      }
    }
  }
  namespaceExtensionDeclaration(namespace, closure) {
    if (namespace) {
      this.printNewlineIfNeeded();
      this.printOnNewline(SwiftSource.raw`/// ${namespace} namespace`);
      this.printOnNewline(swift`public extension ${namespace}`);
      this.pushScope({ typeName: namespace });
      this.withinBlock(closure);
      this.popScope();
    } else {
      if (closure) {
        closure();
      }
    }
  }
  classDeclaration(
    { className, modifiers, superClass, adoptedProtocols = [] },
    closure
  ) {
    this.printNewlineIfNeeded();
    this.printOnNewline(
      (
        wrap(
          swift``,
          new SwiftSource(printing_1.join(modifiers, " ")),
          swift` `
        ) || swift``
      ).concat(swift`class ${className}`)
    );
    this.print(
      wrap(
        swift`: `,
        join(
          [
            superClass !== undefined
              ? SwiftSource.identifier(superClass)
              : undefined,
            ...adoptedProtocols.map(SwiftSource.identifier)
          ],
          ", "
        )
      )
    );
    this.pushScope({ typeName: className });
    this.withinBlock(closure);
    this.popScope();
  }
  structDeclaration(
    { structName, description, adoptedProtocols = [], namespace = undefined },
    outputIndividualFiles,
    closure
  ) {
    this.printNewlineIfNeeded();
    this.comment(description);
    const isRedundant =
      adoptedProtocols.includes("GraphQLFragment") &&
      !!namespace &&
      outputIndividualFiles;
    const modifier = new SwiftSource(isRedundant ? "" : "public ");
    this.printOnNewline(swift`${modifier}struct ${structName}`);
    this.print(
      wrap(swift`: `, join(adoptedProtocols.map(SwiftSource.identifier), ", "))
    );
    this.pushScope({ typeName: structName });
    this.withinBlock(closure);
    this.popScope();
  }
  propertyDeclaration({ propertyName, typeName, description }) {
    this.comment(description);
    this.printOnNewline(swift`public var ${propertyName}: ${typeName}`);
  }
  propertyDeclarations(properties) {
    if (!properties) return;
    properties.forEach(property => this.propertyDeclaration(property));
  }
  protocolDeclaration({ protocolName, adoptedProtocols }, closure) {
    this.printNewlineIfNeeded();
    this.printOnNewline(swift`public protocol ${protocolName}`);
    this.print(
      wrap(
        swift`: `,
        join(
          adoptedProtocols !== undefined
            ? adoptedProtocols.map(SwiftSource.identifier)
            : undefined,
          ", "
        )
      )
    );
    this.pushScope({ typeName: protocolName });
    this.withinBlock(closure);
    this.popScope();
  }
  protocolPropertyDeclaration({ propertyName, typeName }) {
    this.printOnNewline(swift`var ${propertyName}: ${typeName} { get }`);
  }
  protocolPropertyDeclarations(properties) {
    if (!properties) return;
    properties.forEach(property => this.protocolPropertyDeclaration(property));
  }
}
exports.SwiftGenerator = SwiftGenerator;
//# sourceMappingURL=language.js.map