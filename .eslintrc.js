module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ["plugin:vue/essential", "eslint:recommended", "prettier"],
    plugins: ["prettier"],
    parser: "vue-eslint-parser",
    parserOptions: {
        parser: "@babel/eslint-parser",
    },
    rules: {
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        "vue/multi-word-component-names": "warn",
        "vue/no-mutating-props": "error",
    },
};
