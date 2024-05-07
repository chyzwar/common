import eslint from "@eslint/js";
import tsEslint from "typescript-eslint";
import typescript from "./rules/typescript.js";
import jest from "./rules/jest.js";
import esm from "./rules/esm.js";
import globals from "globals";

export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.all,
  ...tsEslint.configs.strictTypeChecked, 
  ...typescript,
  ...jest,
  ...esm, 
  {
    files: [
      "**/*.js", 
      "**/*.cjs",
      "**/*.mjs",
      
      "**/drizzle.config.ts",
      "**/runner.config.ts",
      "**/vite.config.ts",
      "**/vitest.setup.ts",
      "**/vitest.config.ts",

      "deployer.config.ts",
      "vitest.workspace.ts",
    ],
    ...tsEslint.configs.disableTypeChecked,
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  }
);