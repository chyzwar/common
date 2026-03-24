# @chyzwar/runner

Simple task runner inspired by [just](https://github.com/microsoft/just) and [undertaker](https://github.com/gulpjs/undertaker).

## Installation

```sh
yarn add @chyzwar/runner
```

## Usage

Create a `runner.config.ts` (or `runner.config.js`) in your project root:

```ts
import { spawnTask, dockerTask, parallelTask, seriesTask, execTask, task } from "@chyzwar/runner";

spawnTask("start:api", "yarn", ["start"], {
  cwd: "./packages/api",
});

spawnTask("build:api", "yarn", ["build"], {
  cwd: "./packages/api",
});

dockerTask("postgres", "postgres", {
  interactive: true,
  rm: true,
  name: "PostgresDB",
  ports: ["5434:5432"],
  env: {
    POSTGRES_PASSWORD: "postgres",
  },
});

seriesTask("start:prod", ["build:api", "build:ui", "start:api"]);
parallelTask("start", ["postgres", "start:api", "start:ui"]);
```

Run a task:

```sh
runner start
```

## API

### `task(name, fn)`

Register a generic async/sync task function. Logs execution time automatically.

```ts
task("seed", async () => {
  await seedDatabase();
});
```

### `spawnTask(name, command, args?, options?)`

Spawn a child process. Output is color-coded per task.

Options extend Node.js `SpawnOptions` with:

- `debug` - print the full command before execution
- `logFile` - write stdout/stderr to a file

### `execTask(name, command, options?)`

Execute a shell command via `exec()`. Simpler than `spawnTask`, buffers output.

### `dockerTask(name, image, options?)`

Run a Docker container with extensive options:

| Option | Type | Description |
|--------|------|-------------|
| `rm` | `boolean` | Auto-remove container on exit |
| `interactive` | `boolean` | Keep STDIN open |
| `name` | `string` | Container name |
| `network` | `"bridge" \| "host"` | Network mode |
| `ports` | `string[]` | Port mappings (`"5434:5432"`) |
| `volumes` | `string[]` | Volume mounts |
| `mount` | `object[]` | Bind mounts (`{ type, src, dst }`) |
| `user` | `string` | UID/GID |
| `memory` | `number` | Memory limit |
| `env` | `Record<string, string>` | Environment variables |
| `debug` | `boolean` | Print full command |
| `logFile` | `string` | Log output to file |

### `seriesTask(name, tasks)`

Run tasks sequentially.

### `parallelTask(name, tasks)`

Run tasks in parallel.
