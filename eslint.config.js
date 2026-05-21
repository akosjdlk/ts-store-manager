import js from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";
import eslintComments from "eslint-plugin-eslint-comments";
import sonarjs from "eslint-plugin-sonarjs";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: [
      "dist",
      "node_modules",
      "coverage",

      "eslint.config.js",

      "*.config.js",
      "*.config.cjs",
      "*.config.mjs",
      "*.config.ts",
    ],
  },

  js.configs.recommended,

  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  sonarjs.configs.recommended,

  prettier,

  {
    files: ["**/*.ts", "**/*.tsx"],

    plugins: {
      import: importPlugin,
      "unused-imports": unusedImports,
      "eslint-comments": eslintComments,
    },

    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      /*
       * GENERAL
       */

      curly: ["error", "all"],
      eqeqeq: ["error", "always"],
      "no-console": "warn",
      "no-debugger": "error",
      "sonarjs/todo-tag": "warn",

      /*
       * TYPESCRIPT
       */

      "@typescript-eslint/array-type": [
        "error",
        {
          default: "array-simple",
        },
      ],

      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],

      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],

      "@typescript-eslint/explicit-function-return-type": "error",

      "@typescript-eslint/no-explicit-any": "error",

      "@typescript-eslint/no-floating-promises": "error",

      "@typescript-eslint/no-misused-promises": "error",

      "@typescript-eslint/no-non-null-assertion": "error",

      "@typescript-eslint/no-unnecessary-condition": "error",

      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",

      "@typescript-eslint/require-await": "error",

      "@typescript-eslint/switch-exhaustiveness-check": "error",

      /*
       * IMPORTS
       */

      "import/first": "error",

      "import/newline-after-import": [
        "error",
        {
          count: 1,
        },
      ],

      "import/no-duplicates": "error",

      "import/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },

          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],

          "newlines-between": "always",
        },
      ],

      /*
       * UNUSED IMPORTS
       */

      "unused-imports/no-unused-imports": "error",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      /*
       * ESLINT COMMENTS
       */

      "eslint-comments/no-unused-disable": "error",
    },
  },
);
