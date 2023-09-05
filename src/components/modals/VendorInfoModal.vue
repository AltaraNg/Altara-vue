<template>
  <div>
    <div class="modal-header py-2">
      <h4>Vendor Details</h4>
      <a
        aria-label="Close"
        class="close py-1"
        data-dismiss="modal"
        @click="closeModal"
      >
        <span aria-hidden="true" class="modal-close text-danger">
          <i class="fas fa-times"></i>
        </span>
      </a>
    </div>
    <div class="modal-body px-5">
      <div class="table-responsive">
        <table class="table table-bordered table-striped">
          <tbody>
            <tr>
              <th>Vendor Name</th>
              <td>
                {{ modalItem.full_name }}
              </td>
            </tr>
            <tr>
              <th>Vendor ID</th>
              <td>{{ modalItem.staff_id }}</td>
            </tr>
            <tr>
              <th>Vendor Number</th>
              <td>{{ modalItem.phone_number }}</td>
            </tr>

            <tr>
              <th>Email</th>
              <td>{{ modalItem.email }}</td>
            </tr>
            <tr>
              <th>Date Registered</th>
              <td>{{ modalItem.date_of_appointment }}</td>
            </tr>

            <tr>
              <th>Address</th>
              <td>{{ `${modalItem.address}` }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="modal-footer justify-content-center"></div>
  </div>
</template>

<script>
  export default {
    props: {
      modalItem: {
        required: true,
      },
    },

    methods: {
      closeModal() {
        this.$emit("close");
      },
    },
  };
</script>

<style lang="scss" scoped></style>
