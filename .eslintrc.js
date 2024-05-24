module.exports = {
    root: true,
    extends: ['expo', 'prettier'],
    plugins: ['prettier'],
    rules: {
        'no-unused-vars': 'error',
        'no-duplicate-imports': 'error',
        'prettier/prettier': 'error',
    },
    ignorePatterns: ['*/schedules/*', '**/archive/**'],
};
