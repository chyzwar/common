import nodeConfig from "@chyzwar/eslint-config/node";
import tsEslint from "typescript-eslint";

export default [
  ...nodeConfig,
  {
    ignores: ["**/dist/", "**/lib/", "packages/sea/bin/", "node_modules/"],
  },
  {
    files: ["packages/*/examples/**/*.{ts,tsx}"],
    ...tsEslint.configs.disableTypeChecked,
  },
  {
    files: ["packages/*/src/**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: [
          "./packages/*/tsconfig.json",
        ],
      },
    },
  },
];
