<template>
    <transition name="fade">
        <div>
            <credit-worthy> </credit-worthy>
        </div>
    </transition>
</template>

<script>
import Lookup from "../lookup/lookup";
import CreditWorthy from "../../../components/CreditWorthy";
import Flash from "../../../utilities/flash";
export default {
    components: { Lookup, CreditWorthy },
    data() {
        return {};
    },
    methods: {},
    computed: {}
};
</script>

<style scoped type="scss">
.attendance-head .light-heading:nth-child(1) {
    max-width: 120px;
}
</style>