module.exports = {
  extends: 'erb',
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': 'off',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-import-module-exports': 'off',
    'global-require': 'off',
    'promise/always-return': 'off',
    'no-console': 'off',
    'import/prefer-default-export': 'off',
    'no-shadow': 'off',
    'no-unused-vars': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'import/no-named-as-default': 'off',
    'react/jsx-no-constructed-context-values': 'off',
    'react/require-default-props': 'off',
    'react/function-component-definition': 'off',
    'react/no-unstable-nested-components': 'off',
    'class-methods-use-this': 'off',
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
        semi: false,
      },
    ],
    'promise/catch-or-return': 'off',
    'compat/compat': 'off',
    'react/jsx-props-no-spreading': 'off',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  settings: {
    'import/resolver': {
      node: {},
      typescript: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
}
