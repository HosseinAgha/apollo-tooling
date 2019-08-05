import { translate } from "..";
import { typeCheck } from "./codegen-test-utils";

// Warning: jest@<24.9.0 is has messed up matchInlineSnapshot such that any time a snapshot is updated, all the others will drift over
// Keep an eye out for drift before committing.

describe("typescript - non-federated schemas", () => {
  it("translates basic object types", async () => {
    const typeDefs = `#graphql
      type Query {
        me: User
      }

      type User {
        firstName: String
        lastName: String!
        age: Int
      }
    `;

    const resolvers = `const r: Resolvers<{/*Context*/ getID: (i: number) => number }, {/* internalReps*/ Query: {root: number}, User: {id: number} }> = {
      Query: {
        me({root}, {}, {getID}) {
          const id: number = getID(root)
          return {id} as User
        }
      },
      User: {
        firstName({id}, {}, {getID}) {
          return 10 // err
        }
      }
    }`;

    const diagnostics = await typeCheck(typeDefs, resolvers);
    expect(diagnostics).toMatchInlineSnapshot(`
      Array [
        "Type '{ firstName({ id }: { id: number; }, {}: {}, { getID }: { getID: (i: number) => number; }): number; }' is not assignable to type 'UserResolver<{ getID: (i: number) => number; }, { Query: { root: number; }; User: { id: number; }; }, {}>'.Types of property 'firstName' are incompatible.Type '({ id }: { id: number; }, {}: {}, { getID }: { getID: (i: number) => number; }) => number' is not assignable to type '(parent: { id: number; }, args: {}, context: { getID: (i: number) => number; }, info: any) => PromiseOrValue<string | null | undefined>'.Type 'number' is not assignable to type 'PromiseOrValue<string | null | undefined>'.The expected type comes from property 'User' which is declared here on type 'Resolvers<{ getID: (i: number) => number; }, { Query: { root: number; }; User: { id: number; }; }, {}>'",
      ]
    `);
  });

  it("translates nonnulls and lists into ts equivalent", async () => {
    const typeDefs = `#graphql
      type Query {
        base: Int
        nonNull: Int!
        list: [Int]
        nonNullList: [Int]!
        listNonNull: [Int!]
        nonNullListNonNull: [Int!]!
      }
    `;

    const nullResolvers = `const r: Resolvers = {
      Query: {
        base: () => null, // ok
        nonNull: () => null, // err
        list: () => null, // ok
        nonNullList: () => null, // err
        listNonNull: () => null, // ok
        nonNullListNonNull: () => null, // err
      }
    }`;
    expect(await typeCheck(typeDefs, nullResolvers)).toMatchInlineSnapshot(`
            Array [
              "Type 'null' is not assignable to type 'PromiseOrValue<number>'.The expected type comes from the return type of this signature.",
              "Type 'null' is not assignable to type 'PromiseOrValue<(number | null | undefined)[]>'.The expected type comes from the return type of this signature.",
              "Type 'null' is not assignable to type 'PromiseOrValue<number[]>'.The expected type comes from the return type of this signature.",
            ]
        `);

    const listNullResolvers = `const r: Resolvers = {
      Query: {
        list: () => [null], // ok
        nonNullList: () => [null], // ok
        listNonNull: () => [null], // err
        nonNullListNonNull: () => [null], // err
      }
    }`;
    expect(await typeCheck(typeDefs, listNullResolvers)).toMatchInlineSnapshot(`
            Array [
              "Type 'null[]' is not assignable to type 'PromiseOrValue<Nullable<number[]>>'.Type 'null[]' is not assignable to type 'number[]'.Type 'null' is not assignable to type 'number'.The expected type comes from the return type of this signature.",
              "Type 'null[]' is not assignable to type 'PromiseOrValue<number[]>'.Type 'null[]' is not assignable to type 'number[]'.The expected type comes from the return type of this signature.",
            ]
        `);
  });

  it("translates descriptions into TSDoc", () => {
    const typeDefs = `#graphql
      """
      This it the base type
      """
      type Query {
        """
        Current User
        """
        me(
          """
          Authorization
          """
          token: String
          """
          Also auth
          """
          other: String
        ): String
      }
    `;
    expect(translate(typeDefs, "typescript")).toMatchInlineSnapshot(`
      "// This is a machine generated file.
      // Use \\"apollo service:codegen\\" to regenerate.
      type PromiseOrValue<T> = Promise<T> | T
      type Nullable<T> = T | null | undefined
      type Index<Map extends Record<string, any>, Key extends string, Else = unknown> = Map[Key] extends object ? Map[Key] : Else

      export interface Resolvers<TContext = {}, TInternalReps = {}, TScalarAndEnumInternalValues = {}> {
      Query: QueryResolver<TContext, TInternalReps, TScalarAndEnumInternalValues>
      }

      type QueryRepresentation<TInternalReps extends Record<string, any>> = Index<TInternalReps, \\"Query\\">
      /**
       * This it the base type
       */
      export interface QueryResolver<TContext = {}, TInternalReps = {}, TScalarAndEnumInternalValues = {}> {
      /**
       * Current User
       */
      me: (parent: QueryRepresentation<TInternalReps>, args: {/**
       * Authorization
       */
      token?: string
      /**
       * Also auth
       */
      other?: string}, context: TContext, info: any) => PromiseOrValue<Nullable<string>>
      }
      "
    `);
  });

  describe("enums", () => {
    it("translates enums", async () => {
      const typeDefs = `#graphql
            type Query {
              favoriteColor: AllowedColor # As a return value
              avatar(borderColor: AllowedColor): AllowedColor # As an argument
            }

            enum AllowedColor {
              RED
              GREEN
              BLUE
            }
          `;
      const resolvers = `const r: QueryResolver = {favoriteColor() {return 'RED'}, avatar(_, {borderColor}) { let a: 'PINK' = borderColor; return a } }`;
      const diagnostics = await typeCheck(typeDefs, resolvers);
      expect(diagnostics).toMatchInlineSnapshot(`
        Array [
          "An index signature parameter type cannot be a union type. Consider using a mapped object type instead.",
          "Type '(_: unknown, { borderColor }: { borderColor?: \\"RED\\" | \\"GREEN\\" | \\"BLUE\\" | undefined; }) => \\"PINK\\"' is not assignable to type '(parent: unknown, args: { borderColor?: \\"RED\\" | \\"GREEN\\" | \\"BLUE\\" | undefined; }, context: {}, info: any) => PromiseOrValue<Nullable<AllowedColorExternal>>'.Type '\\"PINK\\"' is not assignable to type 'PromiseOrValue<Nullable<AllowedColorExternal>>'.The expected type comes from property 'avatar' which is declared here on type 'QueryResolver<{}, {}, {}>'",
          "Type '\\"RED\\" | \\"GREEN\\" | \\"BLUE\\" | undefined' is not assignable to type '\\"PINK\\"'.Type 'undefined' is not assignable to type '\\"PINK\\"'.",
        ]
      `);
    });

    // TODO when enums are better defined
    it.skip("translates enums to `any` when __experimentalInternalEnum support is enabled", () => {
      const typeDefs = `#graphql
            type Query {
              favoriteColor: AllowedColor # As a return value
              avatar(borderColor: AllowedColor): String # As an argument
            }

            enum AllowedColor {
              RED
              GREEN
              BLUE
            }
          `;

      const typings = translate(typeDefs, "typescript", {
        __experimentalInternalEnumValueSupport: true
      });

      expect(typings).toEqual(
        expect.stringContaining("export type AllowedColor = any")
      );
      expect(typings).toEqual(
        expect.stringContaining(
          `export type AllowedColorExternal = "RED" | "GREEN" | "BLUE"`
        )
      );
      expect(typings).toEqual(
        expect.stringContaining(
          `AllowedColor: { [external: AllowedColorExternal]: any }`
        )
      );
      expect(typings).toEqual(
        expect.stringContaining(`borderColor?: AllowedColor`)
      );
      expect(typings).toEqual(
        expect.stringContaining(` => PromiseOrValue<Nullable<AllowedColor>>`)
      );
    });
  });

  it("translates input object types", async () => {
    const typeDefs = `#graphql

      input Auth {
        provider: String!
        token: String!
      }

      type Query {
        me(auth: Auth!): Int!
      }
    `;

    const resolvers = `const r: Resolvers = {
      Query: {
        me(_, {auth: {provider, token}}) {
          let a: number = provider // err
          return 9
        }
      }
    }`;

    const diagnostics = await typeCheck(typeDefs, resolvers);
    expect(diagnostics).toMatchInlineSnapshot(`
            Array [
              "Type 'string' is not assignable to type 'number'.",
            ]
        `);
  });

  // TODO when scalars are better defined
  it.skip("translates custom scalars", () => {
    const typeDefs = `#graphql
      scalar JSON

      type Query {
        me(auth: JSON): JSON
      }
    `;

    const typings = translate(typeDefs, "typescript");

    expect(typings).toEqual(expect.stringContaining("JSON: any"));
    expect(typings).toEqual(expect.stringContaining("export type JSON = any"));
    expect(typings).toEqual(expect.stringContaining("auth?: JSON"));
    expect(typings).toEqual(
      expect.stringContaining("=> PromiseOrValue<Nullable<JSON>>")
    );
  });

  it("translates with differently named root operations", async () => {
    const typeDefs = `#graphql
      schema {
        query: RQuery
      }

      type RQuery {
        field: Int!
      }

      type Query {
        field: Int!
      }
    `;

    const resolvers = `const r: Resolvers = {
      Query: {},
      RQuery: {} // err, in root types all properties must be defined
    }`;

    const diagnostics = await typeCheck(typeDefs, resolvers);
    expect(diagnostics).toMatchInlineSnapshot(`
      Array [
        "Property 'field' is missing in type '{}' but required in type 'RQueryResolver<{}, {}, {}>'.'field' is declared here.,The expected type comes from property 'RQuery' which is declared here on type 'Resolvers<{}, {}, {}>'",
      ]
    `);
  });

  it("translates interfaces", async () => {
    const typeDefs = `#graphql
      type Query {
        nameables: Named!
      }

      interface Named {
        name: String!
      }
    `;

    const resolvers = `const r: Resolvers = {
      Query: {
        nameables() {
          return {name: 9} // err, but I actually don't know if it should be... I guess that's what TInternalReps is for.
        }
      }
    }`;

    const diagnostics = await typeCheck(typeDefs, resolvers);
    expect(diagnostics).toMatchInlineSnapshot(`
      Array [
        "Type '() => { name: number; }' is not assignable to type '(parent: unknown, args: {}, context: {}, info: any) => PromiseOrValue<Named>'.Type '{ name: number; }' is not assignable to type 'PromiseOrValue<Named>'.Type '{ name: number; }' is not assignable to type 'Named'.Types of property 'name' are incompatible.Type 'number' is not assignable to type 'string | undefined'.The expected type comes from property 'nameables' which is declared here on type 'QueryResolver<{}, {}, {}>'",
      ]
    `);
  });

  it("understands default values", async () => {
    const typeDefs = `#graphql

      type Query {
        defaulted(arg: Int = 5): Int!
        normal(arg: Int): Int!
      }
    `;

    const resolvers = `const r: Resolvers = {
      Query: {
        defaulted: (_, {arg}) => arg,
        normal: (_, {arg}) => arg // err, arg is possibly undefined
      },
    }`;

    const diagnostics = await typeCheck(typeDefs, resolvers);
    expect(diagnostics).toMatchInlineSnapshot(`
            Array [
              "Type 'number | undefined' is not assignable to type 'PromiseOrValue<number>'.Type 'undefined' is not assignable to type 'PromiseOrValue<number>'.The expected type comes from the return type of this signature.",
            ]
        `);
  });
});