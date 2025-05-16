# @chyzwar/eslint-config

Strict preset for eslint. Intention is to include plugin dependacies and make it easy manage configs in one place. It support number of sub-presets:

- node
- react

## Instalation

```sh
yarn add eslint @chyzwar/eslint-config
```

## Examples

Example of usage in eslint.cjs

```js
module.exports = {
  extends: "@chyzwar/eslint-config/node",
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
};
```
