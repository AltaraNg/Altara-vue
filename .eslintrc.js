module.exports = {
   root: true,
   env: {
      node: true,
      // Remove this if you're not using jQuery
      jquery: true,
   },
   extends: ["plugin:prettier/recommended", "plugin:vue/essential", "eslint:recommended"],
   plugins: ["prettier"],
   parser: "vue-eslint-parser",
   parserOptions: {
      parser: "@babel/eslint-parser",
   },
   rules: {
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      "vue/no-deprecated-filter": "off",
      "vue/no-deprecated-v-on-native-modifier": "off",
      "no-unsafe-negation": "off",
      "vue/multi-word-component-names": "off",
      "vue/no-mutating-props": "off",
      "no-unsafe-optional-chaining": "off",
      "no-prototype-builtins": "off",
      "vue/require-prop-type-constructor": "off",
      "vue/no-deprecated-slot-attribute": "off",
      // Remove other duplicates or unneeded rules
   },
};
