<template>
    <div class="card pb-0 pt-2 p-4 hover-zoom hover-shadow" > 
            <slot name="svg" ></slot>
            <div class="h5 mt-3  text-black-50" style="font-weight:900; color:black;">{{stat}}</div>
            <p class="mb-0">{{label}}</p>
           
    </div>
</template>

<script>
    export default {
        name: 'StatCard',
        props:{
            stat: {
                required: true
            },
           
            label: {
                type: String,
                required: false,
                default: 'Label'
            },
            source:{
                type: String,
                required: false,

            }
        },
  
    }
</script>

<style lang="scss" scoped>
    p{
        color: #084871;
    }
</style>