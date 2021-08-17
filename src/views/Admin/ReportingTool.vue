<template>
	<div class="my-3 py-4">
		<div class="mx-3 my-3 py-4 row">
			<h3 class="text-capitalize col">dashboard</h3>
			<div class="col float-right text-right row">
				<button class="bg-default rounded w-20 h3 p-3 col">
					<i class="fas fa-download mr-3"></i>Download
				</button>
				<date-picker
					class="w-50 col"
					v-model="query.from_date"
					valueType="format"
					placeholder="From Date"
				></date-picker>

				<date-picker
					class="w-50 col"
					v-model="query.to_date"
					valueType="format"
					placeholder="To Date"
				></date-picker>
			</div>
		</div>
		<div class="row my-3 mx-2" v-if="reports !== null">
			<stat-card
				:stat="reports.meta.total_no_sales"
				class="col mx-4 w-50"
				:icon="'fas fa-poll'"
				:label="'Total Number of Sales'"
			></stat-card>
			<stat-card
				:stat="'₦' + reports.meta.revenue_per_sale"
				class="col mx-4 w-50"
				:icon="'fas fa-dolly-flatbed'"
				:label="'Revenue per Sale'"
			></stat-card>
			<stat-card
				:stat="'₦' + reports.meta.total_revenue"
				class="col mx-4 w-50"
				:label="'Total Revenue'"
				:icon="'fas fa-dolly-flatbed'"
			></stat-card>
		</div>

		<div class="row m-3">
			<div class="mx-2 card col-7" v-if="reports !== null">
				<bar-chart
					:chartdata="barData"
					:options="option"
					v-if="loaded"
				></bar-chart>
			</div>
			<div class="mx-2 card col-4 ml-2" v-if="reports !== null">
				<pie-chart
					:chartdata="barData"
					:options="option"
					v-if="loaded"
				></pie-chart>
			</div>
		</div>
		<div class="ml-4 mx-2 card">
			<!-- table -->
			<div class="ml-4 mr-5 w-100">
				<table class="table table-responsive">
					<thead>
						<tr>
							<th v-for="header in tableHeaders" class="font-weight-bolder">
								{{ header }}
							</th>
						</tr>
					</thead>
					<tbody v-if="reports !== null">
						<tr v-for="branch in reports.meta.groupedDataByBranch">
							<td class="font-weight-bold">{{ branch.branch_name }}</td>
							<td>{{ branch.total_potential_revenue_sold_per_showroom }}</td>
							<td>{{ branch.number_of_sales }}</td>
							<td>{{ branch.no_of_altara_cash }}</td>
							<td>{{ branch.no_of_altara_pay }}</td>
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
	import { get, post } from '../../utilities/api';

	import DatePicker from 'vue2-datepicker';
	import 'vue2-datepicker/index.css';
	import BarChart from '../../components/charts/BarChart.vue';
import PieChart from '../../components/charts/PieChart.vue';

	export default {
		components: { StatCard, DatePicker, BarChart, PieChart },
		data() {
			return {
				reports: null,
				query: {},
				apiUrls: {
					getReports: '/api/order/reports',
				},
				tableHeaders: [
					'Branch',
					'Revenue',
					'No. of Sales',
					'Altara Pay',
					'Altara Cash',
					'Average Price/Product',
					'% Total Rev.',
				],
				barData: {},
				option: {
					responsive: true,
					maintainAspectRatio: false,
				},
				loaded: false,
			};
		},
		async mounted() {
			await this.getReport();
			this.barData = {
				labels: this.getBranchLabel(),
				datasets: [
					{
						label: 'Data Set',
						backgroundColor: '#f87979',
						data: this.getSalesPerBranch(),
						backgroundColor: [
							'rgba(255, 99, 132, 0.2)',
							'rgba(255, 159, 64, 0.2)',
							'rgba(255, 205, 86, 0.2)',
							'rgba(75, 192, 192, 0.2)',
						],
						borderColor: [
							'rgb(255, 99, 132)',
							'rgb(255, 159, 64)',
							'rgb(255, 205, 86)',
							'rgb(75, 192, 192)',
						],
						borderWidth: 1,
					},
				],
			};
			this.loaded = true;
		},
		methods: {
			async getReport() {
				this.$LIPS(true);
				try {
					const report = await get(this.apiUrls.getReports);
					this.reports = report.data.data;
					console.log(this.reports);
				} catch (err) {
					this.$displayErrorMessage(err);
				} finally {
					this.$LIPS(false);
				}
			},

			getBranchLabel() {
				const branches = Object.values(this.reports.meta.groupedDataByBranch);
				return branches.map((item) => {
					return item.branch_name;
				});
			},

			getSalesPerBranch() {
				const branches = Object.values(this.reports.meta.groupedDataByBranch);
				return branches.map((item) => {
					return item.number_of_sales;
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	table {
	}
</style>
