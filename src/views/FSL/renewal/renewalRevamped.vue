<template>
	<transition name="fade">
		<div id="reminder" class="my-4 container-fluid">
			<div class="row">
				<stat-card
					class="col mx-5"
					:label="'Total'"
					:stat="25"
					:style="'background-color: #875953; color: white'"
				>
					<template v-slot:svg> <Total class="bi bi-bootstrap-fill"/></template>
				</stat-card>
				<stat-card
					class="col mx-5"
					:label="'Contacted'"
					:stat="25"
					style="background-color: #80DED9"
				>
					<template v-slot:svg class="text-white"><People /></template>
				</stat-card>

				<stat-card
					class="col mx-5"
					:label="'Purchased/Renewed'"
					:stat="25"
					style="background-color: #FFE900"
				>
					<template v-slot:svg><Purchased /></template>
				</stat-card>
				<stat-card
					class="col mx-5"
					:label="'Interested'"
					:stat="25"
					style="background-color: #2975A5"
				>
					<template v-slot:svg><Interested /></template>
				</stat-card>
			</div>
			<div class="mt-5 mb-3 w-50 px-2 py-3">
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
				</div>
			</div>

			<div class="mt-5 mb-3">
				<ul class="nav nav-tabs justify-content-center p-0" role="tablist">
					<li
						class="col p-0 nav-item mb-0"
						v-for="(tab, index) in tabs"
						:key="index"
					>
						<a
							aria-selected="true"
							class="nav-link"
							:class="index === 0 && 'active'"
							data-toggle="tab"
							:href="`#${tab}`"
							role="tab"
							v-html="tab"
						>
						</a>
					</li>
				</ul>
			</div>
			<div class="tab-content" id="tabContent">
				<div
					class="tab-pane fade show active"
					id="All"
					role="tabpanel"
					aria-labelledby="all-tab"
				>
					<renewal-table></renewal-table>
				</div>
				<div
					class="tab-pane fade show"
					id="Not Contacted"
					role="tabpanel"
					aria-labelledby="not-contacted-tab"
				>
					<renewal-table></renewal-table>
				</div>
				<div
					class="tab-pane fade show"
					id="Contacted"
					role="tabpanel"
					aria-labelledby="called-tab"
				>
					<renewal-table></renewal-table>
				</div>
				<div
					class="tab-pane fade show"
					id="Purchased/Renewed"
					role="tabpanel"
					aria-labelledby="successful-tab"
				>
					<renewal-table></renewal-table>
				</div>
				<div
					class="tab-pane fade show"
					id="Interested"
					role="tabpanel"
					aria-labelledby="failed-tab"
				>
					<renewal-table></renewal-table>
				</div>
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

	export default {
		components: {
			StatCard,
			Total,
			RenewalTable,
			People,
			Purchased,
			Interested,
			DatePicker,
		},
		data() {
			return {
				tabs: [
					'All',
					'Not Contacted',
					'Contacted',
					'Purchased/Renewed',
					'Interested',
				],
				fromDate: null,
				toDate: null,
			};
		},
		methods: {},
	};
</script>

<style scoped type="scss">
	.attendance-head .light-heading:nth-child(1) {
		max-width: 120px;
	}
</style>
