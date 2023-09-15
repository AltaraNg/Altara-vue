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
/* Remove the border */
input {
  border: none;
  outline: none; /* Remove the blue outline on focus */
}
</style>
