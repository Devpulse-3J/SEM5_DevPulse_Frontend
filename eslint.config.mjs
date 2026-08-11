import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  prettier,
  globalIgnores([
    ".next/**",
    "**/.next/**",
    "node_modules/**",
    "**/node_modules/**",
    "web-app-source-code/**",
    "dist/**",
    "build/**",
  ]),
]);
