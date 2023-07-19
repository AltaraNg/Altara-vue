<template>
	<div>

		<div class="space-between mb-5 px-4">
			<h3 class="text-capitalize mb-0">Filters</h3>
		</div>

		<div class="center my-2 flex " style="gap: 10px">
			<select name="order_type" class="custom-select flex-1" v-model="year">
				<option value="year" selected>Year</option>
				<option v-for="option in availableYears" :value="option" :key="option">{{ option }}</option>

			</select>
			<select name="order_type" class="custom-select flex-1" v-model="month">
				<option value="month" selected>Month</option>
				<option v-for="option in availableMonths" :value="option.id" :key="option.id">{{ option.name }}</option>
			</select>



			<select name="repayment_duration" class="custom-select flex-1" v-model="repaymentPlan">
				<option :value="''" selected>Repayment Plan</option>
				<option v-for="option in availableRepaymentPlan" :value="option.id" :key="option.id">{{ option.name }}</option>
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
					<div class="pt-4  flex" v-if="data.percent" style="align-items: center;">
						<component :is="data.percentIcon" />
						<div class="pl-1 font-weight-bold "
							:class="data.title == 'Total  Repayment Paid' ? 'text-success' : 'text-danger'">{{ data.percent
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
						<repayment-table :customers="orders"></repayment-table>
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
			<base-pagination :page-param="pageParams" @fetchData="fetchData">
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
import ZeroState from '../../components/ZeroState.vue';
import BasePagination from '../../components/Pagination/BasePagination.vue';
export default {
	components: {
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
			Branches: [],
			branch: '0',
			query: {},
			reports: null,
			year: 2023,
			availableYears: this.getYearsToCurrentYear(),
			month: 5,
			availableMonths: this.getMonthsArrayWithIDs(),
			availableRepaymentPlan: [],
			repaymentPlan: '',
			apiUrls: {
				getReports: '/api/repayment-schedule/report',
				repaymentDurations: '/api/repayment_duration',
				branches: '/api/branches'
			},
			pageParams: {},
			MonthlyStat: [],
			orders: [],
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
			barData:{
				labels: [
					'January',
					'February',
					'March',
					'April',
					'May',
					'June',
					'July',
					'August',
					'September',
					'October',
					'November',
					'December'
				],
				datasets: [
					{
						label: 'Total Repayment Expected',
						backgroundColor: '#074A74',
						data: [400000, 200000, 120000, 300009, 100000, 400000, 300009, 400000, 400000, 200000, 120000, 100001]
					},
					{
						label: 'Total Repayment Paid',
						backgroundColor: '#f87979',
						data: [200000, 100000, 10000, 200000, 50000, 200000, 200000, 200000, 400000, 200000, 100002, 100001]
					},
				]
			},
			barOption:{
				responsive: true,
				maintainAspectRatio: false
			}
		}
	},
	methods:{
		fetchData() {
			this.$LIPS(true);
			this.pageParams.page = this.$route.query.page
				? this.$route.query.page
				: this.pageParams.page;
			this.pageParams.per_page = this.pageParams.per_page
				? this.pageParams.per_page
				: this.$route.query.per_page;

			let param = {
				filterOrderbyBranch: true,
				orderHasAtMostTwoPaymentsLeft: true,
				...this.searchQuery,
				page: this.pageParams.page,
				per_page: this.pageParams.per_page,
			};
			this.$LIPS(true);

			get(this.apiUrl.renewalList + queryParam(param))
				.then(({ data }) => {
					this.prepareList(data);
				})
				.catch(() => Flash.setError('Error Fetching Renewal List'))
				.finally(() => {
					this.isProcessing = false;
				});
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
			} = response.data.renewal_prompters;
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
			if (response.queryParams !== undefined) {
				this.searchQuery = response.queryParams;
			}
			this.OId = from;
			this.$LIPS(false);
		},
		async getReport() {
			this.$LIPS(true);
			this.query.orderMonth = this.month;
			this.query.orderYear = this.year;
			this.query.branch = this.branch;
			this.query.repaymentPlan = this.repaymentPlan;
			try {
				const report = await byMethod(
					'GET',
					this.apiUrls.getReports,
					{},
					this.query
				);
				this.reports = report.data.data.meta
				// const PercentPaid = ((this.reports.actual_repayment/ this.reports.expected_repayment)*100).toFixed(2)
				this.StatData = [
					{
						title: 'Total  Repayment Expected',
						amount: this.reports.expected_repayment,
						icon: moneyStack
					},
					{
						title: 'Total  Repayment Paid',
						amount: this.reports.actual_repayment,
						percent: this.getPercent(this.reports.actual_repayment, this.reports.expected_repayment) + '%',
						percentIcon: arrowUp,
						icon: tracking
					},
					{
						title: 'Total Defaulters/Total Orders',
						stat: `${this.reports.defaultingOrders} / ${this.reports.total_orders}`,
						percent: this.getPercent(this.reports.defaultingOrders, this.reports.total_orders) + '%',
						percentIcon: arrowDown,
						icon: users
					},
				],
					// console.log(PercentPaid, 'PercentPaid');

					this.MonthlyStat = Object.values(
						this.reports.meta.groupByMonth
					);
				//sort the months to be serial

			} catch (err) {
				if (err.response) {
					Flash.setError(err.response.statusText);
				}
			} finally {
				this.$LIPS(false);
			}
		},
		resetReport(){
			this.month= new Date().getMonth();
			this.year = new Date().getFullYear();
			this.branch = 0;
			this.repaymentPlan='';
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
		getYearsToCurrentYear() {
			const currentYear = new Date().getFullYear();
			const yearsArray = Array.from({ length: currentYear - 2009 }, (_, index) => 2010 + index);
			return yearsArray;
		},
		getMonthsArrayWithIDs() {
			const months = [];
			for (let i = 1; i <= 12; i++) {
				const monthName = new Date(2023, i - 1, 1).toLocaleString('default', { month: 'long' });
				months.push({ id: i, name: monthName });
			}
			return months;
		},
	},
	async mounted() {
		this.getRepaymentDuration()
		this.getBranches()
		// await this.fetchData();


	},
	async created() {
		await this.getReport();
		console.log(this.reports);
	}
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