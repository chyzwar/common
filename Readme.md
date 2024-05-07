# Common

Collection of useful packages that I am using in my side projects.

## @chyzwar/tsconfig

### Installation

```sh
yarn add "@chyzwar/tsconfig
```

### Usage

Extend preset:

```json
{
  "extends": "@chyzwar/tsconfig/lib.json", 
  "compilerOptions": {
    "outDir": "lib",
    "rootDir": "src",
    "tsBuildInfoFile": "./lib/buildInfo.json"
  },
  "include": [
    "src/**/*"
  ]
}
```

## @chyzwar/eslint-config

Strict preset for eslint. Intention is to include plugin dependacies and make it easy manage configs in one place. It support number of sub-presets:

- node
- react

### Installation

```sh
yarn add eslint @chyzwar/eslint-config
```

### Examples

Example of usage in eslint.cjs

```js
module.exports = {
  extends: "@hyper/eslint-config/node",
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
};
```

## @chyzwar/runner

It is tool inspired by grunt/gulp and docker-compose
runner makes possible to define tasks as serial or parallel sequences

### Instalation

yarn add @chyzwar/runner

### Examples

Example of config file runner.config.js

```js
import {spawnTask, dockerTask, parallelTask, seriesTask} from "@hyper/runner";

spawnTask("build:watch", 
  "yarn", ["build:watch"], 
);

spawnTask("start:ui", 
  "yarn", ["start"], 
  {
    cwd: "./packages/ui"
  }
);
spawnTask("build:ui", 
  "yarn", ["build"], 
  {
    cwd: "./packages/ui"
  }
);

spawnTask("start:api", 
  "yarn", ["start"], 
  {
    cwd: "./packages/api"
  }
);
spawnTask("build:api", 
  "yarn", ["build"], 
  {
    cwd: "./packages/api"
  }
);

dockerTask("postgres", "postgres", {
  interactive: true,
  rm: true,
  name: "PostgresDB",
  ports: [
    "5434:5432"
  ],
  env: {
    POSTGRES_PASSWORD: "postgres",
  },
});


seriesTask("start:prod", ["build:api", "build:ui", "start:api:prod"])
parallelTask("start", [
  "build:watch", 
  "postgres", 
  "start:api", 
  "start:ui"
])
```
