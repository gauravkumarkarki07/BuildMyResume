import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "vitest.config.ts",
  ]),

  // -----------------------------------------------------------------------
  // Custom stricter rules
  // -----------------------------------------------------------------------
  {
    plugins: {
      import: importPlugin,
      "unused-imports": unusedImports,
    },
    rules: {
      // --- Unused imports (auto-fixable) ---
      "unused-imports/no-unused-imports": "warn",

      // --- Import hygiene ---
      "import/no-duplicates": "warn",
      "import/first": "warn",
      "import/newline-after-import": "warn",

      // --- TypeScript strictness ---
      "@typescript-eslint/no-explicit-any": "warn",
      "prefer-const": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // --- General quality ---
      eqeqeq: ["error", "always"],
      "no-var": "error",
      "no-throw-literal": "error",
    },
  },
]);

export default eslintConfig;
