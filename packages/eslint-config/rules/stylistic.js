import stylistic from "@stylistic/eslint-plugin";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    ...stylistic.configs.recommended,
    rules: {
      ...stylistic.configs.recommended.rules,
      "@stylistic/operator-linebreak": "off",
      "@stylistic/member-delimiter-style": ["error", {
        multiline: {
          delimiter: "semi",
        },
        singleline: {
          delimiter: "semi",
        },
      }],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": ["error", "always"],
    },
  }];
