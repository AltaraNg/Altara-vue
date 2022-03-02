<template>
	<transition name="fade">
		<div id="reminder" class="my-4 container-fluid">
			<div class="row">
				<div class="col mx-1">
					<stat-card :label="'Total'" :stat="meta.total">
						<template v-slot:svg
							><img
								src="../../../assets/new_stats.png"
								alt="work"
								style="height=100%"
						/></template>
					</stat-card>
				</div>
				<div class="col mx-1">
					<stat-card :label="'Contacted'" :stat="meta.contacted">
						<template v-slot:svg
							><img
								src="../../../assets/download.png"
								alt="work"
								style="height=100%"
						/></template>
					</stat-card>
				</div>

				<div class="col mx-1">
					<stat-card
						:label="'Purchased/Renewed'"
						:stat="meta.purchased_renewed"
					>
						<template v-slot:svg
							><img src="../../../assets/pic.png" alt="work" style="height=100%"
						/></template>
					</stat-card>
				</div>
				<div class="col mx-1">
					<stat-card :label="'Interested'" :stat="meta.interested">
						<template v-slot:svg
							><img
								src="../../../assets/stat_red.png"
								alt="work"
								style="height=100%"
						/></template>
					</stat-card>
				</div>
				<div class="col mx-1">
					<stat-card
						:label="'Conversion Rate'"
						:stat="conversionRate ? conversionRate : '0%'"
					>
						<template v-slot:svg
							><img
								src="../../../assets/yellow_green.png"
								alt="work"
								style="height=100%"
						/></template>
					</stat-card>
				</div>
			</div>
			<div class="text-right pointer " v-if="canView">
				<router-link to="dsa-stats">
					<span class="mr-3 bg-default rounded p-3">View DSA stats</span>
				</router-link>
			</div>
			<div class="mt-5 mb-3 px-2 py-3 d-flex">
				<div class="w-100">
					<div class="row w-100">
						<h3 class="col">Filters</h3>
					</div>
					<div class="d-flex">
						
							<date-picker
								class="mx-2"
								v-model="fromDate"
								valueType="format"
								placeholder="Date From"
							></date-picker>
						
						
							<date-picker
								class="mx-2"
								v-model="toDate"
								valueType="format"
								placeholder="Date To"
							></date-picker>
						
						<div class="mx-2" v-if="canFilter">
							<select
								v-model="branch"
								class="custom-select"
								name="branch"
								id="branch"
							>
								<option selected value="" disabled>--Select Showroom--</option>
								<option :value="branch.id" v-for="branch in getBranches">
									{{ branch.name }}
								</option>
							</select>
						</div>
						<div class="mx-2">
							<select
								v-model="businessTypeGroup"
								class="custom-select"
								name="product"
								id="product"
							>
								<option selected value="" disabled>--Select Product--</option>
								<option value="product">
									Altara Product
								</option>
								<option value="cash">
									Cash Loan
								</option>
							</select>
						</div>
						<div class="d-flex">
							<div class="mx-2">
							<button
								class="my-auto p-3  btn rounded bg-default w-100"
								@click="searchAction"
							>
								Search
							</button>
							</div>

							<div class="mx-2">
							<button
								class="my-auto p-3 btn rounded mx-2 bg-default w-100"
								@click="resetAction"
							>
								Reset
							</button>
							</div>
						</div>
					</div>
				</div>
				<div class="mt-5 px-1 py-4">
					<button
						class="reset-button p3 rounded bg-default w-100"
						@click="exportCsv"
					>
						<i class="fas fa-file-export"></i> Download names
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
							></renewal-table>
						</div>
						<div
							class="tab-pane fade show"
							id="nc"
							role="tabpanel"
							aria-labelledby="not-contacted-tab"
						>
							<renewal-table
								:customers="orders"
								:OId="OId"
								:statuses="statuses"
								:dsas="dsas"
							></renewal-table>
						</div>
						<div
							class="tab-pane fade show"
							id="contacted"
							role="tabpanel"
							aria-labelledby="called-tab"
						>
							<renewal-table
								:customers="orders"
								:OId="OId"
								:statuses="statuses"
								:dsas="dsas"
							></renewal-table>
						</div>
						<div
							class="tab-pane fade show"
							id="pr"
							role="tabpanel"
							aria-labelledby="successful-tab"
						>
							<renewal-table
								:customers="orders"
								:OId="OId"
								:statuses="statuses"
								:dsas="dsas"
							></renewal-table>
						</div>
						<div
							class="tab-pane fade show"
							id="interested"
							role="tabpanel"
							aria-labelledby="interested-tab"
						>
							<renewal-table
								:customers="orders"
								:OId="OId"
								:statuses="statuses"
								:dsas="dsas"
							></renewal-table>
						</div>
					</div>
				</div>

				<div v-else class="mx-4">
					<zero-state
						:title="'No Renewal List'"
						:message="'There are currrently no customer that can renew'"
					>
						<template v-slot:image>
							<img src="../../../assets/thumb-up.png" />
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
	import { mapGetters } from 'vuex';

	import StatCard from '../../../components/StatCard.vue';
	import RenewalTable from '../../../components/tables/RenewalTable.vue';

	import Total from '../../../assets/css/svgs/total.vue';
	import People from '../../../assets/css/svgs/people.vue';
	import Purchased from '../../../assets/css/svgs/purchased.vue';
	import Interested from '../../../assets/css/svgs/interested.vue';
	import DatePicker from 'vue2-datepicker';
	import 'vue2-datepicker/index.css';
	import { get } from '../../../utilities/api';
	import queryParam from '../../../utilities/queryParam';
	import ZeroState from '../../../components/ZeroState.vue';
	import Flash from '../../../utilities/flash';
	import Roles from '../../../utilities/roles';
	import BasePagination from '../../../components/Pagination/BasePagination.vue';

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
					{ name: 'All', alias: 'all', link: '' },
					{ name: 'Not Contacted', alias: 'nc', link: 'not contacted' },
					{ name: 'Contacted', alias: 'contacted', link: 'contacted' },
					{ name: 'Purchased/Renewed', alias: 'pr', link: 'renewed' },
					{ name: 'Interested', alias: 'interested', link: 'interested' },
				],
				fromDate: null,
				toDate: null,
				pageParams: {},
				searchQuery: { renewalPrompterStatus: '' },
				orders: [],
				apiUrl: {
					renewalList: '/api/renewal/prompters',
					statuses: '/api/renewal/prompters/statuses',
					renewalListExport: '/api/renewal/prompters/customer-list',
					statuses: '/api/renewal/prompters/statuses',
					dsas: `/api/get-users?role=18&limit=200`,
				},
				meta: {},
				branch: '',
				renewal: true,
				statuses: '',
				OId: 1,
				currentTab: 'all',
				statuses: [],
				dsas: [],
				businessTypeGroup: '',
				isProcessing: true,
				role: parseInt(localStorage.getItem('role')),
			};
		},

		async mounted() {
			await this.$prepareBranches();

			await this.getRenewalStatuses();
			await this.fetchDsas();
			var date = new Date(),
				y = date.getFullYear(),
				m = date.getMonth();
			var firstDay = new Date(y, m, 2).toISOString();

			let query = this.$route.query;
			if (!query.fromDate) {
				this.fromDate = firstDay.slice(0, 10);
				this.searchQuery.fromDate = this.fromDate;
			}

			this.searchQuery = {
				...this.searchQuery,
				...query,
			};
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
			await this.getRenewalStatuses();
			await this.fetchDsas();

			this.fetchStats();
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

					branch: this.branch
						? this.branch
						: this.searchQuery.branch
						? this.searchQuery.branch
						: '',

					businessTypeGroup: this.businessTypeGroup
						? this.businessTypeGroup
						: this.searchQuery.businessTypeGroup
						? this.searchQuery.businessTypeGroup
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
					filterOrderbyBranch: true,
					orderHasAtMostTwoPaymentsLeft: true,
					...this.searchQuery,
					page: this.pageParams.page,
					per_page: this.pageParams.per_page,
				};
				this.currentTab === 'all' ? (param.rollUp = true) : this.fetchStats();
				if (this.renewal === true) {
					this.$LIPS(true);

					get(this.apiUrl.renewalList + queryParam(param))
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
				if (tab.alias === 'nc') {
					delete this.searchQuery.renewalPrompterStatus;
					this.searchQuery.unContactedRenewalPrompters = true;
				} else {
					this.searchQuery.renewalPrompterStatus = tab.link;
					delete this.searchQuery.unContactedRenewalPrompters;
				}

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
				this.searchQuery.fromDate = this.fromDate;
				this.searchQuery.toDate = this.toDate;
				this.searchQuery.branch = this.branch;
				this.searchQuery.businessTypeGroup = this.businessTypeGroup;
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
				delete this.searchQuery.fromDate;
				delete this.searchQuery.toDate;
				delete this.searchQuery.branch;
				delete this.searchQuery.businessTypeGroup;
				this.toDate = '';
				this.fromDate = '';
				this.branch = '';
				this.businessTypeGroup = '';
				this.pageParams.page = 1;
				this.currentTab = 'all';

				let query = Object.assign({}, this.$route.query);
				query.fromDate = '';
				delete query.toDate;
				delete query.branch;
				delete query.businessTypeGroup;

				query.tab = 'all';

				this.$router.replace({ query });

				await this.fetchData();
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

		computed: {
			conversionRate: function() {
				if (this.meta.total) {
					let ans = (this.meta.purchased_renewed / this.meta.total) * 100;
					return ans.toFixed(2) + '%';
				}
				return '';
			},
			canView: function() {
				return [
					Roles.president,
					Roles.software_engineering_lead,
					Roles.software_engineer,
					Roles.general_manager,
					Roles.coordinator,
					Roles.dsa_captain,
				].includes(this.role);
			},
			canFilter: function() {
				return [
					Roles.president,
					Roles.software_engineering_lead,
					Roles.software_engineer,
					Roles.general_manager,
					Roles.coordinator,
				].includes(this.role);
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
