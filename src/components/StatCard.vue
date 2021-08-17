<template>
    <div class="card pb-0 pt-2 p-4">
       
          <div> <i :class="icon" class="bg-default"></i></div> 
          <div class="h5 mt-3">{{stat}}</div>
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
            icon: {
                type: String,
                required: true,
                default: 'fas fa-download mr-3'
            },
            label: {
                type: String,
                required: false,
                default: 'Label'
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>