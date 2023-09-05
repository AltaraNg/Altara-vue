<template>
  <span
    class="CustomSMSButton d-flex align-items-center justify-content-center pointer"
    @click="toggleModal('ShowPaystack')"
  >
    <img
      src="../../assets/paystack_edited.png"
      alt="paystack"
      width="12"
      height="12"
    />
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
