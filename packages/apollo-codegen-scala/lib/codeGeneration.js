"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const graphql_2 = require("apollo-codegen-core/lib/utilities/graphql");
const printing_1 = require("apollo-codegen-core/lib/utilities/printing");
const language_1 = require("./language");
const naming_1 = require("./naming");
const values_1 = require("./values");
const types_1 = require("./types");
const CodeGenerator_1 = __importDefault(
  require("apollo-codegen-core/lib/utilities/CodeGenerator")
);
function generateSource(context) {
  const generator = new CodeGenerator_1.default(context);
  generator.printOnNewline(
    "//  This file was automatically generated and should not be edited."
  );
  generator.printNewline();
  if (context.options.namespace) {
    language_1.packageDeclaration(generator, context.options.namespace);
  }
  context.typesUsed.forEach(type => {
    typeDeclarationForGraphQLType(generator, type);
  });
  Object.values(context.operations).forEach(operation => {
    classDeclarationForOperation(generator, operation);
  });
  Object.values(context.fragments).forEach(fragment => {
    traitDeclarationForFragment(generator, fragment);
  });
  return generator.output;
}
exports.generateSource = generateSource;
function classDeclarationForOperation(
  generator,
  {
    operationName,
    operationType,
    rootType,
    variables,
    fields,
    inlineFragments,
    fragmentSpreads,
    fragmentsReferenced,
    source,
    operationId
  }
) {
  let objectName;
  let protocol;
  switch (operationType) {
    case "query":
      objectName = `${naming_1.operationClassName(operationName)}Query`;
      protocol = "com.apollographql.scalajs.GraphQLQuery";
      break;
    case "mutation":
      objectName = `${naming_1.operationClassName(operationName)}Mutation`;
      protocol = "com.apollographql.scalajs.GraphQLMutation";
      break;
    default:
      throw new graphql_1.GraphQLError(
        `Unsupported operation type "${operationType}"`
      );
  }
  language_1.objectDeclaration(
    generator,
    {
      objectName,
      superclass: protocol
    },
    () => {
      if (source) {
        generator.printOnNewline("val operationString =");
        generator.withIndent(() => {
          values_1.multilineString(generator, source);
        });
      }
      if (operationId) {
        operationIdentifier(generator, operationId);
      }
      if (fragmentsReferenced && fragmentsReferenced.length > 0) {
        generator.printNewlineIfNeeded();
        generator.printOnNewline(
          "val requestString: String = { operationString"
        );
        fragmentsReferenced.forEach(fragment => {
          generator.print(
            ` + ${naming_1.traitNameForFragmentName(fragment)}.fragmentString`
          );
        });
        generator.print(" }");
        generator.printOnNewline(
          "val operation = com.apollographql.scalajs.gql(requestString)"
        );
      } else {
        generator.printOnNewline(
          "val operation = com.apollographql.scalajs.gql(operationString)"
        );
      }
      generator.printNewlineIfNeeded();
      if (variables && variables.length > 0) {
        const properties = variables.map(({ name, type }) => {
          const propertyName = language_1.escapeIdentifierIfNeeded(name);
          const typeName = types_1.typeNameFromGraphQLType(
            generator.context,
            type,
            undefined,
            undefined,
            true
          );
          const isOptional = !graphql_1.isNonNullType(type);
          return { name, propertyName, type, typeName, isOptional };
        });
        dataContainerDeclaration(generator, {
          name: "Variables",
          properties
        });
      } else {
        generator.printOnNewline("type Variables = Unit");
      }
      traitDeclarationForSelectionSet(generator, {
        traitName: "Data",
        parentType: rootType,
        fields,
        inlineFragments,
        fragmentSpreads
      });
    }
  );
}
exports.classDeclarationForOperation = classDeclarationForOperation;
function traitDeclarationForFragment(
  generator,
  {
    fragmentName,
    typeCondition,
    fields,
    inlineFragments,
    fragmentSpreads,
    source
  }
) {
  const traitName = naming_1.traitNameForFragmentName(fragmentName);
  traitDeclarationForSelectionSet(
    generator,
    {
      traitName,
      parentType: typeCondition,
      fields,
      inlineFragments,
      fragmentSpreads
    },
    () => {
      if (source) {
        generator.printOnNewline("val fragmentString =");
        generator.withIndent(() => {
          values_1.multilineString(generator, source);
        });
      }
    }
  );
}
exports.traitDeclarationForFragment = traitDeclarationForFragment;
function traitDeclarationForSelectionSet(
  generator,
  {
    traitName,
    parentType,
    fields,
    inlineFragments,
    fragmentSpreads,
    viewableAs,
    parentFragments
  },
  objectClosure
) {
  const possibleTypes = parentType
    ? types_1.possibleTypesForType(generator.context, parentType)
    : null;
  const properties = fields
    .map(field =>
      naming_1.propertyFromLegacyField(generator.context, field, traitName)
    )
    .filter(field => field.propertyName != "__typename");
  const fragmentSpreadSuperClasses = (fragmentSpreads || []).filter(spread => {
    const fragment = generator.context.fragments[spread];
    const alwaysDefined = graphql_2.isTypeProperSuperTypeOf(
      generator.context.schema,
      fragment.typeCondition,
      parentType
    );
    return alwaysDefined;
  });
  if (inlineFragments && inlineFragments.length > 0) {
    inlineFragments.forEach(inlineFragment => {
      traitDeclarationForSelectionSet(generator, {
        traitName: naming_1.traitNameForInlineFragment(inlineFragment),
        parentType: inlineFragment.typeCondition,
        fields: inlineFragment.fields,
        fragmentSpreads: inlineFragment.fragmentSpreads,
        viewableAs: {
          traitName,
          properties
        }
      });
    });
  }
  dataContainerDeclaration(generator, {
    name: traitName,
    properties,
    extraSuperClasses: [
      ...(viewableAs ? [viewableAs.traitName] : []),
      ...(fragmentSpreadSuperClasses || []),
      ...(parentFragments || [])
    ],
    insideCompanion: () => {
      if (possibleTypes) {
        generator.printNewlineIfNeeded();
        generator.printOnNewline("val possibleTypes = scala.collection.Set(");
        generator.print(
          printing_1.join(
            Array.from(possibleTypes).map(type => `"${String(type)}"`),
            ", "
          )
        );
        generator.print(")");
      }
      generator.printNewlineIfNeeded();
      generator.printOnNewline(
        `implicit class ViewExtensions(private val orig: ${traitName}) extends AnyVal`
      );
      generator.withinBlock(() => {
        if (inlineFragments && inlineFragments.length > 0) {
          inlineFragments.forEach(inlineFragment => {
            const fragClass = naming_1.traitNameForInlineFragment(
              inlineFragment
            );
            generator.printOnNewline(`def as${inlineFragment.typeCondition}`);
            generator.print(`: Option[${fragClass}] =`);
            generator.withinBlock(() => {
              generator.printOnNewline(
                `if (${fragClass}.possibleTypes.contains(orig.asInstanceOf[scala.scalajs.js.Dynamic].__typename.asInstanceOf[String])) Some(orig.asInstanceOf[${fragClass}]) else None`
              );
            });
          });
        }
        if (fragmentSpreads) {
          fragmentSpreads.forEach(s => {
            const fragment = generator.context.fragments[s];
            const alwaysDefined = graphql_2.isTypeProperSuperTypeOf(
              generator.context.schema,
              fragment.typeCondition,
              parentType
            );
            if (!alwaysDefined) {
              generator.printOnNewline(`def as${s}`);
              generator.print(`: Option[${s}] =`);
              generator.withinBlock(() => {
                generator.printOnNewline(
                  `if (${s}.possibleTypes.contains(orig.asInstanceOf[scala.scalajs.js.Dynamic].__typename.asInstanceOf[String])) Some(orig.asInstanceOf[${s}]) else None`
                );
              });
            }
          });
        }
      });
      const fragments = (fragmentSpreads || []).map(
        f => generator.context.fragments[f]
      );
      fields
        .filter(field =>
          graphql_1.isCompositeType(graphql_1.getNamedType(field.type))
        )
        .forEach(field => {
          traitDeclarationForSelectionSet(generator, {
            traitName: naming_1.traitNameForPropertyName(field.responseName),
            parentType: graphql_1.getNamedType(field.type),
            fields: field.fields || [],
            inlineFragments: field.inlineFragments,
            fragmentSpreads: field.fragmentSpreads,
            parentFragments: fragments
              .filter(f => {
                return f.fields.some(o => field.responseName == o.responseName);
              })
              .map(f => {
                return (
                  naming_1.traitNameForFragmentName(f.fragmentName) +
                  "." +
                  naming_1.traitNameForPropertyName(field.responseName)
                );
              })
          });
        });
      if (objectClosure) {
        objectClosure();
      }
    }
  });
}
exports.traitDeclarationForSelectionSet = traitDeclarationForSelectionSet;
function operationIdentifier(generator, operationId) {
  if (!generator.context.options.generateOperationIds) {
    return;
  }
  generator.printNewlineIfNeeded();
  generator.printOnNewline(
    `val operationIdentifier: String = "${operationId}"`
  );
}
function typeDeclarationForGraphQLType(generator, type) {
  if (graphql_1.isEnumType(type)) {
    enumerationDeclaration(generator, type);
  } else if (graphql_1.isInputObjectType(type)) {
    traitDeclarationForInputObjectType(generator, type);
  }
}
exports.typeDeclarationForGraphQLType = typeDeclarationForGraphQLType;
function enumerationDeclaration(generator, type) {
  const { name, description } = type;
  const values = type.getValues();
  generator.printNewlineIfNeeded();
  language_1.comment(generator, description || "");
  generator.printOnNewline(`object ${name}`);
  generator.withinBlock(() => {
    values.forEach(value => {
      language_1.comment(generator, value.description || "");
      generator.printOnNewline(
        `val ${language_1.escapeIdentifierIfNeeded(
          naming_1.enumCaseName(value.name)
        )} = "${value.value}"`
      );
    });
  });
  generator.printNewline();
}
function traitDeclarationForInputObjectType(generator, type) {
  const { name, description } = type;
  const fields = Object.values(type.getFields());
  const properties = fields.map(field =>
    naming_1.propertyFromInputField(
      generator.context,
      field,
      generator.context.options.namespace
    )
  );
  dataContainerDeclaration(generator, {
    name,
    properties,
    description: description || undefined
  });
}
function dataContainerDeclaration(
  generator,
  { name, properties, extraSuperClasses, description, insideCompanion }
) {
  language_1.traitDeclaration(
    generator,
    {
      traitName: name,
      superclasses: ["scala.scalajs.js.Object", ...(extraSuperClasses || [])],
      annotations: ["scala.scalajs.js.native"],
      description: description || undefined
    },
    () => {
      properties.forEach(p => {
        language_1.propertyDeclaration(generator, {
          jsName: p.name || p.responseName,
          propertyName: p.propertyName,
          typeName: p.typeName
        });
      });
    }
  );
  language_1.objectDeclaration(
    generator,
    {
      objectName: name
    },
    () => {
      language_1.methodDeclaration(
        generator,
        {
          methodName: "apply",
          params: properties.map(p => {
            return {
              name: p.propertyName,
              type: p.typeName,
              defaultValue: p.isOptional
                ? "com.apollographql.scalajs.OptionalValue.empty"
                : ""
            };
          })
        },
        () => {
          const propertiesIn = properties
            .map(p => `"${p.name || p.responseName}" -> ${p.propertyName}`)
            .join(", ");
          generator.printOnNewline(
            `scala.scalajs.js.Dynamic.literal(${propertiesIn}).asInstanceOf[${name}]`
          );
        }
      );
      language_1.methodDeclaration(
        generator,
        {
          methodName: "unapply",
          params: [
            {
              name: "value",
              type: name
            }
          ]
        },
        () => {
          const propertiesExtracted = properties
            .map(p => `value.${p.propertyName}`)
            .join(", ");
          generator.printOnNewline(`Some((${propertiesExtracted}))`);
        }
      );
      generator.printNewlineIfNeeded();
      generator.printOnNewline(
        `implicit class CopyExtensions(private val orig: ${name}) extends AnyVal`
      );
      generator.withinBlock(() => {
        language_1.methodDeclaration(
          generator,
          {
            methodName: "copy",
            params: properties.map(p => {
              return {
                name: p.propertyName,
                type: p.typeName,
                defaultValue: `orig.${p.propertyName}`
              };
            })
          },
          () => {
            const propertiesIn = properties
              .map(p => `"${p.name || p.responseName}" -> ${p.propertyName}`)
              .join(", ");
            generator.printOnNewline(
              `scala.scalajs.js.Dynamic.literal(${propertiesIn}).asInstanceOf[${name}]`
            );
          }
        );
      });
      if (insideCompanion) {
        insideCompanion();
      }
    }
  );
}
//# sourceMappingURL=codeGeneration.js.map