<template>
    <div class="mt-5 attendance-head row bg-default">
        <div class="form-check form-check-radio form-check-inline col-2 " v-for="option in options" :key="option.name">
            <label class="form-check-label text-lg" >
            <input class="form-check-input " type="radio" :checked="option.name === 'Old records'" name="inlineRadioOptions" id="inlineRadio1" value="option1" @change="$emit('selected', option)"> {{option.name}}
            <!-- <span class="form-check-sign px-5"></span> -->
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
label{
    font-size: 14px;
}

</style>