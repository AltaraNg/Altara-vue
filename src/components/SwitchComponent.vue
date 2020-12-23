<template>
    <div class="mt-5 attendance-head row">
        <div class="form-check form-check-radio form-check-inline col-2">
            <label class="form-check-label" v-for="option in options">
            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" @change="$emit('selected', option)"> {{option.name}}
            <span class="form-check-sign"></span>
            </label>
        </div>


    </div>
</template>

<script>
    export default {
        props: {
            options: {
                type: Array,
                required: true
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>