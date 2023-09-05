<template>
  <figure id="burst-12">
    <p class="percent text-sm">{{ percent }}% off</p>
  </figure>
</template>

<script>
  export default {
    props: {
      percent: {
        type: Number || String,
      },
    },
  };
</script>

<style scoped>
  .percent {
    position: absolute;
    z-index: 100;
    color: white;
    top: 0.8px;
    font-size: 12px;
    line-height: 13px;
  }
  #burst-12 {
    background: #456173;
    width: 29px;
    height: 29px;
    position: relative;
    text-align: center;
    align-self: center;
  }
  #burst-12:before,
  #burst-12:after {
    content: "";
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    height: 29px;
    width: 29px;
    background: #456173;
  }
  #burst-12:before {
    transform: rotate(30deg);
  }
  #burst-12:after {
    transform: rotate(60deg);
  }
</style>
