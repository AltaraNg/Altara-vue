<template>
	<div class="my-3 py-4" v-if="reports !== null">
		<div class="mx-3 my-3 py-4 row">
			<h3 class="text-capitalize col">dashboard</h3>
			<div class="col float-right text-right row">
				<button class="bg-default rounded w-25 h3 col-4 fbutton" @click="exportReportCsv">
					<i class="fas fa-download mr-3"></i>Download
				</button>
                <div class="col-8 row">
				<date-picker
					class="col-4 w-100 mr-0"
					v-model="query.fromDate"
					valueType="format"
					placeholder="From Date"
				></date-picker>

				<date-picker
					class="col-4 w-100 ml-0"
					v-model="query.toDate"
					valueType="format"
					placeholder="To Date"
				></date-picker>
                <button class="bg-default rounded w-25 h3 col-4" @click="filterByDate">Filter</button>
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
			<div class=" mx-auto my-auto w-100 text-center">
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
							v-for="(branch, index) in reports.meta.groupedDataByBranch"
							:key="index" class="text-center"
						>
							<td>{{index+1}}</td>
							<td class="font-weight-bold">{{ branch.branch_name }}</td>
							<td>{{ branch.total_potential_revenue_sold_per_showroom }}</td>
							<td>{{ branch.number_of_sales }}</td>
							<td>{{ branch.no_of_altara_pay }}</td>
							<td>{{ branch.no_of_altara_cash }}</td>
							<td>{{ branch.avg_price_of_prod_per_showroom }}</td>
							<td>{{ branch.percentage_of_total_revenues }}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script>
	import StatCard from '../../components/StatCard.vue';
	import { get, byMethod } from '../../utilities/api';
	import Sales from '../../assets/css/svgs/sales.vue';
	import Revenue from '../../assets/css/svgs/revenue.vue';
	import Total from '../../assets/css/svgs/total.vue';
	import DatePicker from 'vue2-datepicker';
	import 'vue2-datepicker/index.css';
	import BarChart from '../../components/charts/BarChart.vue';
	import PieChart from '../../components/charts/PieChart.vue';

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
				query: {},
				apiUrls: {
					getReports: '/api/order/reports',
	                   exportReport: '/api/order/reports/export'
				},
				tableHeaders: [
					'S/N',
					'Branch',
					'Revenue (₦)',
					'No. of Sales',
					'Altara Pay',
					'Altara Cash',
					'Average Price/Product (₦)',
					'% Total Rev.',
				],
				barData: null,
	               pieData: null,
				option: {
					responsive: true,
					maintainAspectRatio: false,
				},
				loaded: false,
			};
		},
		async mounted() {
			await this.getReport();
            this.getPieChartData();			
            this.getBarChartData();	         
			this.loaded = true;
		},
		methods: {

            getBarChartData(){
                this.barData = {
				labels: this.getBranchLabel(),
				datasets: [
					{
						barPercentage: 1,
						barThickness: 12,
						maxBarThickness: 16,

						label: 'Number of sales',
						backgroundColor: '#f87979',
						data: this.getSalesPerBranch(),
						backgroundColor: [
							'rgba(255, 99, 132, 0.2)',
							'rgba(255, 159, 64, 0.2)',
							'rgba(255, 205, 86, 0.2)',
							'rgba(75, 192, 192, 0.2)',
							'rgba(255, 99, 132, 0.2)',
							'rgba(255, 159, 64, 0.2)',
							'rgba(255, 205, 86, 0.2)',
							'rgba(75, 192, 192, 0.2)',
							'rgba(255, 99, 132, 0.2)',
							'rgba(255, 159, 64, 0.2)',
							'rgba(255, 205, 86, 0.2)',
							'rgba(75, 192, 192, 0.2)',
							'rgba(255, 99, 132, 0.2)',
							'rgba(255, 159, 64, 0.2)',
							'rgba(255, 205, 86, 0.2)',
						],
						borderColor: [
							'rgb(255, 99, 132)',
							'rgb(255, 159, 64)',
							'rgb(255, 205, 86)',
							'rgb(75, 192, 192)',
							'rgb(255, 99, 132)',
							'rgb(255, 159, 64)',
							'rgb(255, 205, 86)',
							'rgb(75, 192, 192)',
							'rgb(255, 99, 132)',
							'rgb(255, 159, 64)',
							'rgb(255, 205, 86)',
							'rgb(75, 192, 192)',
							'rgb(255, 99, 132)',
							'rgb(255, 159, 64)',
							'rgb(255, 205, 86)',
						],
						borderWidth: 1,
					},
				],
			};
            },

            getPieChartData(){
                this.pieData = {
	               labels: ['Altara Cash', 'Altara Pay'],
				datasets: [
					{
						barPercentage: 1,
						barThickness: 12,
						maxBarThickness: 16,

						label: 'Number of sales',
						backgroundColor: '#f87979',
						data: this.getPieData(),
						backgroundColor: [
							'rgba(7, 70, 111, 0.2)',							
							'rgba(251, 173, 74, 0.2)'
						],

					},
				],
	           }
            },
			async getReport() {
				this.$LIPS(true);
				try {
					const report = await byMethod('GET',this.apiUrls.getReports, {}, this.query);
					this.reports = report.data.data;
					console.log(this.reports);
				} catch (err) {
					this.$displayErrorMessage(err);
				} finally {
					this.$LIPS(false);
				}
			},

			getBranchLabel() {
				const branches = this.reports.meta.groupedDataByBranch;
				return branches.map((item) => {
					return item.branch_name;
				});
			},

	           getPieData(){
	               const businessType = this.reports.meta.altaraPayVersusAltaraCash;
	               return [businessType.no_of_sales_altara_cash, businessType.no_of_sales_altara_pay]
	           },

			getSalesPerBranch() {
				const branches = this.reports.meta.groupedDataByBranch;
				return branches.map((item) => {
					return item.number_of_sales;
				});
			},

	           async exportReportCsv(){
	               this.$LIPS(true);
	                  try {
	                      const response = await byMethod('GET',this.apiUrls.exportReport, {}, this.query);
	                      let fileURL = window.URL.createObjectURL(new Blob([response.data]));
	                      let fileLink = document.createElement('a');
	                      fileLink.href = fileURL;
	                      fileLink.setAttribute('download', 'file.csv');
	                      document.body.appendChild(fileLink);
	                      fileLink.click();
	     } catch (error) {
	       this.$displayErrorMessage(error);
	     }finally{
	       this.$LIPS(false);
	     }
	           }

               ,
               async filterByDate(){	                
                    this.loaded = false;
                    await this.getReport();
                    this.getPieChartData();			
                    this.getBarChartData();	         
			        this.loaded = true;
                   
               }
		},
	};
</script>

<style lang="scss" scoped>
button{
    max-height: 36px;
    max-width: 120px;
};
.fbutton{
    margin-right: 48px;
}
</style>
