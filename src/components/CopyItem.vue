<template>
    <div>
        <!-- Your item content -->
        <span @click="copyItem">
            <i class="icon-copy" aria-label="Copy item" style="color:black"></i>
        </span>
    </div>
</template>

<script>
export default {
    props:{
        item:{
            required: true,
            type: String
        }
    },
    methods: {
     copyItem() {
            
            navigator.clipboard.writeText(this.item)
                .then(() => {
                    alert("Item copied to clipboard!");
                })
                .catch((error) => {
                    console.error("Copy failed:", error);
                    alert("Copy failed. Please try again.");
                });
        },
    },
};
</script>

<style>
/* Style your icon as needed */
.icon-copy {
    cursor: pointer;
    /* Add your icon styles here */
}
</style>
