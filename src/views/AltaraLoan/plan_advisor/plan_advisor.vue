<template>
    <transition name="fade">
        <div>
            <plan-advisor> </plan-advisor>
        </div>
    </transition>
</template>

<script>
import PlanAdvisor from '../../../components/PlanAdvisor.vue';
export default {
    components: {PlanAdvisor},
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