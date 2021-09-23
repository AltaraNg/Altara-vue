<template>
  <div class="my-3 py-4" v-if="reports !== null">
    <div class="mx-3 my-3 py-4 row">
      <h3 class="text-capitalize col-2 float-left">dashboard</h3>
      <div class="w-100 float-right text-right col-10 row mr-0">
        <button
          class="bg-default rounded w-25 h3 float-left fbutton"
          @click="exportReportCsv"
        >
          <i class="fas fa-download mr-3"></i>Download
        </button>
        <div class="row">
          <date-picker
            class="col mr-0"
            v-model="fromDate"
            valueType="format"
            placeholder="From Date"
          ></date-picker>

          <date-picker
            class="col ml-0"
            v-model="toDate"
            valueType="format"
            placeholder="To Date"
          ></date-picker>
          <div class="col">
            <select
              name="business_type"
              class="custom-select"
              v-model="businessType"
            >
              <option :value="''" selected>All Products</option>
              <option
                :value="type.id"
                :key="type.id"
                v-for="type in businessTypes"
              >
                {{ type.name }}
              </option>
            </select>
          </div>

          <div class="col">
            <select name="order_type" class="custom-select" v-model="orderType">
              <option :value="''" selected>All Order Types</option>
              <option
                :value="type.id"
                :key="type.id"
                v-for="type in orderTypes"
              >
                {{ type.name }}
              </option>
            </select>
          </div>

          <div class="col">
            <select
              class="custom-select"
              v-model="sector"
              v-validate="'required'"
            >
              <option value="">All Sectors</option>
              <option :value="'formal'">Formal</option>
              <option :value="'informal'">Informal</option>
            </select>
          </div>
          <button
            class="bg-default rounded w-25 h3 col-4"
            @click="filterByDate"
          >
            Filter
          </button>
        </div>
      </div>
    </div>
    <div class="row my-3 mx-2" v-if="reports !== null">
      <stat-card
        :stat="reports.meta.total_no_sales"
        class="col mx-4 w-50"
        :label="'Total Number of Sales'"
      >
        <template v-slot:svg> <Sales /> </template>
      </stat-card>
      <stat-card
        :stat="'₦' + reports.meta.revenue_per_sale"
        class="col mx-4 w-50"
        :icon="'fas fa-dolly-flatbed'"
        :label="'Revenue per Sale'"
      >
        <template v-slot:svg> <Revenue /> </template>
      </stat-card>
      <stat-card
        :stat="'₦' + reports.meta.total_revenue"
        class="col mx-4 w-50"
        :label="'Total Revenue'"
        :icon="'fas fa-dolly-flatbed'"
      >
        <template v-slot:svg> <Total /> </template>
      </stat-card>
    </div>

    <div class="my-3 ml-5 pl-2 row w-100 text-center ml-2">
      <div class="card col-6 m-2" v-if="reports !== null">
        <bar-chart
          :chart-data="barData"
          :options="option"
          v-if="loaded"
        ></bar-chart>
      </div>
      <div class="col-md-offset-2"></div>

      <div class="card col-5 ml-5 m-2 text-right" v-if="reports !== null">
        <pie-chart
          :chart-data="pieData"
          :options="option"
          v-if="loaded"
          class=""
        ></pie-chart>
      </div>
    </div>
    <div class="my-4 mx-3 w-100 pt-3">
      <!-- table -->
      <div class="mx-auto my-auto w-100 text-center">
        <h4 class="my-3 font-weight-bold h4"><u>Showroom Statistics</u></h4>
      </div>
      <div class="ml-4 mr-5 mt-3 bg-white shadow">
        <table class="table table-responsive table-striped w-100">
          <thead>
            <tr>
              <th
                v-for="(header, index) in tableHeaders"
                class="font-weight-bolder h5 text-center"
                :key="index"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody v-if="reports !== null">
            <tr
              v-for="(branch, index) in branchesInfo"
              :key="index"
              class="text-center"
            >
              <td>{{ index + 1 }}</td>
              <td class="font-weight-bold">{{ branch.branch_name }}</td>
              <td>{{ branch.total_potential_revenue_sold_per_showroom }}</td>
              <td>{{ branch.number_of_sales }}</td>
              <td>{{ branch.forecast.toFixed(2) }}</td>
              <td>{{ branch.no_of_altara_pay }}</td>
              <td>{{ branch.no_of_altara_cash }}</td>
              <td>{{ branch.avg_price_of_prod_per_showroom }}</td>
              <td>{{ branch.percentage_of_total_revenues }}</td>
              <td>{{ branch.percentage_downpayment }}</td>
            </tr>

            <tr class="text-center text-lg font-weight-bold h6 divider">
              <td colspan="2" class="text-center">Total</td>
              <td class="">{{ $formatCurrency(sums.totalRevenue) }}</td>
              <td>{{ sums.totalSales }}</td>
              <td>{{ sums.totalForecast.toFixed(2) }}</td>
              <td>{{ sums.totalAltPay }}</td>
              <td>{{ sums.totalAltCash }}</td>
              <td>{{ $formatCurrency(sums.totalAvePerProd) }}</td>
              <td>{{ sums.totalPercent }}</td>
              <td>{{ sums.averageDownPayment  }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import StatCard from "../../components/StatCard.vue";
import { get, byMethod } from "../../utilities/api";
import Sales from "../../assets/css/svgs/sales.vue";
import Revenue from "../../assets/css/svgs/revenue.vue";
import Total from "../../assets/css/svgs/total.vue";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import BarChart from "../../components/charts/BarChart.vue";
import PieChart from "../../components/charts/PieChart.vue";

export default {
  components: {
    StatCard,
    DatePicker,
    BarChart,
    PieChart,
    Sales,
    Revenue,
    Total,
  },
  data() {
    return {
      reports: null,
      fromDate: "",
      toDate: "",
      query: {},
      businessType: "",
      orderType: "",
      sector: "",
      branchesInfo: {},
      orderTypes: {},

      apiUrls: {
        getReports: "/api/order/reports",
        exportReport: "/api/order/reports/export",
        businessTypes: "/api/business_type",
        orderTypes: "/api/order-types",
      },
      tableHeaders: [
        "S/N",
        "Branch",
        "Revenue (₦)",
        "No. of Sales",
        "Forecast",
        "Altara Pay",
        "Altara Cash",
        "Average Price/Product (₦)",
        "% Total Rev.",
        "Average Down Payment",
      ],
      barData: null,
      pieData: null,
      option: {
        responsive: true,
        maintainAspectRatio: false,
      },
      loaded: false,
      sums: {},
      businessTypes: {},
    };
  },
  async mounted() {
    var date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth();
    var firstDay = new Date(y, m, 2).toISOString();
    this.fromDate = firstDay.slice(0, 10);
    await this.getReport();
    this.getPieChartData();
    this.getBarChartData();
    this.getBusinessTypes();
    this.getOrderTypes();
    this.loaded = true;
  },

  methods: {
    getBarChartData() {
      this.barData = {
        labels: this.getBranchLabel(),
        datasets: [
          {
            barPercentage: 1,
            barThickness: 12,
            maxBarThickness: 16,
            label: "Number of sales",
            data: this.getSalesPerBranch(),
            backgroundColor: [
              "#e76f51",
              "#457b9d",
              "#cb997e",
              "#4361ee",
              "#00f5d4",
              "#333d29",
              "#9b5de5",
              "#22223b",
              "#55a630",
              "#973aa8",
              "#cb997e",
              "#ff0a54",
              "#b392ac",
              "#355070",
              "#be0aff",
            ],
            borderColor: [
              "#e76f51",
              "#457b9d",
              "#cb997e",
              "#4361ee",
              "#00f5d4",
              "#333d29",
              "#9b5de5",
              "#22223b",
              "#55a630",
              "#973aa8",
              "#cb997e",
              "#ff0a54",
              "#b392ac",
              "#355070",
              "#be0aff",
            ],
            borderWidth: 1,
          },
        ],
      };
    },

    getPieChartData() {
      this.pieData = {
        labels: ["Altara Cash", "Altara Pay"],
        datasets: [
          {
            barPercentage: 1,
            barThickness: 12,
            maxBarThickness: 16,
            data: this.getPieData(),
            backgroundColor: ["#023e8a", "#CC5A71"],
          },
        ],
      };
    },
    async getReport() {
      this.$LIPS(true);
      this.query.fromDate = this.fromDate;
      this.query.toDate = this.toDate;
      this.query.businessType = this.businessType;
      this.query.sector = this.sector;
      this.query.orderType = this.orderType;
      try {
        const report = await byMethod(
          "GET",
          this.apiUrls.getReports,
          {},
          this.query
        );
        this.reports = report.data.data;
        this.branchesInfo = Object.values(
          this.reports.meta.groupedDataByBranch
        );
        this.branchesInfo.sort((a, b) => {
          if (a.branch_name < b.branch_name) {
            return -1;
          }
          if (a.branch_name > b.branch_name) {
            return 1;
          }
          return 0;
        });

        this.getSums(this.reports.meta.groupedDataByBranch);
      } catch (err) {
      } finally {
        this.$LIPS(false);
      }
    },

    getSums(dataArray) {
      this.sums.totalSales = 0;
      this.sums.totalRevenue = 0;
      this.sums.totalAltPay = 0;
      this.sums.totalAltCash = 0;
      this.sums.totalAvePerProd = 0;
      this.sums.totalPercent = 0;
      this.sums.totalForecast = 0;
      this.sums.averageDownPayment = 0;
     
      for (let index = 0; index < dataArray.length; index++) {
        this.sums.totalSales += Number(dataArray[index].number_of_sales);
        this.sums.totalRevenue += parseFloat(
          dataArray[index].total_potential_revenue_sold_per_showroom.replace(
            /,/g,
            ""
          )
        );
        this.sums.totalAltPay += dataArray[index].no_of_altara_pay;
        this.sums.totalAltCash += dataArray[index].no_of_altara_cash;
        this.sums.totalAvePerProd += parseFloat(
          dataArray[index].avg_price_of_prod_per_showroom.replace(/,/g, "")
        );
        this.sums.totalPercent += Number(
          dataArray[index].percentage_of_total_revenues
        );
        this.sums.totalForecast += Number(dataArray[index].forecast);
        this.sums.averageDownPayment += Number(
          dataArray[index].percentage_downpayment
        );
      }
    },

    getBranchLabel() {
      const branches = Object.values(this.reports.meta.groupedDataByBranch);
      return branches.map((item) => {
        return item.branch_name;
      });
    },

    getPieData() {
      const businessType = this.reports.meta.altaraPayVersusAltaraCash;
      return [
        businessType.no_of_sales_altara_cash,
        businessType.no_of_sales_altara_pay,
      ];
    },

    getSalesPerBranch() {
      const branches = Object.values(this.reports.meta.groupedDataByBranch);
      return branches.map((item) => {
        return item.number_of_sales;
      });
    },

    async exportReportCsv() {
      this.$LIPS(true);
      try {
        const response = await byMethod(
          "GET",
          this.apiUrls.exportReport,
          {},
          this.query
        );
        let fileURL = window.URL.createObjectURL(new Blob([response.data]));
        let fileLink = document.createElement("a");
        fileLink.href = fileURL;
        fileLink.setAttribute("download", "file.csv");
        document.body.appendChild(fileLink);
        fileLink.click();
      } catch (error) {
        this.$displayErrorMessage(error);
      } finally {
        this.$LIPS(false);
      }
    },

    async filterByDate() {
      this.loaded = false;
      await this.getReport();
      this.getPieChartData();
      this.getBarChartData();
      this.loaded = true;
    },

    async getBusinessTypes() {
      try {
        const fetchBusinessTypes = await get(this.apiUrls.businessTypes);
        this.businessTypes = fetchBusinessTypes.data.data.data;
        // this.businessTypes = this.businessTypes.filter((item) => {
        //   return item.name.includes("Products");
        // });
      } catch (err) {
        this.$displayErrorMessage(err);
      }
    },

    async getOrderTypes() {
      try {
        const fetchOrderTypes = await get(this.apiUrls.orderTypes);
        this.orderTypes = fetchOrderTypes.data.orderTypes;
        // this.businessTypes = this.businessTypes.filter((item) => {
        //   return item.name.includes("Products");
        // });
      } catch (err) {
        this.$displayErrorMessage(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
button {
  max-height: 36px;
  max-width: 120px;
}
.fbutton {
  margin-right: 30px;
}
.custom-select {
  width: 125px;
}
.divider {
  width: 100%;
  border-top: 2px solid rgba(75, 85, 99, 0.54);
}
</style>
