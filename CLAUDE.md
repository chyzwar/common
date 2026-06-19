# CLAUDE.md

Guidance for agents working in this repository.

## What this is

`@chyzwar/common` — a private Yarn 4 (workspaces) + Lerna-Lite monorepo of reusable, npm-published
dev configs and tooling. ESM-only (`"type": "module"`), Node > 22, TypeScript 6, ESLint 10, Vitest 4.

Changes here ship to **every downstream consumer** (e.g. the Sancho monorepo pins
`@chyzwar/eslint-config`, `@chyzwar/runner`, `@chyzwar/tsconfig`). Treat rule/config changes as
quasi-breaking: land them deliberately and release a new version via Lerna so consumers opt in.

## Packages (`packages/*`)

- `@chyzwar/eslint-config` — flat ESLint config. Entry points `./node` and `./react`; rule overrides
  live in `packages/eslint-config/rules/*.js` (`typescript.js`, `eslint.js`, `stylistic.js`,
  `esm.js`, `jest.js`). Layered on top of `eslint.configs.recommended` + `typescript-eslint`
  (`all` + `strictTypeChecked`), then the local `rules/` overrides win.
- `@chyzwar/biome-config` — shared Biome config.
- `@chyzwar/tsconfig` — shared `tsconfig` bases.
- `@chyzwar/runner` — task runner (the one Sancho's `runner.config.ts` drives via `bun`).
- `@chyzwar/sea` — Node.js SEA (single-executable) builder.

## Commands

```bash
yarn install
yarn lint        # eslint . --cache  (the repo dogfoods @chyzwar/eslint-config)
yarn lint:fix
yarn build       # tsc --build (TS packages; eslint-config's .js rule files need no build)
yarn test        # vitest --run
yarn lerna ...   # versioning / publish via lerna-lite
```

Conventional commits enforced (commitlint + husky pre-commit `lint-staged`).

## ESLint philosophy: truthy/falsy over defensive null checks

The config deliberately favors concise truthy/falsy expressions. To change this, edit
`packages/eslint-config/rules/typescript.js`:

- `@typescript-eslint/strict-boolean-expressions`: **`["error", { allowNullableBoolean,
  allowNullableString, allowNullableNumber, allowNullableEnum: true }]`** — nullable
  string/number/boolean/enum stay falsy-friendly (no verbose guards), but always-truthy conditions
  (bare object, array, `Promise` → forgot `await`, function → forgot `()`) and `any`/`unknown` are
  still flagged — those are virtually always bugs.
- `@typescript-eslint/prefer-nullish-coalescing`: **`["error", { ignoreTernaryTests: true }]`** —
  allows `a ? a : b` / `!x ? y : x` truthy-falsy conditionals while still flagging `||` that should
  be `??`.

Net effect: truthy/falsy tests on nullable and primitive values are free (`if (value)`, `a ? a : b`,
`a ?? b`); the linter only pushes back on conditions that are always true (bare object / array /
Promise / function) or untyped (`any` / `unknown`) — i.e. a forgotten `await` / `()` / `.length`.
