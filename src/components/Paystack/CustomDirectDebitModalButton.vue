<template>
    <span class="CustomSMSButton d-flex align-items-center justify-content-center pointer" @click="toggleModal('CustomDirectDebitModal')">
         <i class="fas fa-wallet"></i>
    </span>
</template>

<script>
    import {EventBus} from "../../utilities/event-bus";

    export default {

        props: {
            order: {default: null},
            customer: {default: null}
        },

        methods: {
            toggleModal(modalName) {
                EventBus.$emit(modalName, {order: this.order, customer: this.customer});
            }
        }
    };
</script>

