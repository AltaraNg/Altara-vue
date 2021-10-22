<template>
	<transition name="fade">
		<div id="reminder" class="my-4 container-fluid">
			<div class="row">
				<stat-card class="col mx-5" :label="'Total'" :stat="meta.total">
					<template v-slot:svg> <Total class="bi bi-bootstrap-fill"/></template>
				</stat-card>
				<stat-card class="col mx-5" :label="'Contacted'" :stat="meta.contacted">
					<template v-slot:svg class="text-white"><People /></template>
				</stat-card>

				<stat-card
					class="col mx-5"
					:label="'Purchased/Renewed'"
					:stat="meta.purchased_renewed"
				>
					<template v-slot:svg><Purchased /></template>
				</stat-card>
				<stat-card
					class="col mx-5"
					:label="'Interested'"
					:stat="meta.interested"
				>
					<template v-slot:svg><Interested /></template>
				</stat-card>
			</div>
			<div class="mt-5 mb-3 w-75 px-2 py-3">
				<h3>Filter by Date</h3>
				<div class="row">
					<div class="col">
						<date-picker
							class="w-100"
							v-model="fromDate"
							valueType="format"
							placeholder="Date From"
						></date-picker>
					</div>
					<div class="col">
						<date-picker
							class="w-100"
							v-model="toDate"
							valueType="format"
							placeholder="Date To"
						></date-picker>
					</div>
					<button class="my-auto p-2 h-50  rounded float-right bg-default">
						Submit
					</button>

					<button class="my-auto p-2 h-50  rounded float-right bg-default">
						<i class="fas fa-file-export"></i> Download
					</button>
				</div>
			</div>

			<div class="mt-5 mb-3">
				<ul class="nav nav-tabs justify-content-center p-0" role="tablist">
					<li
						class="col p-0 nav-item mb-0"
						v-for="(tab, index) in tabs"
						:key="index"
						@click="switchTab(tab)"
					>
						<a
							aria-selected="true"
							class="nav-link"
							:class="index === 0 && 'active'"
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
			<div v-if="orders.length > 0">
				<div class="tab-content" id="tabContent">
					<div
						class="tab-pane fade show active"
						id="all"
						role="tabpanel"
						aria-labelledby="all-tab"
					>
						<renewal-table :customers="orders" :OId="OId"></renewal-table>
					</div>
					<div
						class="tab-pane fade show"
						id="nc"
						role="tabpanel"
						aria-labelledby="not-contacted-tab"
					>
						<renewal-table :customers="orders" :OId="OId"></renewal-table>
					</div>
					<div
						class="tab-pane fade show"
						id="contacted"
						role="tabpanel"
						aria-labelledby="called-tab"
					>
						<renewal-table :customers="orders" :OId="OId"></renewal-table>
					</div>
					<div
						class="tab-pane fade show"
						id="pr"
						role="tabpanel"
						aria-labelledby="successful-tab"
					>
						<renewal-table :customers="orders" :OId="OId"></renewal-table>
					</div>
					<div
						class="tab-pane fade show"
						id="interested"
						role="tabpanel"
						aria-labelledby="interested-tab"
					>
						<renewal-table :customers="orders" :OId="OId"></renewal-table>
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

			<div v-if="pageParams && orders.length > 0">
				<base-pagination :page-param="pageParams" @fetchData="fetchData">
				</base-pagination>
			</div>
		</div>
	</transition>
</template>

<script>
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
	import BasePagination from '../../../components/Pagination/BasePagination.vue';
	import { onMounted } from 'vue-demi';

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
					renewalListExport: ''
				},
				meta: {},
				renewal: true,
				statuses: '',
				OId: 1,
				currentTab: 'all',
			};
		},

		async mounted() {
			if (localStorage.getItem('activeTab')) {
				this.showCorrectTab();
			} else {
				this.fetchData();
			}
			this.$root.$on('feedback', (payload) => {
				this.fetchData();
			});
			this.$root.$on('owner_updated', (payload) => {
				this.fetchData();
			});
		},
		methods: {
			fetchData() {
				this.$LIPS(true);
				let param = {
					loadRenewalprompter: true,
					isCompletedOrder: true,
					page: this.pageParams.page,
					limit: this.pageParams.limit,
					...this.searchQuery,
				};
				this.currentTab === 'all' ? (param.rollUp = true) : delete param.rollUp;
				if (this.renewal === true) {
					get(this.apiUrl.renewalList + queryParam(param))
						.then(({ data }) => this.prepareList(data))
						.catch(() => Flash.setError('Error Fetching Renewal List'))
						.finally(() => {
							this.$LIPS(false);
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
			switchTab(tab) {
				// localStorage.setItem('activeTab', tab.alias);
				this.currentTab = tab.alias;
				this.searchQuery.renewalPrompterStatus = tab.link;
				localStorage.setItem('activeTab', tab.alias);
				this.fetchData();
			},

			async exportCsv() {
				this.$LIPS(true);
				try {
					const response = await get(this.apiUrl.renewalListExport + queryParam(this.searchQuery))
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

			showCorrectTab() {
				let tab = localStorage.getItem('activeTab');

				let tabObject = this.tabs.find((item) => {
					return item.alias === tab;
				});

				// this.$refs[tab]..classList.value = this.$refs[tab].$el.classList.value + 'active';

				this.switchTab(tabObject);
			},

			async getRenewalStatuses() {
				this.$LIPS(true);
				let statuses = await get(this.apiUrl.statuses);
				this.statuses = statuses.data?.data?.prompter_statuses;
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
	};
</script>

<style scoped type="scss">
	.attendance-head .light-heading:nth-child(1) {
		max-width: 120px;
	}
</style>
