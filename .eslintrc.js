module.exports = {
    root: true,
    env: {
      node: true,
      jquery: true
    },
    extends: [
      'plugin:vue/vue3-essential',  // Use 'plugin:vue/essential' if using Vue 2
      'eslint:recommended',
    ],
    parser: "vue-eslint-parser",
    parserOptions: {
      // parser: 'babel-eslint'
      parser: "@babel/eslint-parser",
    },
    rules: {
      // Here you can add or overwrite rules as needed
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'vue/no-deprecated-filter': 'off',
      'vue/no-deprecated-v-on-native-modifier': 'off',
      'no-unsafe-negation': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-mutating-props': 'off',
      'no-unsafe-optional-chaining': 'off',
      'no-prototype-builtins': 'off',
      'vue/require-prop-type-constructor': 'off',
      ' vue/no-deprecated-slot-attribute': 'off',
      'vue/no-deprecated-slot-attribute': 'off',
    }
  };
  