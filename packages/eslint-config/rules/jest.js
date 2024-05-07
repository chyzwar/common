import jest from "eslint-plugin-jest";

export default [
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    ...jest.configs["flat/recommended"],
    settings: {
      "jest": {
        "version": "latest",
      },
    },
    rules: {
      ...jest.configs["flat/recommended"].rules,
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
    },
  }];