module.exports = {
  parser: "typescript",
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    "^@nestjs/(.*)$",
    '^@/(.*)$',
    '<THIRD_PARTY_MODULES>',
    '^src/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
  singleQuote: true
};
