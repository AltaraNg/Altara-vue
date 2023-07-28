<template>
	<div>

		<div class="space-between mb-5 px-4">
			<h3 class="text-capitalize mb-0">Filters</h3>
		</div>

		<div class="center my-2 flex " style="gap: 10px">
			
			<div class="col ">
	                   
	                    <date-picker
						class="w-100"
						v-model="dateRange"
						:range="true"
						:language="locale"
						:format="dateFormat"
						valueType="format"
						placeholder="Date"
	                    ></date-picker>
	                  </div>


			<select name="repayment_duration" class="custom-select flex-1" v-model="repaymentPlan">
				<option :value="''" selected>Repayment Plan</option>
				<option v-for="option in availableRepaymentPlan" :value="option.id" :key="option.id">{{ option.name }}
				</option>
			</select>

			<select class="custom-select flex-1" v-validate="'required'" v-model="branch">
				<option value="0" selected>Showroom</option>
				<option v-for="option in Branches" :value="option.id">{{ option.name }}</option>
			</select>
			<button class="bg-default rounded ml-auto py-2 px-4" @click="getReport()">
				<span class="h5" style="width: 5rem">
					Search
				</span>
			</button>
			<button class="bg-default rounded ml-auto py-2 px-4" @click="resetReport()">
				<span class="h5" style="width: 5rem">
					Reset
				</span>
			</button>
		</div>
		<div class=" px-4  flex w-full " style="gap: 40px; margin-top: 30px;">
			<div class=" card  hover-zoom hover-shadow  bg-white" v-for="(data, index) in StatData" :key="index">
				<div>
					<p>{{ data.title }}</p>
					<p style="color: #04103B; font-weight: 700; font-size: 25px; line-height: 0.3;">{{
						$formatCurrency(data.amount) || data.stat }}</p>
					<div class="pt-4  flex"  style="align-items: center;">
						<component :is="data.percentIcon" />
						<div class="pl-1 font-weight-bold "
							:class="data.title == 'Total  Repayment Paid' ? 'text-success' : 'text-danger'">{{  data.percent != 'NaN%' ? data.percent : '0%'
							}}</div>
					</div>
				</div>

				<component :is="data.icon" />




			</div>

		</div>
		<div class="mx-4" style="margin-top:30px; margin-bottom: 40px; padding-left: 20px;">
			<bar-chart :chart-data="barData" :options="barOption"></bar-chart>
		</div>
		<div class="space-between mb-5 px-4">
			<h3 class="text-capitalize mb-0">Customers</h3>
		</div>
		<div v-if="isProcessing === false">
			<div v-if="orders.length > 0">
				<div class="tab-content" id="tabContent">
					<div class="tab-pane fade show active" id="all" role="tabpanel" aria-labelledby="all-tab">
						<repayment-table :customers="orders" :OId="OId"></repayment-table>
					</div>

				</div>
			</div>

			<div v-else class="mx-4">
				<zero-state :title="'No Repayment List'" :message="'There are currrently no customer that is owing'">
					<template v-slot:image>
						<img src="../../assets/thumb-up.png" />
					</template>
				</zero-state>
			</div>
		</div>

		<div v-if="pageParams && orders.length > 0">
			<base-pagination :page-param="pageParams" @fetchData="getReport">
			</base-pagination>
		</div>

	</div>
</template>
<script>
import { get, byMethod } from '../../utilities/api';
import Flash from '../../utilities/flash';
import StatCard from '../../components/StatCard.vue';
import users from '../../assets/users.vue'
import moneyStack from '../../assets/moneyStack.vue'
import tracking from '../../assets/tracking.vue'
import arrowUp from '../../assets/arrowUp.vue'
import arrowDown from '../../assets/arrowDown.vue'
import BarChart from '../../components/charts/BarChart.vue';
import RepaymentTable from '../../components/tables/RepaymentTable.vue';
import queryParam from '../../utilities/queryParam';
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import ZeroState from '../../components/ZeroState.vue';
import BasePagination from '../../components/Pagination/BasePagination.vue';
export default {
	components: {
		DatePicker,
		StatCard,
		users,
		moneyStack,
		tracking,
		arrowUp,
		arrowDown,
		BarChart,
		RepaymentTable,
		BasePagination,
		ZeroState
	},
	data() {
		return {
			dateRange: this.getFirstAndLastDayOfCurrentMonth(),
			locale: "en-US", 
			dateFormat: "YYYY-MM-DD", 
			Branches: [],
			branch: '0',
			query: {},
			reports: null,
			availableRepaymentPlan: [],
			repaymentPlan: '',
			apiUrls: {
				getReports: '/api/repayment-schedule/report',
				repaymentDurations: '/api/repayment_duration',
				branches: '/api/branches',
				renewalList: '/api/renewal/prompters',
			},
			pageParams: {},
			MonthlyStat: [],
			orders: [],
			order2: [],
			isProcessing: true,
			StatData: [
				{
					title: 'Total  Repayment Expected',
					amount: '',
					icon: moneyStack
				},
				{
					title: 'Total  Repayment Paid',
					amount: '',
					percent: '',
					percentIcon: arrowUp,
					icon: tracking
				},
				{
					title: 'Total Defaulters/Total Customers',
					amount: '',
					percent: '',
					percentIcon: arrowDown,
					icon: users
				},
			],
			barData: {},
			barOption: {
				responsive: true,
				maintainAspectRatio: false
			}
		}
	},
	methods: {
		fetchData() {
			this.pageParams.page = this.$route.query.page
				? this.$route.query.page
				: this.pageParams.page;
			this.pageParams.per_page = this.pageParams.per_page
				? this.pageParams.per_page
				: this.$route.query.per_page;

			let param = {
				...this.query,
				page: this.pageParams.page,
				per_page: this.pageParams.per_page,
			};
			this.prepareList(this.reports.orders);
			this.isProcessing = false;

		},
		prepareList(response) {
			response.data.meta ? (this.meta = response.data.meta) : '';
			let {
				current_page,
				first_page_url,
				from,
				last_page,
				last_page_url,
				data,
				per_page,
				next_page_url,
				to,
				total,
				prev_page_url,
			} = response;
			this.pageParams = Object.assign({}, this.pageParams, {
				current_page,
				first_page_url,
				from,
				last_page,
				last_page_url,
				per_page,
				next_page_url,
				to,
				total,
				prev_page_url,
			});
			this.orders = data;
			this.OId = from;
		},
		getBarChartData() {


			this.barData = {
				labels: Object.keys(this.reports.groupByMonth),
				datasets: [
					{
						label: 'Total Repayment Expected',
						backgroundColor: '#074A74',
						data: Object.values(this.reports.groupByMonth).map(item => item.expected_repayment)
					},
					{
						label: 'Total Repayment Paid',
						backgroundColor: '#f87979',
						data: Object.values(this.reports.groupByMonth).map(item => item.actual_repayment)
					},
				],
			};
		},
		async getReport() {
			this.$LIPS(true);
			if (this.$route.query && this.query === this.$route.query) {
				this.query = { ...this.query, ...this.$route.query };

			}
			else {
				this.query.scheduleDate = JSON.stringify(this.dateRange);
				this.query.branch = this.branch;
				this.query.repaymentPlan = this.repaymentPlan;
				this.query.page = this.pageParams.page || 1;
				this.query.per_page = this.pageParams.per_page || 10;
			}

			this.$router.replace({
				path: this.$route.path,
				query: {
					...this.$route.query,
					...this.query
				},
			});

			try {
				this.$LIPS(true);
				const report = await byMethod(
					'GET',
					this.apiUrls.getReports,
					{},
					this.query
				);
				this.reports = report.data.data.meta
				this.fetchData();


				this.StatData = [
					{
						title: 'Total  Repayment Expected',
						amount: this.reports.expected_repayment || '0',
						icon: moneyStack
					},
					{
						title: 'Total  Repayment Paid',
						amount: this.reports.actual_repayment  || '0',
						percent: this.getPercent(this.reports.actual_repayment, this.reports.expected_repayment) +  '%' ,
						percentIcon: arrowUp,
						icon: tracking
					},
					{
						title: 'Total Defaulters/Total Orders',
						stat: `${this.reports.defaultingOrders} / ${this.reports.total_orders}`,
						percent: this.getPercent(this.reports.defaultingOrders, this.reports.total_orders) + '%' ,
						percentIcon: arrowDown,
						icon: users
					},
				]
				this.getBarChartData()

				this.MonthlyStat = Object.values(
					this.reports.meta.groupByMonth
				);


			} catch (err) {
				if (err.response) {
					Flash.setError(err.response.statusText);
				}
			} finally {
				this.$LIPS(false);
			}
			// this.$LIPS(false);
		},
		resetReport() {
			
			this.branch = 0;
			this.repaymentPlan = '';
			this.getReport();
		},

		getPercent(value1, value2) {
			return ((value1 / value2) * 100).toFixed(2)
		},
		async getRepaymentDuration() {
			try {
				const fetchRepaymentDuration = await get(this.apiUrls.repaymentDurations);
				this.availableRepaymentPlan = fetchRepaymentDuration.data.data.data;
			} catch (err) {
				this.$displayErrorMessage(err);
			}
		},
		async getBranches() {
			try {
				const fetchBranches = await get(this.apiUrls.branches);
				this.Branches = fetchBranches.data.branches;
			} catch (err) {
				this.$displayErrorMessage(err);
			}
		},
		getFirstAndLastDayOfCurrentMonth() {
			const today = new Date();
			const year = today.getFullYear();
			const month = today.getMonth() + 1; // JavaScript months are zero-based (0-11)
			const firstDayOfMonth = new Date(year, month - 1, 1);
			const lastDayOfMonth = new Date(year, month, 0);

			const formatDate = (date) => {
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			};

			return [formatDate(firstDayOfMonth), formatDate(lastDayOfMonth)];
		}
	
	},
	async mounted() {
		this.$LIPS(true);
		await this.getRepaymentDuration()
		await this.getBranches()
		await this.getReport();
		
		// await this.fetchData()

		console.log(this.reports.orders, 'repayment schedule');


	},
}

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


.card {
	width: 25%;
	border-radius: 5px;
	border: 1px gray;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	padding: 25px 20px;
	background-color: white;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
}
</style>