<template>
	<transition name="fade">
		<div id="reminder" class="my-4 container-fluid">
			<div class="d-flex gap-3 mt-5 justify-content-center">
				<div class="mx-5">
					<stat-card :label="'Total number of sales'" :stat="pageParams.total">
						<template v-slot:svg
							><img
								src="../../assets/new_stats.png"
								alt="work"
								style="height=100%"
						/></template>
					</stat-card>
				</div>
				<div class="mx-5" >
					<stat-card :label="'Total Amount Owed'" :stat="meta.stats.totalAmountOwed ? $formatCurrency(meta.stats.totalAmountOwed) : $formatCurrency('0')">
						<template v-slot:svg
							><img
								src="../../assets/download.png"
								alt="work"
								style="height=100%"
						/></template>
					</stat-card>
				</div>
			</div>
			<div v-if="canGenerateList">
				<button class="bg-default p-2" @click="generateList">Generate List </button>
			</div>

			<div class="mt-5 mb-3 px-2 py-3 card">
				<div class="d-flex my-4 px-3">
					<div class="col form-group">
						<label for="business_type" class="form-control-label"
							>BUSINESS TYPE</label
						>
						<select
							name="business_type"
							class="custom-select w-100"
							v-model="searchQuery.business_type"
							v-validate="'required'"
						>
							<option disabled selected="selected">Payment Method</option>
							<option
								:value="type.id"
								:key="type.id"
								v-for="type in businessTypes"
							>
								{{ type.name }}
							</option>
						</select>
					</div>
					<div class="col form-group">
						<label for="branch" class="form-control-label">SHOWROOM NAME</label>
						<select
							name="branch"
							class="custom-select w-100"
							v-model="searchQuery.branch"
							v-validate="'required'"
						>
							<option disabled selected="selected">--select showroom--</option>
							<option
								:value="branch.id"
								:key="branch.id"
								v-for="branch in getBranches"
							>
								{{ branch.name }}
							</option>
						</select>
					</div>

					<div class="col form-group">
						<label for="branch" class="form-control-label">ORDER ID</label>
						<input type="text" class="form-control" v-model="searchQuery.orderNumber" />
					</div>
					<div class="col form-group">
						<label for="business_type" class="form-control-label">SECTOR</label>
						<select
							name="business_type"
							class="custom-select w-100"
							v-model="searchQuery.sector"
							v-validate="'required'"
						>
							<option disabled selected="selected">Sectors</option>
							<option :value="type.name" :key="type.id" v-for="type in sectors">
								{{ type.name }}
							</option>
						</select>
					</div>
				</div>

				<div class="d-flex px-3">
					<div class="col form-group">
						<label for="branch" class="form-control-label">CUSTOMER ID</label>
						<input type="text" class="form-control" v-model="searchQuery.CustomerId"/>
					</div>

					<div class="col form-group">
						<label for="branch" class="form-control-label">TYPE OF SALE</label>
						<select
							name="branch"
							class="custom-select w-100"
							v-model="searchQuery.salesCategory"
							v-validate="'required'"
						>
							<option disabled selected="selected">Sales Type</option>
							<option
								:value="type.id"
								:key="type.id"
								v-for="type in salesCategories"
							>
								{{ type.name }}
							</option>
						</select>
					</div>
					<div class="col form-group">
						<div><label class="form-control-label">DATE PURCHASED</label></div>
						<date-picker
							class="w-100"
							v-model="searchQuery.fromDate"
							valueType="format"
							placeholder="Date From"
						></date-picker>
					</div>
					<div class="col mt-4">
						<date-picker
							class="w-100 mt-1"
							v-model="searchQuery.toDate"
							valueType="format"
							placeholder="Date To"
						></date-picker>
					</div>
				</div>

				<div class="d-flex my-4 justify-content-between gap-3 px-5">
					<button
						class="my-auto py-4 px-5 mx-2 ml-5 h2  rounded bg-default w-25"
						@click="searchAction"
					>
						<i class="fas fa-search mx-2"></i>
						Search
					</button>
					<button
						class="my-auto py-4 h2 rounded mx-2 bg-default px-5 w-25"
						@click="resetAction"
					>
						<i class="fas fa-recycle mx-2"></i>
						Reset
					</button>

					<button
						class="my-auto py-4 h2 rounded mx-2 mr-5 bg-default px-5 w-25"
						@click="resetAction"
					>
						<i class="fas fa-download mx-2"></i>
						Export
					</button>
				</div>
			</div>

			<div class="mt-5 mb-3">
				<ul class="nav nav-tabs justify-content-center p-0" role="tablist">
					<li
						class="col p-0 nav-item mb-0"
						v-for="(tab, index) in tabs"
						:key="index"
						@click="buttonPress(tab)"
						:title="tab.title"
					>
						<a
							aria-selected="true"
							class="nav-link"
							:class="{ active: tab.alias === currentTab }"
							data-toggle="tab"
							:href="`#${tab.alias}`"
							role="tab"
							v-html="tab.name"
							:ref="tab.alias"
						>
						</a>
					</li>
				</ul>
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
							<renewal-table
								:customers="orders"
								:OId="OId"
								:statuses="statuses"
								:dsas="dsas"
								:mode="'collections'"
								:headings="headings"
							></renewal-table>
						</div>
						<div
							class="tab-pane fade show"
							id="rl"
							role="tabpanel"
							aria-labelledby="reminder-tab"
						>
							<renewal-table
								:customers="orders"
								:OId="OId"
								:statuses="statuses"
								:dsas="dsas"
								:mode="'collections'"
								:headings="headings"
							></renewal-table>
						</div>
						<div
							class="tab-pane fade show"
							id="cbl"
							role="tabpanel"
							aria-labelledby="credit-bureau-tab"
						>
							<renewal-table
								:customers="orders"
								:OId="OId"
								:statuses="statuses"
								:dsas="dsas"
								:mode="'collections'"
								:headings="headings"
							></renewal-table>
						</div>
						<div
							class="tab-pane fade show"
							id="irl"
							role="tabpanel"
							aria-labelledby="internal-tab"
						>
							<renewal-table
								:customers="orders"
								:OId="OId"
								:statuses="statuses"
								:dsas="dsas"
								:mode="'collections'"
								:headings="headings"
							></renewal-table>
						</div>
						<div
							class="tab-pane fade show"
							id="erl"
							role="tabpanel"
							aria-labelledby="external-tab"
						>
							<renewal-table
								:customers="orders"
								:OId="OId"
								:statuses="statuses"
								:dsas="dsas"
								:mode="'collections'"
								:headings="headings"
							></renewal-table>
						</div>
					</div>
				</div>

				<div v-else class="mx-4">
					<zero-state
						:title="'No reminder List'"
						:message="'There are currrently no customer on the reminder list'"
					>
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
	</transition>
</template>

<script>
	import StatCard from '../../components/StatCard.vue';
	import RenewalTable from '../../components/tables/RenewalTable.vue';
	import { mapGetters } from 'vuex';
	import Total from '../../assets/css/svgs/total.vue';
	import People from '../../assets/css/svgs/people.vue';
	import Purchased from '../../assets/css/svgs/purchased.vue';
	import Interested from '../../assets/css/svgs/interested.vue';
	import DatePicker from 'vue2-datepicker';
	import 'vue2-datepicker/index.css';
	import { get } from '../../utilities/api';
	import queryParam from '../../utilities/queryParam';
	import ZeroState from '../../components/ZeroState.vue';
	import Flash from '../../utilities/flash';
	import Roles from '../../utilities/roles';
	import BasePagination from '../../components/Pagination/BasePagination.vue';

	export default {
		components: {
			StatCard,
			Total,
			RenewalTable,
			People,
			Purchased,
			Interested,
			DatePicker,
			ZeroState,
			BasePagination,
		},
		data() {
			return {
				roleList: Roles,
				tabs: [
					{
						name: 'All',
						alias: 'all',
						link: 'all',
						title: 'List of all reminders and collection',
					},
					{
						name: 'Reminder List',
						alias: 'rl',
						link: 'reminder',
						title: 'customers who have not payed repayment in 7days',
					},
					{
						name: 'Credit Bureau List',
						alias: 'cbl',
						link: 'credit_bureau',
						title: 'customers who have not payed repayment in 21days',
					},
					{
						name: 'Internal Repossession List',
						alias: 'irl',
						link: 'internal_repossession',
						title: 'customers who have not payed repayment in 32days',
					},
					{
						name: 'External Repossession List',
						alias: 'erl',
						link: 'external_repossession',
						title: 'customers who have not payed repayment in 45days',
					},
				],
				fromDate: null,
				toDate: null,
				pageParams: {},
				searchQuery: {},
				orders: [],

				sectors: [
					{ id: 1, name: 'formal' },
					{ id: 2, name: 'informal' },
				],

				headings: [
					'S/N',
					'Order Number',
					'Customer Info Summary',
					'Total Amount Owed/Amount Left',
					'Feedback',
					'Date',
					'Actions',
				],
				apiUrl: {
					generateList: 'api/recollection/regenerate/list',
					collection: '/api/recollection',
					dsas: `/api/get-users?role=18&limit=200`,
					salesCategoryUrl: `/api/sales_category`,
					businessTypes: `/api/business_type`,
				},
				meta: {},
				renewal: true,
				statuses: '',
				OId: 1,
				businessTypes: [],
				salesCategories: [],
				currentTab: 'all',
				statuses: [],
				dsas: [],
				isProcessing: true,
				role: parseInt(localStorage.getItem('role')),
				
			};
		},

		async mounted() {
			// await this.generateList();

			var date = new Date(),
				y = date.getFullYear(),
				m = date.getMonth();
			var firstDay = new Date(y, m, 2).toISOString();

			let query = this.$route.query;
			console.log(query);
			if (!query.fromDate) {
				this.fromDate = firstDay.slice(0, 10);
				this.searchQuery.fromDate = this.fromDate;
			}

			// this.searchQuery = {
			// 	...this.searchQuery,
			// 	...query,
			// };
			if (query.tab) {
				this.activeTab = query.tab;
				this.showCorrectTab(this.activeTab);
				return;
			} else {
				this.activeTab = 'all';
				await this.fetchData();
			}
			this.$root.$on('feedback', (payload) => {
				this.fetchData();
			});
			this.$root.$on('owner_updated', (payload) => {
				this.fetchData();
			});
			await this.$prepareBranches();

			await this.getBusinessTypes();
			await this.getSalesCategories();
			// await this.fetchDsas();
			// this.fetchStats();
		},
		methods: {
			fetchStats(param = {}) {
				let query = this.$route.query;
				let reParam = {
					...param,
					fromDate: query.fromDate
						? query.fromDate
						: this.searchQuery.fromDate
						? this.searchQuery.fromDate
						: '',
					toDate: this.toDate
						? this.toDate
						: this.searchQuery.toDate
						? this.searchQuery.toDate
						: '',
					rollUp: true,
					filterOrderbyBranch: true,
					orderHasAtMostTwoPaymentsLeft: true,
				};
				get(this.apiUrl.renewalList + queryParam(reParam))
					.then(({ data }) => {
						this.meta = data.data.meta;
					})
					.catch(() => Flash.setError('Error Fetching Renewal List'))
					.finally(() => {});
			},
			fetchData() {
				this.$LIPS(true);
				this.pageParams.page = this.$route.query.page
					? this.$route.query.page
					: this.pageParams.page;
				this.pageParams.per_page = this.pageParams.per_page
					? this.pageParams.per_page
					: this.$route.query.per_page;

				let param = {
					...this.searchQuery,
					page: this.pageParams.page,
					per_page: this.pageParams.per_page,
				};
				this.currentTab === 'all'
					? (param.recollection = 'all')
					: this.fetchStats();
				if (this.renewal === true) {
					this.$LIPS(true);

					get(this.apiUrl.collection + queryParam(param))
						.then(({ data }) => {
							this.prepareList(data);
						})
						.catch(() => Flash.setError('Error Fetching Renewal List'))
						.finally(() => {
							this.isProcessing = false;
						});
				} else {
					delete param.renewalList;
					get(this.url + queryParam(param))
						.then(({ data }) => this.prepareList(data))
						.catch(() => Flash.setError('Error Preparing form'))
						.finally(() => {
							this.$LIPS(false);
						});
				}
			},
			buttonPress(tab) {
				this.pageParams.page = 1;
				this.switchTab(tab);
			},

			switchTab(tab) {
				// localStorage.setItem('activeTab', tab.alias);
				this.currentTab = tab.alias;

				this.searchQuery.recollection = tab.link;

				// localStorage.setItem('activeTab', tab.alias);
				this.searchQuery.tab = tab.alias;
				if (this.pageParams.page === 1) {
					this.pageParams.page = 1;
				} else {
					this.pageParams.page = this.$route.query.page;
				}

				this.$router.replace({
					query: Object.assign({}, this.$route.query, {
						...this.searchQuery,
						page: this.pageParams.page,
					}),
				});

				this.fetchData();
			},

			async searchAction() {
				this.$LIPS(true);				
				this.pageParams.page = 1;

				await this.fetchData();
				this.$router.replace({
					query: Object.assign({}, this.$route.query, {
						...this.searchQuery,
						page: this.pageParams.page,
					}),
				});
			},

			async fetchDsas() {
				try {
					let agents = await get(this.apiUrl.dsas);
					this.dsas = agents.data?.data?.data;
				} catch (error) {
					flash.setError(error);
				} finally {
				}
			},

			async resetAction() {
				var date = new Date(),
				y = date.getFullYear(),
				m = date.getMonth();
				var firstDay = new Date(y, m, 2).toISOString();
				this.searchQuery.fromDate = firstDay.slice(0,10);
				delete this.searchQuery.toDate;
				delete this.searchQuery.branch;
				delete this.searchQuery.business_type;
				delete this.searchQuery.CustomerId;
				delete this.searchQuery.orderNumber;
				delete this.searchQuery.salesCategory;
				delete this.searchQuery.sector;
			


				this.toDate = '';
				this.fromDate = firstDay.slice(0,10);
				this.pageParams.page = 1;
				this.currentTab = 'all';

				let query = Object.assign({}, this.$route.query);
				query.fromDate = firstDay.slice(0,10);
				delete query.toDate;
				delete query.branch;
				delete query.business_type;
				delete query.CustomerId;
				delete query.orderNumber;
				delete query.salesCategory;
				delete query.sector;
				query.tab = 'all';

				this.$router.replace({ query });

				await this.fetchData();
				console.log(this.searchQuery);
			},

			async getRenewalStatuses() {
				this.$LIPS(true);
				let statuses = await get(this.apiUrl?.statuses);
				this.statuses = statuses.data?.data?.prompter_statuses;
				this.statuses = this.statuses.filter((item) => {
					return item.name !== 'not contacted';
				});
				this.$LIPS(false);
			},

			async exportCsv() {
				let param = {
					filterOrderbyBranch: true,
					orderHasAtMostTwoPaymentsLeft: true,
					...this.searchQuery,
				};
				this.$LIPS(true);
				try {
					const response = await get(
						this.apiUrl.renewalListExport + queryParam(param)
					);
					let fileURL = window.URL.createObjectURL(new Blob([response.data]));
					let fileLink = document.createElement('a');
					fileLink.href = fileURL;
					fileLink.setAttribute('download', 'renewals.csv');
					document.body.appendChild(fileLink);
					fileLink.click();
				} catch (error) {
					this.$displayErrorMessage(error);
				} finally {
					this.$LIPS(false);
				}
			},

			showCorrectTab(tab) {
				let tabObject = this.tabs.find((item) => {
					return item.alias === tab;
				});

				this.switchTab(tabObject);
			},

			async getRenewalStatuses() {
				this.$LIPS(true);
				let statuses = await get(this.apiUrl.statuses);
				this.statuses = statuses.data?.data?.prompter_statuses;

				this.statuses = this.statuses.filter((item) => {
					return item.name !== 'not contacted';
				});
			},

			async generateList() {
				this.$LIPS(true);
				let result = await get(this.apiUrl.generateList);
				if(result.data.status === 'success'){
					this.$swal({
						icon: 'success',
						title: 'List generated successfully'
					})
				}else{
					this.$swal({
						icon: 'error',
						title: 'Unable to generate list'
					})
				}
				this.$LIPS(false);
				
			},
			async getBusinessTypes() {
				try {
					console.log('I got here');
					const fetchBusinessTypes = await get(this.apiUrl.businessTypes);
					this.businessTypes = fetchBusinessTypes.data.data.data;
				} catch (err) {
					this.$displayErrorMessage(err);
				}
			},

			async getSalesCategories() {
				try {
					const fetchSalesCategories = await get(this.apiUrl.salesCategoryUrl);
					this.salesCategories = fetchSalesCategories.data.data.data;
				} catch (err) {
					this.$displayErrorMessage(err);
				}
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
				} = response?.data[0];
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

		computed: {
			conversionRate: function() {
				if (this.meta.total) {
					let ans = (this.meta.purchased_renewed / this.meta.total) * 100;
					return ans.toFixed(2) + '%';
				}
				return '';
			},

			canGenerateList: function(){
				let flag = localStorage.getItem('flag')
				return flag === 'beta'
			},

			...mapGetters(['getBranches']),
		},
	};
</script>

<style scoped type="scss">
	.attendance-head .light-heading:nth-child(1) {
		max-width: 120px;
	}
	.reset-button {
		margin-top: 8%;
		float: right;
	}
</style>
