<template>
  <transition name="fade">
    <div>
      <credit-worthy> </credit-worthy>
    </div>
  </transition>
</template>

<script>
  import CreditWorthy from "../../../components/CreditWorthy";
  export default {
    components: { CreditWorthy },
    data() {
      return {};
    },
    methods: {},
    computed: {},
  };
</script>

<style scoped type="scss">
  .attendance-head .light-heading:nth-child(1) {
    max-width: 120px;
  }
</style>
