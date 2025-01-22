import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const noCheckAnyRule = {
  rules: {
    '@typescript-eslint/no-explicit-any': 'off'
  }
};

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  noCheckAnyRule,
];

export default eslintConfig;
