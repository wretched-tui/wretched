module.exports = {
    'env': {
        'browser': true,
        'es2021': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'plugins': [
        'unused-imports',
        '@typescript-eslint',
    ],
    "ignorePatterns": ["**/*.test.ts"],
    'rules': {
        'no-constant-condition': 'off',
        'no-debugger': 'off',
        'no-empty': 'off',
        'quotes': 'off',
        'indent': 'off',
        'unused-imports/no-unused-imports': 'error',
        // 'unused-imports/no-unused-vars': 'warn',
        "no-unused-vars": [
            "error", {
                "argsIgnorePattern": "^_",
                "varsIgnorePattern": "^_",
                "args": "after-used",
                "ignoreRestSiblings": false
            }
        ],
        '@typescript-eslint/no-extra-semi': 'off',
        '@typescript-eslint/no-this-alias': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'linebreak-style': [
            'error',
            'unix'
        ],
        'semi': [
            'error',
            'never'
        ]
    }
}
