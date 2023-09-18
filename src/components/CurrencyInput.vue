<template>
  <div>
    <input
      :value="formattedValue"
      @input="$emit('input', $event.target.value)"
      placeholder="NGN 0.00"
    />
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue"

export default {
  name: "FormatCurrency",
  props: {
    value: Number,
  },
  setup(props) {
    const formattedValue = ref("")
    const inputRef = ref(null)

    return { inputRef, formattedValue }
  },
}
</script>

<style scoped>
input {
  border: none;
  outline: none; 
  color: black;
}
</style>
