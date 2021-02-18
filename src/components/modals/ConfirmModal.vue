<template>
    <div id="changeCustomerManagerModal" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                
                <div class="modal-body" id="index" >
                    <p class="text-center">Are you sure?</p>
                    <div class="row text-center">
                    <div class="form-group clearfix col">
                        <button class="btn bg-default" @click="$emit('touched', true)">Yes</button>
                    </div>
                    <div class="form-group clearfix col">
                        <button class="btn bg-info" @click="$emit('touched', false)">No</button>
                    </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            show: {
                type: Boolean,
                default: false,
                required:false
            }
        },  
        
        methods: {
            handleModalToggle() {
                
                $("#changeCustomerManagerModal").modal("toggle");
            },
        },
        watch: {
            show() {
                this.handleModalToggle();
            
            }
        }
    }
</script>

<style scoped>

</style>