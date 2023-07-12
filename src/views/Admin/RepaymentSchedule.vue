<template>
	<div>

		<div class="space-between mb-5 px-4">
			<h3 class="text-capitalize mb-0">Filters</h3>
		</div>

		<div class="center my-2 flex " style="gap: 10px">
			<select name="order_type" class="custom-select flex-1" v-model="year">
				<option :value="''" selected>Year</option>
				<option v-for="option in availableYears" :value="option" :key="option">{{ option }}</option>

			</select>
			<select name="order_type" class="custom-select flex-1" v-model="month">
				<option :value="''" selected>Month</option>
				<option v-for="option in availableMonths" :value="option" :key="option">{{ option }}</option>
			</select>



			<select name="business_type" class="custom-select flex-1" v-model="repaymentPlan">
				<option :value="''" selected>Repayment Plan</option>
				<option v-for="option in availableRepaymentPlan" :value="option" :key="option">{{ option }}</option>
			</select>

			<select class="custom-select flex-1" v-validate="'required'">
				<option value="">Showroom</option>
				<option :value="'formal'">Formal</option>
				<option :value="'informal'">Informal</option>
			</select>
			<button class="bg-default rounded ml-auto py-2 px-4">
				<span class="h5" style="width: 5rem">
					Search
				</span>
			</button>
			<button class="bg-default rounded ml-auto py-2 px-4">
				<span class="h5" style="width: 5rem">
					Reset
				</span>
			</button>
		</div>
		<div class=" px-4  flex w-full " style="gap: 40px; margin-top: 30px;">
			<div class=" card  hover-zoom hover-shadow  bg-white" v-for="(data, index) in StatData" :key="index">
				<div>
					<p>{{ data.title }}</p>
					<p style="color: #04103B; font-weight: 700; font-size: 25px; line-height: 0.3;">{{ data.amount }}</p>
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
			<bar-chart :chart-data="barData" :options="barOption" ></bar-chart>
		</div>
		<div class="space-between mb-5 px-4">
				<h3 class="text-capitalize mb-0">Customers</h3>
			</div>
			<div v-if="isProcessing === false">
					<div v-if="orders.length > 0">
						<div class="tab-content" id="tabContent">
							<div
								class="tab-pane fade show active"
								id="all"
								role="tabpanel"
								aria-labelledby="all-tab"
							>
								<repayment-table
									:customers="orders"
									
								></repayment-table>
							</div>
							
						</div>
					</div>

					<div v-else class="mx-4">
						<zero-state
							:title="'No Repayment List'"
							:message="'There are currrently no customer that is owing'"
						>
							<template v-slot:image>
								<img src="../../assets/thumb-up.png" />
							</template>
						</zero-state>
					</div>
				</div>

				<div v-if="pageParams && orders.length > 0" >
					<base-pagination :page-param="pageParams" @fetchData="fetchData">
					</base-pagination>
				</div>

	</div>
</template>
<script>
import Flash from '../../utilities/flash';
import StatCard from '../../components/StatCard.vue';
import users from '../../assets/users.vue'
import moneyStack from '../../assets/moneyStack.vue'
import tracking from '../../assets/tracking.vue'
import arrowUp from '../../assets/arrowUp.vue'
import arrowDown from '../../assets/arrowDown.vue'
import BarChart from '../../components/charts/BarChart.vue';
import RepaymentTable from '../../components/tables/RepaymentTable.vue';
import { get } from '../../utilities/api';
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
			year:'',
			availableYears:['2001', '2002','2003'],
			month: '',
			availableMonths: ['January',
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
				'December'],
				availableRepaymentPlan:['Three_months',
				'Six_Months',
				'Nine_months',
				'Twelve_months',],
				repaymentPlan:'',
			apiUrl: {
				renewalList: '/api/renewal/prompters',
			},
			pageParams: {},
			orders: [],
			isProcessing: true,
			StatData: [
				{
					title: 'Total  Repayment Expected',
					amount: '₦6,000,000',
					icon: moneyStack
				},
				{
					title: 'Total  Repayment Paid',
					amount: '₦6,000,000',
					percent: '0.83%',
					percentIcon: arrowUp,
					icon: tracking
				},
				{
					title: 'Total Defaulters/Total Customers',
					amount: '234/238',
					percent: '98.3%',
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
	},
	async mounted() {
		await this.fetchData();
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