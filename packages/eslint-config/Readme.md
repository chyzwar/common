# @chyzwar/eslint-config

Strict ESLint configuration preset for TypeScript projects. Bundles plugin dependencies and manages configs in one place.

## Presets

- `@chyzwar/eslint-config/node` - Node.js applications
- `@chyzwar/eslint-config/react` - React applications

Both presets include:

- ESLint recommended rules
- TypeScript strict type-checked rules (`typescript-eslint`)
- Stylistic rules (`@stylistic/eslint-plugin`) - double quotes, semicolons
- Jest rules (`eslint-plugin-jest`)
- ESM enforcement (no `require`)
- Auto-disabled type checking for JS and common config files (drizzle, runner, vite, vitest)

## Installation

```sh
yarn add -D eslint @chyzwar/eslint-config
```

### Peer Dependencies

- `eslint@^10.0.0`
- `typescript@^6.0.0`

## Usage

### Node.js

```js
// eslint.config.js
import node from "@chyzwar/eslint-config/node";

export default [
  ...node,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
```

### React

```js
// eslint.config.js
import react from "@chyzwar/eslint-config/react";

export default [
  ...react,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
```
