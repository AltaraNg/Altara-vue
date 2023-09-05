<template>
  <div>
    <p class="text-center">There are no {{ name | capitalize }} available!!</p>
  </div>
</template>

<script>
  export default {
    props: {
      name: {
        type: String,
        required: true,
      },
    },
  };
</script>

<style scoped></style>
