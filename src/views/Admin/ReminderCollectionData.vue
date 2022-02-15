<template>
	<div class="my-3 py-4" v-if="reports !== null">
		<!-- <div class="space-between mb-5 px-4">
			<h3 class="text-capitalize mb-0">Reminder And Collection Charts</h3>
			<button class="bg-default rounded py-2 px-4 h5" @click="exportReportCsv">
				<i class="fas fa-download mr-3"></i>Download
			</button>
		</div> -->

		<div class="center my-2 flex px-4" style="gap: 10px">
			<date-picker
				class="flex-1"
				v-model="fromDate"
				valueType="format"
				placeholder="From Date"
			></date-picker>

			<date-picker
				class="flex-1"
				v-model="toDate"
				valueType="format"
				placeholder="To Date"
			></date-picker>

			<select
				name="order_type"
				class="custom-select flex-1"
				v-model="orderType"
			>
				<option :value="''" selected>All Order Types</option>
				<option :value="type.id" :key="type.id" v-for="type in orderTypes">
					{{ type.name }}
				</option>
			</select>

			<select
				name="business_type"
				class="custom-select flex-1"
				v-model="businessType"
			>
				<option :value="''" selected>All Products</option>
				<option :value="type.id" :key="type.id" v-for="type in businessTypes">
					{{ type.name }}
				</option>
			</select>

			<select
				class="custom-select flex-1"
				v-model="branch"
				v-validate="'required'"
			>
				<option value="">Showroom</option>
				<option :value="branch.id" v-for="branch in getBranches">{{branch.name}}</option>
			</select>
		</div>
		
		<div class="flex mt-3 mb-5 px-4 ">
			<button
				class="bg-default rounded ml-auto py-2 px-4"
				@click="filterByDate"
			>
				<span class="h5" style="width: 5rem">
					Filter
				</span>
			</button>
		</div>

		<div class="text-center font-weight-bold text-black h5">
			<h3 v-if="branch === ''">All Branches</h3>
			<h3 v-else>Branch: {{getBranches.find(item => item.id === branch).name}}</h3>
		</div>

		<div class="row px-4 h-auto" v-if="reports !== null">
			<stat-card
				:stat="totalNumberOfSales"
				class="col mx-4  w-50 font-weight-bold "
				:label="'Total Number of Sales'"
			>
				<template v-slot:svg
							><img
								src="../../assets/new_stats.png"
								alt="work"
								style="height=100%"
						/></template>
			</stat-card>
			<stat-card
				:stat="$formatCurrency(amountCollected)"
				class="col mx-4 w-50 font-weight-bold "
				
				:icon="'fas fa-dolly-flatbed'"
				:label="'Amount Paid'"
			>
				<template v-slot:svg
							><img
								src="../../assets/pic.png"
								alt="work"
								style="height=100%"
						/></template>
			</stat-card>
			<stat-card
				:stat="$formatCurrency(amountOwed)"
				class="col mx-4 w-50 font-weight-bold "
				:label="'Amount Owed'"
				:icon="'fas fa-dolly-flatbed'"
			>
				<template v-slot:svg
							><img
								src="../../assets/stat_red.png"
								alt="work"
								style="height=100%"
						/></template>

			</stat-card>

			<stat-card
				:stat="$formatCurrency(totalOutstanding)"
				class="col mx-4 w-50 font-weight-bold "
				:label="'Total Outstanding'"
				:icon="'fas fa-dolly-flatbed'"
			>
				<template v-slot:svg
							><img
								src="../../assets/new_stats.png"
								alt="work"
								style="height=100%"
						/></template>

			</stat-card>

			
		</div>

		<div class="my-3 d-flex px-4 w-100">
			<!-- <div class="card col mr-3 py-2" v-if="reports">
				<bar-chart
					:chart-data="barData"
					:options="barOption"
					v-if="loaded"
				></bar-chart>
			</div> -->
			<div class="card col p-5" v-if="reports">
				
				<pie-chart
					:chart-data="pieData"
					:options="pieData.options"
					v-if="loaded"
					class=""
				></pie-chart>
				<div class="text-left">
					<h4>Overview</h4>
					<ul class=".list-unstyled">
						<li><span class="font-weight-bold" style="color: #e2e612">Active Sales</span>: <span>anyone who has not completed payment but has made a payment in the last 60 days(2 months) (from today's date), REGARDLESS of if the payment cycle is over.</span></li>
						<li><span class="font-weight-bold" style="color: #e6091c">Inactive Sales</span>: <span> anyone who has not completed payment but has not made any payment in the last 60 days</span></li>
						<li><span class="font-weight-bold" style="color: #2ad413">Completed Sales</span>: <span>anyone who has completed payment irregardless of if they completed it on time or late. </span></li>
						<li v-if="checker"><span class="font-weight-bold" style="color: #aaaaaa">No Orders </span>: <span>No orders for that time frame </span></li>
					</ul>
				</div>
			</div>

			<div class="card col ml-5 p-5" v-if="reports">
				<polar-chart
					:chart-data="polarData"
					:options="polarData.options"
					v-if="loaded"
					class=""
				></polar-chart>
				<div class="text-left">
					
				</div>

			</div>
		</div>
		
		<!-- <div class="container-fluid" v-show="productPieData">
			<div class="card">
				<h3 class="mx-5 my-5">Order By Day Statistics</h3>
				<div class="card-body">
					<div class="row">
						<div class="col-md-12">
							<template v-if="reports">
								<bar-chart
									:chart-data="OrderBarChart.data"
									:options="OrderBarChart.options"
									v-if="loaded"
								></bar-chart>
							</template>
						</div>
					</div>
				</div>
			</div>
		</div> -->
	</div>
</template>

<script>
	import StatCard from '../../components/StatCard.vue';
	import { get, byMethod } from '../../utilities/api';
	import Sales from '../../assets/css/svgs/sales.vue';
	import Revenue from '../../assets/css/svgs/revenue.vue';
	import { mapGetters } from 'vuex';

	import Total from '../../assets/css/svgs/total.vue';
	import DatePicker from 'vue2-datepicker';
	import 'vue2-datepicker/index.css';
	import BarChart from '../../components/charts/BarChart.vue';
	import PieChart from '../../components/charts/PieChart.vue';
	import PolarChart from '../../components/charts/PolarChart.vue';

	import Flash from '../../utilities/flash';

	export default {
		components: {
			StatCard,
			DatePicker,
			BarChart,
			PieChart,
			Sales,
			Revenue,
			Total,
			PolarChart
		},
		data() {
			return {
				reports: null,
				fromDate: '',
				toDate: '',
				query: {},
				businessType: '',
				orderType: '',
				sector: '',
				branchesInfo: {},
				orderTypes: {},
				checker: false,
					businessTypes: '/api/business_type',
				tableHeaders: [
					'S/N',
					'Branch',
					'Revenue (₦)',
					'No. of Sales',
					'Forecast',
					'Altara Pay',
					'Altara Cash',
					'Average Price/Product (₦)',
					'% Total Rev.',
					'Average Down Payment',
				],
				barData: null,
				pieData: null,
				polarData: null,
				option: {
					responsive: true,
					maintainAspectRatio: false,
				},
				barOption: {
					responsive: true,
					maintainAspectRatio: false,
					legend: {
						display: false,
					},	
					scales: {
						yAxes: [{
							display: true,
							ticks: {
								beginAtZero: true
							}						
						}]
					}				
				},
				noOfSalesMadeOnEachProduct: null,
				totalNumberOfSales: null,
				amountCollected: null,
				totalOutstanding: null,
				amountOwed: null,
				productPieData: {
					labels: [],
					dataSet: [],
					bgColor: [
						'#ff0000',
						'#00aeae',
						'#7580ce',
						'#007900',
						'#39f159',
						'#989000',
						'#20062b',
						'#dc5355',
						'#5526c4',
						'#ff7f00',
					],
					options: {
						responsive: true,
						maintainAspectRatio: true,
						legend: {
							display: false,
						},
						title: {
							display: true,
							position: 'bottom',
							text: 'Top 10 Product Chart',
						},
					},
				},
				OrderBarChart: {
					data: null,
					options: {
						responsive: true,
						maintainAspectRatio: false,
						legend: {
							display: false,
						},
					},
				},
				loaded: false,
				sums: {},
				businessTypes: {},
				branch: ''
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
			this.getPolarChartData();
			// this.drawProductPieChart();
			// this.getBarChartData();
			// this.getOrderBarChartData();
			this.$prepareBranches();
			this.getBusinessTypes();
			this.getOrderTypes();
			this.loaded = true;
			// this.getBarchartColors();
		},

		methods: {			
			getPieChartData() {
				this.pieData = {
					labels: this.checker === true ? ['No orders'] : ['Active Orders', 'Inactive Orders', 'Completed Orders'],
					options: {
						title: {
							text: ['Order Categories', 'Chart describing number of active', 'inactive and completed orders per selected period of time'],
							display: true,
							color: ['#ffffff'],
						},

						tooltips: {
							callbacks: {
								label: function(tooltipItem, data) {
									var indice = tooltipItem.index;
									var percent = (
										(data.datasets[0].data[indice] /
											(data.datasets[0].data[0] +
												data.datasets[0].data[1] +
												data.datasets[0].data[2])) *
											100
									);
									return (
										data.labels[indice] +
										': ' +
										data.datasets[0].data[indice] +
										' (' +
										Number.parseFloat(percent).toFixed(2) +
										'%)'
									);
								},
							},
						},

						layout: {
							padding: 0,
						},
						maintainAspectRatio: false,
					},

					datasets: [
						{
							barPercentage: 1,
							barThickness: 12,
							maxBarThickness: 16,
							data: this.getPieData(),
							backgroundColor:this.checker ? ['#aaaaaa'] : ['#e2e612', '#e6091c', '#2ad413'],
						},
					],
				};
			},

			getPolarChartData() {
				this.polarData = {
					labels: [
						'1-30 days overdue',
						'30-45 days overdue  ',
						'>45 days overdue',
					],
					options: {
						title: {
							text: ['Overdue Days', 'Chart of how many days overdue for missed payments'],
							display: true,
							color: '#ffffff',
						},
						tooltips: {
							callbacks: {
								label: function(tooltipItem, data) {
									var indice = tooltipItem.index;
									var percent = (
										(data.datasets[0].data[indice] /
											(data.datasets[0].data[0] +
												data.datasets[0].data[1] +
												data.datasets[0].data[2])) *
											100
									);
									return (
										data.labels[indice] +
										': ' +
										data.datasets[0].data[indice] +
										' (' +
										Number.parseFloat(percent).toFixed(2) +
										'%)'
									);
								},
							},
						},
						layout: {
							padding: 0,
						},
						maintainAspectRatio: false,
					},
					datasets: [
						{
							barPercentage: 1,
							barThickness: 12,
							maxBarThickness: 16,
							data: this.getPolarData(),
							backgroundColor: ['#179c4a', '#de811d', '#d9112f'],
						},
					],
				};
			},
			getPolarData() {
				const orderStatus = this.reports?.meta?.stats?.overdueRange;
				return [
					orderStatus['1_30'],
					orderStatus['31_45'],
					orderStatus['45_above'],
				];
			},
			async getReport() {
				this.$LIPS(true);
				this.query.fromDate = this.fromDate;
				this.query.toDate = this.toDate;
				this.query.businessType = this.businessType;
				this.query.branch = this.branch;
				this.query.orderType = this.orderType;
				try {
					const report = await byMethod(
						'GET',
						this.apiUrls.getReports,
						{},
						this.query
					);
					this.reports = report.data.data;
					this.totalNumberOfSales = this.reports?.meta?.stats?.total_sales;
					this.amountOwed = this.reports?.meta?.stats?.amountOwed;
					this.amountCollected = this.reports?.meta?.stats?.amountReceived;
					this.totalOutstanding = this.reports?.meta?.stats?.totalOutstanding;

					const orderStatus = this.reports?.meta?.stats?.ordersStatusCount;
				this.checker = orderStatus.active === 0 && orderStatus.inactive === 0 && orderStatus.complete === 0;

					// this.branchesInfo = Object.values(
					// 	this.reports.meta.groupedDataByBranch
					// );
					// this.branchesInfo.sort((a, b) => {
					// 	if (a.branch_name < b.branch_name) {
					// 		return -1;
					// 	}
					// 	if (a.branch_name > b.branch_name) {
					// 		return 1;
					// 	}
					// 	return 0;
					// });
					// this.noOfSalesMadeOnEachProduct = this.reports.meta.noOfSalesMadeOnEachProduct;

					// this.getSums(this.reports.meta.groupedDataByBranch);
				} catch (err) {
					if (err.response) {
						Flash.setError(err.response.statusText);
					}
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
							''
						)
					);
					this.sums.totalAltPay += dataArray[index].no_of_altara_pay;
					this.sums.totalAltCash += dataArray[index].no_of_altara_cash;
					this.sums.totalAvePerProd += parseFloat(
						dataArray[index].avg_price_of_prod_per_showroom.replace(/,/g, '')
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
				const orderStatus = this.reports?.meta?.stats?.ordersStatusCount;
				// this.checker = orderStatus.active === 0 && orderStatus.inactive === 0 && orderStatus.complete === 0;
				return this.checker === true ? [1] : [
					orderStatus.active ,
					orderStatus.inactive ,
					orderStatus.complete ,

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
						'GET',
						this.apiUrls.exportReport,
						{},
						this.query
					);
					let fileURL = window.URL.createObjectURL(new Blob([response.data]));
					let fileLink = document.createElement('a');
					fileLink.href = fileURL;
					fileLink.setAttribute('download', 'file.csv');
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
				this.getPolarChartData();

				// this.getBarChartData();
				// this.getOrderBarChartData();
				// this.drawProductPieChart();
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
			getProductPieData() {
				let productsStats = this.noOfSalesMadeOnEachProduct;
				let productsLabel = [];
				let productsData = [];
				productsStats.forEach(function(productStat) {
					productsLabel.push(productStat['product_name']);
					productsData.push(productStat['product_count']);
				});
				this.productPieData.labels = productsLabel;
				this.productPieData.dataSet = productsData;
			},
			drawProductPieChart() {
				this.getProductPieData();
				this.productPieData.datasets = [
					{
						barPercentage: 1,
						barThickness: 12,
						maxBarThickness: 16,
						data: this.productPieData.dataSet,
						backgroundColor: this.productPieData.bgColor,
					},
				];
			},
			getOrderBarChartData() {
				this.OrderBarChart.data = {
					labels: this.getOrderDates(),
					datasets: [
						{
							barPercentage: 1,
							barThickness: 12,
							maxBarThickness: 16,
							data: this.getOrderValues(),
							backgroundColor: this.getBarchartColors(),
							borderColor: this.getBarchartColors(),
							borderWidth: 1,
						},
					],
				};
			},
			getBarchartColors() {
				let total_no = this.reports?.meta?.totalSalesPerDay?.length;
				let newColors = [];
				let colors = [
					'#808080',
					'#808080',
					'#808080',
					'#808080',
					'#808080',
					'#808080',
					'#808080',
				];
				for (let i = 0; i < total_no; i++) {
					if (i < 7) {
						newColors.push(colors[i]);
					} else {
						newColors.push(colors[i % 7]);
					}
				}

				return newColors;
			},
			getOrderDates() {
				const dateConfig = {
					weekday: 'short',
					year: '2-digit',
					month: 'short',
					day: 'numeric',
				};
				return (
					this.reports?.meta?.totalSalesPerDay?.map((item) => {
						let date = new Date(item.order_date);
						let month = date.toLocaleString('en-us', {
							month: dateConfig.month,
						});
						let weekday = date.toLocaleString('en-us', {
							weekday: dateConfig.weekday,
						});
						let year = date.toLocaleString('en-us', { year: dateConfig.year });
						let day = date.toLocaleString('en-us', { day: dateConfig.day });
						return [weekday, month, day].join('-');
					}) ?? null
				);
			},
			getOrderValues() {
				return this.reports?.meta?.totalSalesPerDay?.map((item) => {
					return item.total;
				});
			},
		},
		computed: {
			...mapGetters(['getBranches']),

		}
	};
</script>

<style lang="scss" scoped>
	.center {
		align-items: center;
		justify-content: center;
	}
	.flex {
		display: flex;
		flex-wrap: wrap;
	}
	.flex-1 {
		flex: 1 1 0%;
	}
	.space-between {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.divider {
		width: 100%;
		border-top: 2px solid rgba(75, 85, 99, 0.54);
	}
	.product-pie-card {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.bg-custom1{
		background-image:  linear-gradient(yellow, black);
	}

	.bg-custom2{
		background-image:  linear-gradient(black,#063D60);
	}
	.bg-custom3{
		background-image:  linear-gradient(green, black);
	}
</style>
