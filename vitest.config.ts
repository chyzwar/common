import { defineProject } from "vitest/config";

const projects = [
  "runner",
];

export default defineProject({
  test: {
    projects: projects.map((name) => {
      return {
        extends: `./packages/${name}/vitest.config.ts`,
        test: {
          root: `./packages/${name}/`,
          name,
          include: [
            "src/**/*.test.ts",
            "src/**/*.test.tsx",
          ],
        },
      };
    }),
  },
});
