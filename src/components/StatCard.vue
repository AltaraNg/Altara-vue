<template>
    <div class="card">
        <div class="card-header">header</div>
        <div class="card-body">Body</div>        
    </div>
</template>

<script>
    export default {
        name: 'StatCard',
        props:{
            stat: {
                type: Object,
                required: true
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>