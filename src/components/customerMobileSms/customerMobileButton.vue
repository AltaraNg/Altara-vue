<template>
  <span
    class="mobileMessageButton d-flex align-items-center justify-content-center"
    @click="toggleModal('mobileMessageModal')"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16px"
      height="16px"
      fill="currentColor"
      viewBox="0 0 512 512"
      class="icon"
    >
      <!--! Font Awesome Pro 6.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
      <path
        d="M511.1 63.1v287.1c0 35.25-28.75 63.1-64 63.1h-144l-124.9 93.68c-7.875 5.75-19.12 .0497-19.12-9.7v-83.98h-96c-35.25 0-64-28.75-64-63.1V63.1c0-35.25 28.75-63.1 64-63.1h384C483.2 0 511.1 28.75 511.1 63.1z"
      />
    </svg>
  </span>
</template>

<script>
  import { EventBus } from "../../utilities/event-bus";

  export default {
    props: {
      order: { default: null },
      customer: { default: null },
    },

    methods: {
      toggleModal(modalName) {
        EventBus.$emit(modalName, {
          order: this.order,
          customer: this.customer,
        });
      },
    },
  };
</script>

<style scoped>
  .mobileMessageButton {
    height: 4rem;
    line-height: 4rem;
    width: 4rem;
    color: #c8e6c9;
    border-radius: 50%;
    text-align: center;
    margin: 1rem auto;
    background-color: #4caf50;
  }

  .mobileMessageButton:hover {
    background-color: #c8e6c9;
    color: #4caf50;
    -webkit-box-shadow:
      0 5px 9px rgba(0, 0, 0, 0.05),
      0 2px 2px rgba(0, 0, 0, 0.1);
    box-shadow:
      0 5px 9px rgba(0, 0, 0, 0.05),
      0 2px 2px rgba(0, 0, 0, 0.1);
  }
</style>
