export default [{
  rules: {
  /**
   * Rules disabled in favour of typescript-eslint
   */
    "indent": "off",
    "brace-style": "off",
    "no-unused-vars": "off",
    "space-before-function-paren": "off",
    "no-use-before-define": "off",
    "quotes": "off",
    "semi": "off",
    "no-shadow": "off",
    "comma-dangle": "off",
    "max-params": "off",
    "lines-between-class-members": "off",

    "no-console": "warn",
    "space-before-blocks": ["error", {
      functions: "always",
      keywords: "always",
      classes: "always",
    }],
    "keyword-spacing": [
      "error", { before: true },
    ],
  } }];
