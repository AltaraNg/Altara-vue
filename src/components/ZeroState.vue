<template>
    <div class="row items-center justify-center bg-white rounded-lg py-4">
        <div class="col justify-items-center text-center box w-2/3 sm:w-1/2 md:w-5/12 lg:w-1/3">
            <slot name="image" class="col"></slot>
            <p class="text-base font-semibold h2 text-lg col">{{ title }}</p>
            <p class="text-center text-sm font-medium col" >{{ message }}</p>
        </div>
    </div>
</template>
<script>
export default {
    name: "ZeroState",
    props: {
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
};
</script>