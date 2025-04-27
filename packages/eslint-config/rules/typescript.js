export default [{
  rules: {
    /**
     * I prefer to annotate catch error type
     * @see https://typescript-eslint.io/rules/use-unknown-in-catch-callback-variable/
     */
    "@typescript-eslint/use-unknown-in-catch-callback-variable": "off",
    /**
     * @see https://typescript-eslint.io/rules/consistent-type-exports
     */
    "@typescript-eslint/consistent-type-exports": "error",

    /**
     * @see https://typescript-eslint.io/rules/consistent-type-imports
     */
    "@typescript-eslint/consistent-type-imports": "error",

    /**
     * Good rule but do not play nicely with Promises
     * @see https://github.com/typescript-eslint/typescript-eslint/issues/1956
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/v2.30.0/packages/eslint-plugin/docs/rules/no-invalid-void-type.md
     */
    "@typescript-eslint/no-invalid-void-type": ["off"],

    /**
     * I prefer to group function by usage
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/member-ordering.md
     */
    "@typescript-eslint/member-ordering": ["off"],

    /**
     * Just add line noise
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/v4.15.2/packages/eslint-plugin/docs/rules/lines-between-class-members.md
     */
    "@typescript-eslint/lines-between-class-members": ["off"],

    /**
     * Stupid
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-readonly-parameter-types.md
     */
    "@typescript-eslint/prefer-readonly-parameter-types": ["off"],

    /**
     * Reconsider this in later date. This is needed for generic stuff when interface do not work
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/consistent-type-definitions.md
     */
    "@typescript-eslint/consistent-type-definitions": ["off"],

    /**
     * Just make things more verbose
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/generic-type-naming.md
     */
    "@typescript-eslint/generic-type-naming": ["off"],

    /**
     * It is common to use undefined and null as falsy
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/strict-boolean-expressions.md
     */
    "@typescript-eslint/strict-boolean-expressions": ["off"],

    /**
     * Silly
     * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-enum-initializers.md
     */
    "@typescript-eslint/prefer-enum-initializers": ["off"],

    /**
     * Lets discuss this on PR
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-magic-numbers.md
     */
    "@typescript-eslint/no-magic-numbers": ["off"],

    /**
     * Promise callbacks make sense
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/unbound-method.md
     */
    "@typescript-eslint/unbound-method": ["error", {
      ignoreStatic: true,
    }],

    /**
     * Allow for arrow functions to omit annotation
     *
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/typedef.md
     */
    "@typescript-eslint/typedef": ["error", {
      arrowParameter: false,
    }],

    /**
     * Allow for any in rest params
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-explicit-any.md
     */
    "@typescript-eslint/no-explicit-any": ["error", {
      fixToUnknown: true,
      ignoreRestArgs: true,
    }],

    /**
     * Allow for boolean and number in template literal
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/restrict-template-expressions.md
     */
    "@typescript-eslint/restrict-template-expressions": ["error", {
      allowNumber: true,
      allowBoolean: true,
    }],

    /**
     * Allow for type aliases only in unions
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-type-alias.md
     */
    "@typescript-eslint/no-type-alias": ["error", {
      allowAliases: "always",
      allowCallbacks: "always",
      allowLiterals: "always",
      allowTupleTypes: "always",
      allowGenerics: "always",
    }],

    /**
     * Allow for PascalCase, camelCase and UPPER_CASE
     * Revisit in the future UPPER_CASE
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md
     */
    "@typescript-eslint/naming-convention": ["error",
      {
        selector: "variable",
        format: ["camelCase", "PascalCase", "UPPER_CASE"],
      },
    ],

    /**
     * Allow typedefs
     * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md
     */
    "@typescript-eslint/no-use-before-define": ["error", {
      typedefs: false,
    }],

    "@typescript-eslint/no-shadow": ["error", {
      ignoreTypeValueShadow: true,
      ignoreFunctionTypeParameterNameValueShadow: true,
    }],
    /**
     * Maximum number params to functions
     * @see https://typescript-eslint.io/rules/max-params/
     */
    "@typescript-eslint/max-params": ["error", { max: 5 }],

    /**
     * Disable module boundaries, this is not gradual enough
     * Ideally we could lint for exports on package level and not on module
     */
    "@typescript-eslint/explicit-module-boundary-types": ["off"],
    /**
     * Do not force return type of simple functions that can be inferred
     */
    "@typescript-eslint/explicit-function-return-type": ["error", {
      allowFunctionsWithoutTypeParameters: true,
    }],

    /**
     * Allow unsafe type assertions
     * @see https://typescript-eslint.io/rules/no-unsafe-type-assertion/
     */
    "@typescript-eslint/no-unsafe-type-assertion": ["off"],

    /**
     * Typescript config covert this with "noImplicitReturns": true,
     *
     * @see https://typescript-eslint.io/rules/consistent-return
     */
    "@typescript-eslint/consistent-return": ["off"],

    /**
     * No longer needed as TSC checks this
     * https://typescript-eslint.io/rules/no-redeclare/
     */
    "@typescript-eslint/no-redeclare": ["off"],
  },
}];
