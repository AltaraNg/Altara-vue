<template>
  <transition name="fade">
    <div>
      <recommender-informal> </recommender-informal>
    </div>
  </transition>
</template>

<script>
  import RecommenderInformal from "../../../components/RecommenderInformal.vue";
  export default {
    components: { RecommenderInformal },
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
