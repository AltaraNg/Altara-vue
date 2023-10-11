<template>
    <input type="number" v-bind="$attrs" :value="value" @input="updateValue" />
</template>

<script>
export default {
    model: {
        prop: "value",
        event: "input",
    },
    props: {
        value: {
            default: 0,
        },
    },
    methods: {
        updateValue(event) {
            this.$emit("input", event.target.value);
        },
    },
};
</script>
