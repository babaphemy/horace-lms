import { dirname } from "path"
import { fileURLToPath } from "url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})
const eslintConfig = [
  {
    ignores: [
      "src/types",
      "src/types/**/*",
      "cypress/**",
      ".next",
      "cypress.config.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",

      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^React$|^_",
          ignoreRestSiblings: true,
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
]
// export default defineConfig([
//   {

//     languageOptions: {
//       parser: tsParser,
//     },

//     settings: {
//       "import/resolver": {
//         node: {
//           extensions: [".js", ".jsx", ".ts", ".tsx"],
//         },
//       },
//     },

//   },
// ])
export default eslintConfig
