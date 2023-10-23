## @chyzwar/tsconfig

### Instalation
```
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