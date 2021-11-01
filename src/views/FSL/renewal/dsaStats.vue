<template>
	<div class="container-fluid mt-5  mx-4" v-if="isProcessing === false">
		<h3 class="h3 mx-3 my-2">Top 10 DSAs In Renewal</h3>

		<div class="w-50 mx-0">
			<div class="row w-100 mx-2">
				<h5 class="col">Filter by Date</h5>
			</div>
			<div class="d-flex mb-3">
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
				<div class="col d-flex">
					<button
						class="my-auto p-2 mx-2 h4  rounded bg-default w-100"
						@click="searchAction"
					>
						Search
					</button>
					<button
						class="my-auto p-2 h4 rounded mx-2 bg-default w-100"
						@click="resetAction"
					>
						Reset
					</button>
				</div>
			</div>
		</div>

		<div class="mx-3 card" v-if="agents.length > 0">
			<table
				class="table table-striped table-bordered table-hover"
				style="font-size: 14px;"
			>
				<thead>
					<tr>
						<th v-for="header in headers">
							{{ header }}
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(agent, index) in agents">
						<td>{{ index + 1 }}</td>

						<td>{{ agent.agent_name }}</td>
						<td>{{ agent.number_sales }}</td>
						<td>{{ agent.total_renewals }}</td>
						<!-- <td>{{((agent.total_renewals / agent.number_sales) * 100).toFixed(2)}}</td> -->
						<td>
							<div
								class="progress-container"
								:class="
									getPercent(agent) >= 50
										? 'progress-success'
										: 'progress-primary'
								"
							>
								<span class="progress-badge font-weight-bold"
									>{{ getPercent(agent) }} %</span
								>
								<div class="progress" style="height: 8px;">
									<div
										class="progress-bar"
										role="progressbar"
										:aria-valuenow="getPercent(agent)"
										aria-valuemin="0"
										aria-valuemax="100"
										:style="{
											'width': getPercent(agent) + '%',
											'font-weight': '',
										}"
									></div>
								</div>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div v-else>
			<zero-state
				:title="'No Agents List'"
				:message="'There are currrently no agents to view'"
			>
				<template v-slot:image>
					<img src="../../../assets/thumb-up.png" />
				</template>
			</zero-state>
		</div>
	</div>
</template>

<script>
	import { get } from '../../../utilities/api';
	import flash from '../../../utilities/flash';
	import DatePicker from 'vue2-datepicker';
	import 'vue2-datepicker/index.css';
	import queryParam from '../../../utilities/queryParam';
	import ZeroState from '../../../components/ZeroState.vue';
	export default {
		components: {
			DatePicker,
			ZeroState,
		},
		data() {
			return {
				apiUrl: {
					filterOrderbyBranch: true,
					// agentList: "/api/renewal/prompters/stats?filterOrderbyBranch=true"
					agentList: '/api/renewal/prompters/stats',
				},
				error: [],

				headers: [
					'S/N',
					'Name',
					'Total Sales',
					'Total Renewals',
					'Conversion Rate (%)',
				],
				agents: [],
				fromDate: '',
				toDate: '',
				searchQuery: {},
				isProcessing: false,
			};
		},

		beforeMount() {
			var date = new Date(),
				y = date.getFullYear(),
				m = date.getMonth();
			var firstDay = new Date(y, m, 2).toISOString();
			this.fromDate = firstDay.slice(0, 10);

			let query = this.$route.query;
			this.searchQuery = {
				...this.searchQuery,
				...query,
			};
			this.fetchDsaStats();
		},
		mounted() {},

		methods: {
			async fetchDsaStats() {
                this.isProcessing = true
				this.searchQuery = {
                    orderHasTwoPaymentsLeft: true,
					filterOrderByBranch: true,
					fromDate: this.fromDate,
					toDate: this.toDate,
				};
				this.$LIPS(true);
				let list = await get(
					this.apiUrl.agentList + queryParam(this.searchQuery)
				)
					.catch((error) => {
						flash.setError(error.response);
					})
					.finally(() => {
						this.$LIPS(false);
                        this.isProcessing = false;
					});
				this.agents = list.data?.data?.renewal_prompter_agents_stat;
			},

			getPercent(agent) {
				return Math.round((agent.total_renewals / agent.number_sales) * 100);
			},

			searchAction() {
				this.searchQuery.toDate = this.toDate;
				this.searchQuery.fromDate = this.fromDate;
				this.fetchDsaStats();
				this.$router.replace({
					query: Object.assign({}, this.$route.query, { ...this.searchQuery }),
				});
			},
			async resetAction() {
				delete this.searchQuery.fromDate;
				delete this.searchQuery.toDate;
				this.toDate = '';
				this.fromDate = '';

				let query = Object.assign({}, this.$route.query);
				delete query.fromDate;
				delete query.toDate;
				query.tab = 'all';

				this.$router.replace({ query });

				await this.fetchDsaStats();
			},
		},
	};
</script>

<style lang="scss" scoped></style>
