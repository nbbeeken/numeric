import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-plugin-prettier";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores(["**/out", "**/dist", "**/*.d.ts"]), {
    extends: compat.extends("plugin:prettier/recommended"),

    plugins: {
        prettier,
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 6,
        sourceType: "module",
    },

    rules: {
        "prettier/prettier": "error",
        "@typescript-eslint/naming-convention": "warn",
        // "@typescript-eslint/semi": "warn",
        curly: "warn",
        eqeqeq: ["warn", "smart"],
        "no-throw-literal": "warn",
        // semi: "off",
    },
}]);
