import {
  spawnTask,
  dockerTask,
  parallelTask,
  seriesTask,
} from "@chyzwar/runner";

spawnTask("build:watch",
  "yarn", ["build:watch"],
);

spawnTask("start:ui",
  "yarn", ["start"],
  {
    cwd: "./packages/ui",
  },
);
spawnTask("build:ui",
  "yarn", ["build"],
  {
    cwd: "./packages/ui",
  },
);

spawnTask("start:api",
  "yarn", ["start"],
  {
    cwd: "./packages/api",
  },
);
spawnTask("build:api",
  "yarn", ["build"],
  {
    cwd: "./packages/api",
  },
);

dockerTask("postgres", "postgres", {
  interactive: true,
  rm: true,
  name: "PostgresDB",
  ports: [
    "5434:5432",
  ],
  env: {
    POSTGRES_PASSWORD: "postgres",
  },
});

seriesTask("start:prod", ["build:api", "build:ui", "start:api:prod"]);
parallelTask("start", [
  "build:watch",
  "postgres",
  "start:api",
  "start:ui",
]);
