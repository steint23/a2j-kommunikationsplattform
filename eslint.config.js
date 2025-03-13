import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  react.configs.flat.recommended, // This is not a plugin object, but a shareable config object
  react.configs.flat["jsx-runtime"], // Add this if you are using React 17+
  {
    ignores: ["**/*", "!app/**", "!tests/**"],
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react,
    },
    settings: {
      react: { version: "detect" },
    },
    languageOptions: {
      parser: tseslint.parser,
    },
  },
);
