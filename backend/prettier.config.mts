export default {
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  useTabs: false,
  endOfLine: "lf",
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: [
    "^(aws-sdk|@aws-sdk)/(.*)$", // AWS imports first
    "^express$", // Express
    "^[./]", // Relative imports
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderSortByLength: "asc",
};
