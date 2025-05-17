import { defineConfig } from "eslint/config"
import typescriptEslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default defineConfig([
  {
    ignores: [
      "src/types",
      "src/types/**/*",
      "cypress/**",
      ".next",
      "cypress.config.ts",
    ],
  },
  {
    extends: compat.extends("next/core-web-vitals", "prettier"),

    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      parser: tsParser,
    },

    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },

    rules: {
      "@typescript-eslint/no-explicit-any": "warn",

      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],

      "import/no-unresolved": [
        "error",
        {
          commonjs: true,
          caseSensitive: true,
        },
      ],

      "no-console": "error",
    },
  },
])
