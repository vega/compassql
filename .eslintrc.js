module.exports = {
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint",
    "jest",
    "prettier"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:jest/style",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  "overrides": [
    {
      "files": [
        "*.ts"
      ]
    }
  ],
  "env": {
    "browser": true,
    "node": true
  },
  "parserOptions": {
    "project": "tsconfig.json",
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "rules": {
    "prettier/prettier": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/ban-types": "warn",
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/no-for-in-array": "error",
    "@typescript-eslint/no-require-imports": "error",
    "@typescript-eslint/no-parameter-properties": "off",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": "warn",
    "@typescript-eslint/no-object-literal-type-assertion": "off",
    "@typescript-eslint/no-namespace": "warn",
    "linebreak-style": [
      "error",
      "unix"
    ],
    "no-irregular-whitespace": [
      "error",
      {
        "skipComments": true
      }
    ],
    "no-alert": "error",
    "prefer-const": "error",
    "no-return-assign": "error",
    "no-useless-call": "error",
    "no-useless-concat": "error",
    "no-console": "off",
    "no-undef": "off",
    "no-unreachable": "off",
    "no-prototype-builtins": "warn",
    "no-case-declarations": "warn",
    "@typescript-eslint/prefer-as-const": "warn",
    "@typescript-eslint/triple-slash-reference": "warn",
    "jest/no-export": "warn",
    "jest/no-identical-title": "warn",
    "jest/valid-title": "warn"
  }
};