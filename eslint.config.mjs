import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    {
        files: ["**/*.{js,ts}"],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            }
        },
        rules: {
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    selector: "variable",
                    modifiers: ["global"],
                    format: ["UPPER_CASE"],
                    leadingUnderscore: "allowSingleOrDouble",
                    trailingUnderscore: "allowSingleOrDouble"
                },
                {
                    selector: ["variable", "parameter", "property", "parameterProperty"],
                    format: ["snake_case"],
                    leadingUnderscore: "allowSingleOrDouble",
                    trailingUnderscore: "allowSingleOrDouble"
                },
                {
                    selector: ["variable", "parameter", "property", "parameterProperty"],
                    types: ["function"],
                    format: ["camelCase"],
                    leadingUnderscore: "allowSingleOrDouble",
                    trailingUnderscore: "allowSingleOrDouble"
                },
                {
                    selector: ["function", "method", "accessor"],
                    format: ["camelCase"],
                    leadingUnderscore: "allowSingleOrDouble",
                    trailingUnderscore: "allowSingleOrDouble"
                },
                {
                    selector: "typeLike",
                    format: ["PascalCase"],
                    leadingUnderscore: "allowSingleOrDouble",
                    trailingUnderscore: "allowSingleOrDouble"
                },
                {
                    selector: "enumMember",
                    format: ["UPPER_CASE"],
                    leadingUnderscore: "allowSingleOrDouble",
                    trailingUnderscore: "allowSingleOrDouble"
                },
                {
                    selector: "import",
                    format: ["UPPER_CASE", "camelCase", "PascalCase"],
                    leadingUnderscore: "allowSingleOrDouble",
                    trailingUnderscore: "allowSingleOrDouble"
                },
                {
                    selector: ["objectLiteralProperty"],
                    format: ["snake_case", "camelCase"],
                    leadingUnderscore: "allowSingleOrDouble",
                    trailingUnderscore: "allowSingleOrDouble"
                },
                {
                    selector: ["objectLiteralMethod"],
                    format: ["camelCase"],
                    leadingUnderscore: "allowSingleOrDouble",
                    trailingUnderscore: "allowSingleOrDouble"
                }
            ],
            '@typescript-eslint/no-unused-vars': [
                "error",
                {
                    args: "all",
                    argsIgnorePattern: "^_",
                    caughtErrors: "all",
                    caughtErrorsIgnorePattern: "^_",
                    destructuredArrayIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    ignoreRestSiblings: true
                }
            ]
        }
    },
    {
        files: ["**/*.js"],
        extends: [tseslint.configs.disableTypeChecked]
    }
);
