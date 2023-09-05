<template>
  <div>
    <div class="modal-header py-2">
      <h4>Order Details</h4>
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
              <th>Order ID</th>
              <td>
                {{ modalItem.order_number }}
              </td>
            </tr>
            <tr>
              <th>Order Date</th>
              <td>
                {{ modalItem.order_date }}
              </td>
            </tr>
            <tr>
              <th>Price</th>
              <td>
                {{
                  Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "NGR",
                  }).format(modalItem.bnpl_vendor_product.price)
                }}
              </td>
            </tr>
            <tr>
              <th>Repayment Duration</th>
              <td>{{ modalItem.repayment_duration.split("_").join(" ") }}</td>
            </tr>
            <tr>
              <th>Repayment Cycle</th>
              <td>{{ modalItem.repayment_cycle }}</td>
            </tr>
            <tr>
              <th>Downpayment</th>
              <td>
                {{
                  Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "NGR",
                  }).format(modalItem.down_payment)
                }}
              </td>
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
    computed: {
      repDur() {
        return this.repaymentDuration.find((item) => {
          return item.id === this.modalItem.repayment_duration_id;
        }).value;
      },
      repCyc() {
        return this.repaymentCyclesopt.find((item) => {
          return item.id === this.modalItem.repayment_cycle_id;
        }).name;
      },
      downPay() {
        return this.downPaymentRates.find((item) => {
          return item.id === this.modalItem.down_payment_rate_id;
        }).percent;
      },
    },
  };
</script>

<style lang="scss" scoped></style>
