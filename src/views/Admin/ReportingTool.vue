<template>
	<div class="my-3 py-4 " v-if="reports !== null">
		<div class="space-between mb-5 px-4">
			<h3 class="text-capitalize mb-0">dashboard</h3>
			<button class="bg-default rounded py-2 px-4 h5" @click="exportReportCsv">
				<i class="fas fa-download mr-3"></i>Download
			</button>
		</div>

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
				v-model="sector"
				v-validate="'required'"
			>
				<option value="">All Sectors</option>
				<option :value="'formal'">Formal</option>
				<option :value="'informal'">Informal</option>
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

		<div class="row px-4" v-if="reports !== null">
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

		<div class="my-3 space-between px-4 w-100 text-center ">
			<div class="card col mr-3 py-2" v-if="reports">
				<bar-chart
					:chart-data="barData"
					:options="barOption"
					v-if="loaded"
				></bar-chart>
			</div>

			<div class="card col ml-3 py-2" v-if="reports">
				<pie-chart
					:chart-data="pieData"
					:options="option"
					v-if="loaded"
					class=""
				></pie-chart>
			</div>
		</div>

		<div style="display: flex;" class="my-3  px-4 ">
			<div class="border">
					<div class="d-flex justify-content-between text">
					<p>Sales Categories</p>
					<p>No of Sales</p>
				</div>
				<div v-for="(item, index) in TotalSalesBySalesCategory" :key="index">
					<p  class="progress-text  pt-3 text-capitalize">{{ item.sales_category_name }}</p>
				<div class="progress-bar d-flex justify-content-between align-items-center">

					<div class="progress d-flex justify-content-between align-items-center" :style="{ width: item.progress + '%' }">
						
					</div>
					<p class="text text-center pl-3">{{ item.total_sales }} ({{ item.progress }}%)</p>
				</div>
				</div>
				<div class="d-flex justify-content-between text">
					<p>Total</p>
					<p class="text-center pr-5">{{ SalesBySalesCategoryTotal }}</p>
				</div>
 			 </div>
			 
		</div>
		<div style="display: flex;" class="my-3  px-4 ">
			<div class="border ">
					<div class="d-flex justify-content-between text">
					<p>Sales Plan</p>
					<p>No of Sales</p>
				</div>
				<div v-for="(item, index) in totalSalesByDownPaymentsAndRepaymentDuration" :key="index">
					<p  class="progress-text  pt-3 text-capitalize">{{ item.name }}</p>
				<div class="progress-bar d-flex justify-content-between align-items-center">

					<div class="progress d-flex justify-content-between align-items-center" :style="{ width: item.progress + '%' }">
						
					</div>
					
					<p class="text text-center pl-3">{{ item.total_sales }} ({{ item.progress }}%)</p>
				</div>
				</div>
				<div class="d-flex justify-content-between text">
					<p>Total</p>
					<p class="text-center pr-5">{{ TotalByDP_RDTotal }}</p>
				</div>
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
							<td>{{ branch.forecast }}</td>
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
							<td>{{ sums.totalForecast }}</td>
							<td>{{ sums.totalAltPay }}</td>
							<td>{{ sums.totalAltCash }}</td>
							<td>{{ $formatCurrency(sums.totalAvePerProd) }}</td>
							<td>{{ sums.totalPercent }}</td>
							<td></td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="container-fluid h-75" v-show="productPieData">
			<div class="card">
				<h3 class="mx-5 my-5">Products Statistics</h3>
				<div class="card-body">
					<div class="row product-pie-card">
						<div class="col-md-4">
							<pie-chart
								:chart-data="productPieData"
								:options="productPieData.options"
								v-if="loaded"
								class=""
							></pie-chart>
						</div>
						<div class="col-md-8">
							<ul class="list-disc pl-5">
								<li
									v-for="(item, index) in productPieData.dataSet"
									class="list-disc h5"
									:style="`color: ${productPieData.bgColor[index]}`"
									:key="index"
								>
									<span class="text-left text-black"
										>{{ productPieData.labels[index] }}: </span
									><span class="">{{ item }}</span>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="container-fluid" v-show="productPieData">
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
		},
		data() {
			return {
				lengthOfBranches:'',
				TotalSalesBySalesCategory:[],
				reports: null,
				fromDate: '',
				toDate: '',
				query: {},
				businessType: '',
				orderType: '',
				sector: '',
				branchesInfo: {},
				orderTypes: {},

				apiUrls: {
					getReports: '/api/order/reports',
					exportReport: '/api/order/reports/export',
					businessTypes: '/api/business_type',
					orderTypes: '/api/order-types',
				},
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
				pieData:null,
				ZeroPieData: {
					labels: ['Altara Cash', 'Altara Pay'],
					datasets: [
					{
						barPercentage: 1,
						barThickness: 12,
						maxBarThickness: 16,
						data: [50,50],
						backgroundColor: ['#aaa', '#aaa'], // Customize the color as needed
					},
					],
				},
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
				SalesBySalesCategoryTotal:null,
				totalSalesByDownPaymentsAndRepaymentDuration:[],
				TotalByDP_RDTotal:'',
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
			this.drawProductPieChart();
			this.getBarChartData();
			this.addPercentageToSalesCategory();
			this.addPercentageToDownpaymentDuration();
			this.getOrderBarChartData();
			this.getBusinessTypes();
			this.getOrderTypes();
			this.loaded = true;
			this.getBarchartColors();
		},

		methods: {
			addPercentageToSalesCategory() {
				this.SalesBySalesCategoryTotal = this.TotalSalesBySalesCategory.reduce((sum, item) => sum + item['total_sales'], 0);		
			this.TotalSalesBySalesCategory = this.TotalSalesBySalesCategory.map(item => {
				const percentage = (item['total_sales'] / this.SalesBySalesCategoryTotal) * 100;
				return { ...item, progress: parseFloat(percentage.toFixed(2)) };
			});
			},
			addPercentageToDownpaymentDuration(){
			this.totalSalesByDownPaymentsAndRepaymentDuration = this.totalSalesByDownPaymentsAndRepaymentDuration.sort((a, b) => {
			const partsA = this.extractParts(a.name);
			const partsB = this.extractParts(b.name);

			// Sort by lowest month first
			const monthOrder = { three_months: 0, six_months: 1, nine_months:2, twelve_months:3  };
			const monthComparison = monthOrder[partsA.months] - monthOrder[partsB.months];
			if (monthComparison !== 0) {
				return monthComparison;
			}

			// Sort by number if months are the same
			return partsA.number - partsB.number;
			});
							this.TotalByDP_RDTotal = this.totalSalesByDownPaymentsAndRepaymentDuration.reduce((sum, item) => sum + item['total_sales'], 0);		
			this.totalSalesByDownPaymentsAndRepaymentDuration = this.totalSalesByDownPaymentsAndRepaymentDuration.map(item => {
				const percentage = (item['total_sales'] / this.SalesBySalesCategoryTotal) * 100;
				return { ...item, progress: parseFloat(percentage.toFixed(2)) };
			});
			},
			extractParts(duration){
			const [months, number] = duration.split('-');
			return {
			months,
			number: parseInt(number)
			};
			},
			getBarChartData() {
				this.barData = {
					labels: this.getBranchLabel(),
					datasets: [
						{
							barPercentage: 1,
							barThickness: 12,
							maxBarThickness: 16,
							label: 'Number of sales',
							data: this.getSalesPerBranch(),							
							backgroundColor: this.generateColorPalette(),
							borderColor: this.generateColorPalette(),
							borderWidth: 1,
						},
					],
				};
			},
			getPieChartData() {
				const valid = JSON.stringify(this.getPieData()) ==  JSON.stringify([0,0])
				this.pieData = valid ? this.ZeroPieData : {
					labels: ['Altara Cash', 'Altara Pay'],
					datasets: [
						{
							barPercentage: 1,
							barThickness: 12,
							maxBarThickness: 16,
							data: this.getPieData(),
							backgroundColor: ['#023e8a', '#CC5A71'],
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
						'GET',
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
					this.noOfSalesMadeOnEachProduct = this.reports.meta.noOfSalesMadeOnEachProduct;
					this.TotalSalesBySalesCategory = this.reports.meta.TotalSalesBySalesCategory;
					this.totalSalesByDownPaymentsAndRepaymentDuration = this.reports.meta.totalSalesByDownPaymentsAndRepaymentDuration;
					this.getSums(this.reports.meta.groupedDataByBranch);
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
				return branches.map(obj => obj.branch_name) 
				.sort((a, b) => a.localeCompare(b))
			},

			getPieData() {
				const businessType = this.reports.meta.altaraPayVersusAltaraCash;
				return [
					businessType.no_of_sales_altara_cash,
					businessType.no_of_sales_altara_pay,
				];
			},
			generateColorPalette() {
			return Array(this.lengthOfBranches).fill('#074A74');
		},

			getSalesPerBranch() {
				const branches = Object.values(this.reports.meta.groupedDataByBranch);
				this.lengthOfBranches = branches.length
				return branches.sort((a, b) => a.branch_name.localeCompare(b.branch_name)) 
  				.map(obj => obj.number_of_sales); 
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
				this.addPercentageToSalesCategory();
				this.addPercentageToDownpaymentDuration();
				this.getBarChartData();
				this.getOrderBarChartData();
				this.drawProductPieChart();
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
	.text{
		font-size: 13px;
		font-weight: 800;
		margin-bottom: 3px;
		color: rgb(60, 60, 60);
	}
	.progress-bar {
  background-color: #f8f7f7a5;
  height: 40px;
  border-radius: 3px;
  width: 100%;
  position: relative;
  margin-bottom: 13px;
}
.progress-text{
	position: absolute;
	padding-left: 10px;
	// top:1px;
	z-index: 10;
	font-size: 11px;
	font-weight: 600;
	color: rgb(60, 60, 60);
	
}
.border{
	width: 100%;
	border-radius: 5px;
	border: 1px gray;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	padding: 30px 20px;
	background-color: white;
}

.progress {
  background-color: #c3e4f997;
  height: 100%;
  border-radius: 5px;
}

</style>
