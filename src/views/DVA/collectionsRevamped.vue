<template>
	<transition name="fade">
		<div id="reminder" class="my-4 container-fluid">
			<div class="row">
				<div class="col mx-1">
					<stat-card :label="'Total'" :stat="meta.total">
						<template v-slot:svg
							><img
								src="../../assets/new_stats.png"
								alt="work"
								style="height=100%"
						/></template>
					</stat-card>
				</div>
				<div class="col mx-1">
					<stat-card :label="'Total Amount Recovered'" :stat="meta.contacted">
						<template v-slot:svg
							><img
								src="../../assets/download.png"
								alt="work"
								style="height=100%"
						/></template>
					</stat-card>
				</div>

				
				<div class="col mx-1">
					<stat-card
						:label="'Total sales repossessed (Our Product)'"
						:stat="meta.interested"
					>
						<template v-slot:svg
							><img
								src="../../assets/stat_red.png"
								alt="work"
								style="height=100%"
						/></template>
					</stat-card>
				</div>
				<div class="col mx-1">
					<stat-card
						:label="'Total customers item taken'"
						:stat="conversionRate ? conversionRate : '0'"
					>
						<template v-slot:svg
							><img
								src="../../assets/yellow_green.png"
								alt="work"
								style="height=100%"
						/></template>
					</stat-card>
				</div>
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
						<label for="branch" class="form-control-label"
							>SHOWROOM NAME</label
						>
						<select
                            name="branch"
							class="custom-select w-100"
							v-model="searchQuery.branch"
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

                <div class="d-flex px-3">
					<div class="col form-group">
						<label for="business_type" class="form-control-label"
							>SECTOR</label
						>
						<select
                            name="business_type"
							class="custom-select w-100"
							v-model="searchQuery.sector"
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
						<label for="branch" class="form-control-label"
							>TYPE OF SALE</label
						>
						<select
                            name="branch"
							class="custom-select w-100"
							v-model="searchQuery.saleType"
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
						<label for="branch" class="form-control-label"
							>CRITERIA LIST</label
						>
						<select
                            name="branch"
							class="custom-select w-100"
							v-model="searchQuery.criteria"
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
						<label for="branch" class="form-control-label"
							>ITEM REPOSSESSED</label
						>
						<select
                            name="branch"
							class="custom-select w-100"
							v-model="searchQuery.product"
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
							id="nc"
							role="tabpanel"
							aria-labelledby="not-contacted-tab"
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
							id="contacted"
							role="tabpanel"
							aria-labelledby="called-tab"
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
							id="pr"
							role="tabpanel"
							aria-labelledby="successful-tab"
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
							id="interested"
							role="tabpanel"
							aria-labelledby="interested-tab"
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
					{ name: 'All', alias: 'all', link: '' },
					{ name: 'Reminder List', alias: 'rl', link: 'reminder list' },
					{
						name: 'Credit Bureau List',
						alias: 'cbl',
						link: 'credit bureau list',
					},
					{
						name: 'Internal Repossession List',
						alias: 'irl',
						link: 'internal repossession list',
					},
					{
						name: 'External Repossession List',
						alias: 'erl',
						link: 'external repossession list',
					},
				],
				fromDate: null,
				toDate: null,
				pageParams: {},
				searchQuery: {},
				orders: [
					{
                "id": 5,
                "order_number": "AT602D4A40D8",
                "product_id": 89,
                "product": {
                    "id": 89,
                    "name": "Itel P36-1gb",
                    "brand": "Polystar",
                    "category": "Freezers",
                    "retail_price": "33500",
                    "img_url": null,
                    "feature": "",
                    "product_type": "Lifestyle",
                    "is_active": 1,
                    "user": "Admin",
                    "inventories": {},
                    "created_at": "2021-02-12 15:17:34"
                },
                "product_name": "Itel P36-1gb",
                "serial_number": null,
                "repayment_duration": "six_months",
                "repayment_cycle": "bi_monthly",
                "customer_id": 19677,
                "customer_name": "Abass Muyideen",
                "customer_phone": "08074452561",
                "customer_email": "abassmuy@gmail.com",
                "business_type": "Altara Credit Products",
                "status": "Completed",
                "branch": "Challenge",
                "product_price": 55394.3,
                "down_payment": 11000,
                "repayment": 44394.3,
                "discount": [],
                "single_repayment": 3600,
                "custom_date": null,
                "amortization": [
                    {
                        "id": 13,
                        "new_order_id": 5,
                        "expected_payment_date": "2021-03-03",
                        "actual_payment_date": "2021-03-02",
                        "expected_amount": 3600,
                        "actual_amount": 3600,
                        "created_at": "2021-02-17 16:54:25",
                        "updated_at": "2021-03-02 15:29:56"
                    },
                    {
                        "id": 14,
                        "new_order_id": 5,
                        "expected_payment_date": "2021-03-17",
                        "actual_payment_date": "2021-03-10",
                        "expected_amount": 3600,
                        "actual_amount": 3600,
                        "created_at": "2021-02-17 16:54:25",
                        "updated_at": "2021-03-10 16:25:59"
                    },
                    {
                        "id": 15,
                        "new_order_id": 5,
                        "expected_payment_date": "2021-03-31",
                        "actual_payment_date": "2021-03-18",
                        "expected_amount": 3600,
                        "actual_amount": 3600,
                        "created_at": "2021-02-17 16:54:25",
                        "updated_at": "2021-03-18 10:39:57"
                    },
                    {
                        "id": 16,
                        "new_order_id": 5,
                        "expected_payment_date": "2021-04-14",
                        "actual_payment_date": "2021-03-24",
                        "expected_amount": 3600,
                        "actual_amount": 3600,
                        "created_at": "2021-02-17 16:54:25",
                        "updated_at": "2021-03-24 14:28:05"
                    },
                    {
                        "id": 17,
                        "new_order_id": 5,
                        "expected_payment_date": "2021-04-28",
                        "actual_payment_date": "2021-04-07",
                        "expected_amount": 3600,
                        "actual_amount": 3600,
                        "created_at": "2021-02-17 16:54:25",
                        "updated_at": "2021-04-07 16:11:02"
                    },
                    {
                        "id": 18,
                        "new_order_id": 5,
                        "expected_payment_date": "2021-05-12",
                        "actual_payment_date": "2021-04-15",
                        "expected_amount": 3600,
                        "actual_amount": 3600,
                        "created_at": "2021-02-17 16:54:25",
                        "updated_at": "2021-04-15 16:15:26"
                    },
                    {
                        "id": 19,
                        "new_order_id": 5,
                        "expected_payment_date": "2021-05-26",
                        "actual_payment_date": "2021-04-28",
                        "expected_amount": 3600,
                        "actual_amount": 3600,
                        "created_at": "2021-02-17 16:54:25",
                        "updated_at": "2021-04-28 14:02:00"
                    },
                    {
                        "id": 20,
                        "new_order_id": 5,
                        "expected_payment_date": "2021-06-09",
                        "actual_payment_date": "2021-06-03",
                        "expected_amount": 3600,
                        "actual_amount": 3600,
                        "created_at": "2021-02-17 16:54:25",
                        "updated_at": "2021-06-03 15:12:39"
                    },
                    {
                        "id": 21,
                        "new_order_id": 5,
                        "expected_payment_date": "2021-06-23",
                        "actual_payment_date": "2021-06-16",
                        "expected_amount": 3600,
                        "actual_amount": 3600,
                        "created_at": "2021-02-17 16:54:25",
                        "updated_at": "2021-06-16 15:37:58"
                    },
                    {
                        "id": 22,
                        "new_order_id": 5,
                        "expected_payment_date": "2021-07-07",
                        "actual_payment_date": "2021-07-01",
                        "expected_amount": 3600,
                        "actual_amount": 3600,
                        "created_at": "2021-02-17 16:54:25",
                        "updated_at": "2021-07-01 16:29:32"
                    },
                    {
                        "id": 23,
                        "new_order_id": 5,
                        "expected_payment_date": "2021-07-21",
                        "actual_payment_date": "2021-07-29",
                        "expected_amount": 3600,
                        "actual_amount": 1800,
                        "created_at": "2021-02-17 16:54:25",
                        "updated_at": "2021-07-29 13:46:42"
                    },
                    {
                        "id": 24,
                        "new_order_id": 5,
                        "expected_payment_date": "2021-08-04",
                        "actual_payment_date": "2021-07-29",
                        "expected_amount": 3600,
                        "actual_amount": 1800,
                        "created_at": "2021-02-17 16:54:25",
                        "updated_at": "2021-07-29 13:46:54"
                    }
                ],
                "notifications": [],
                "order_payment_method": null,
                "customer": {
                    "id": 19677,
                    "employee_name": "Olaleye Olalekan Rotimi",
                    "user_id": 161,
                    "managed_by": null,
                    "employee_id": "AC/C/168/19",
                    "date_of_registration": "2020-07-11",
                    "branch_id": 2,
                    "first_name": "Abass",
                    "middle_name": "Abass.",
                    "last_name": "Muyideen",
                    "add_nbstop": "odo oba",
                    "add_street": "ori aje",
                    "area_address": "odo oba",
                    "add_houseno": "s7/218",
                    "add_addinfo_description": "ibadan",
                    "city": "ibadan",
                    "state": "Oyo",
                    "telephone": "08074452561",
                    "email": "abassmuy@gmail.com",
                    "gender": "male",
                    "date_of_birth": "1984-08-05T23:00:00.000Z",
                    "civil_status": "married",
                    "occupation": "Manufacturing laborer",
                    "year_together": 10,
                    "type_of_home": "rented",
                    "no_of_rooms": "more than Two room",
                    "duration_of_residence": 7,
                    "people_in_household": 4,
                    "number_of_work": 3,
                    "depend_on_you": 2,
                    "number_of_children": 2,
                    "level_of_education": "secondary",
                    "visit_hour_from": "07:21",
                    "visit_hour_to": "19:00",
                    "loan_from_institution": "no",
                    "loan_amount": null,
                    "did_you_pay_back": null,
                    "employment_status": "formal",
                    "working_individual_Phone_number": "08074452561",
                    "name_of_company_or_business": "Eagle flour",
                    "cadd_nbstop": "toll gate",
                    "cadd_addinfo": "ibadan",
                    "company_city": "ibadan",
                    "company_state": "Oyo",
                    "company_telno": "08074452561",
                    "receive_income_means": null,
                    "post_in_company": null,
                    "days_of_work": "Monday Tuesday Wednesday Thursday Friday monday thursday tuesday friday wednesday",
                    "market_name": "toll gate",
                    "bank_account": "Yes",
                    "monthly_gains": "70000",
                    "years_of_existence_or_work_duration": "between 4 - 9 years",
                    "comp_street_name": "zartech",
                    "comp_house_no": "09",
                    "comp_area": "ibadan",
                    "current_sal_or_business_income": "80000",
                    "payment_period": null,
                    "cvisit_hour_from": "10:25",
                    "cvisit_hour_to": "20:00",
                    "nextofkin_first_name": "Gbadamosi",
                    "nextofkin_middle_name": ".",
                    "nextofkin_last_name": "Olawale",
                    "nextofkin_relationship": "sibling",
                    "nextofkin_gender": "male",
                    "nextofkin_telno": "08071077735",
                    "nextofkin_work_duration": "between 4 - 9 years",
                    "work_guarantor_first_name": "Akeem",
                    "work_guarantor_middle_name": ".",
                    "work_guarantor_last_name": "Olawuyi",
                    "work_guarantor_relationship": "neighbouring worker",
                    "guaadd_nbstop": "odo oba",
                    "guaadd_street": "ola mummy",
                    "guaadd_houseno": "19",
                    "guaadd_addinfo": "ibadan",
                    "gua_area": "odo oba",
                    "work_guarantor_city": "ibadan",
                    "work_guarantor_state": "Oyo",
                    "work_guarantor_gender": "male",
                    "work_guarantor_telno": "08126863654",
                    "work_guarantor_work_duration": "between 4 - 9 years",
                    "personal_guarantor_first_name": "Gbadamosi",
                    "personal_guarantor_middle_name": "Akeem.",
                    "personal_guarantor_last_name": "Olawale",
                    "personal_guarantor_relationship": "friend",
                    "personal_guarantor_city": "ibadan",
                    "personal_guarantor_state": "Oyo",
                    "pguaadd_nbstop": "odo oba",
                    "pguaadd_street": "ola mummy",
                    "pguaadd_houseno": "31",
                    "pguaadd_addinfo": "ibadan",
                    "pgua_area": "odo oba",
                    "personal_guarantor_gender": "male",
                    "personal_guarantor_telno": "08071077735",
                    "personal_guarantor_work_duration": "between 4 - 9 years",
                    "what_product_do_you_need": "maxi tv",
                    "what_do_you_need_it_for": "Personal",
                    "created_at": "2020-07-11 09:33:52",
                    "updated_at": "2020-07-11 09:33:52",
                    "reg_id": null
                },
                "order_date": "2021-10-17",
                "owner": "Olawunmi Titilayo Yinka",
                "sales_type": {
                    "id": 2,
                    "name": "renewal(DSA)",
                    "created_at": null,
                    "updated_at": null
                },
                "branch_id": 2,
                "owner_id": 618,
                "down_payment_rate": "twenty plus two",
                "payment_gateway": null,
                "order_type": "Altara Credit",
                "renewal_prompters": {
                    "data": [
                        {
                            "id": 1,
                            "attributes": {
                                "order_id": 5,
                                "renewal_prompter_status": "contacted",
                                "owner": "Olawunmi Titilayo Yinka",
                                "creator": "Oladeji Omodamola Oluwagbemisola",
                                "branch": "Challenge",
                                "feedback": "done",
                                "created_at": "2021-10-20T08:57:49.000000Z",
                                "updated_at": "2021-10-20T08:57:49.000000Z"
                            }
                        },
                        {
                            "id": 2,
                            "attributes": {
                                "order_id": 5,
                                "renewal_prompter_status": "renewed",
                                "owner": "Olawunmi Titilayo Yinka",
                                "creator": "Oladeji Omodamola Oluwagbemisola",
                                "branch": "Challenge",
                                "feedback": "done",
                                "created_at": "2021-10-20T20:48:45.000000Z",
                                "updated_at": "2021-10-20T20:48:45.000000Z"
                            }
                        },
                        {
                            "id": 3,
                            "attributes": {
                                "order_id": 5,
                                "renewal_prompter_status": "renewed",
                                "owner": "Olawunmi Titilayo Yinka",
                                "creator": "Oladeji Omodamola Oluwagbemisola",
                                "branch": "Challenge",
                                "feedback": "good",
                                "created_at": "2021-10-20T20:49:40.000000Z",
                                "updated_at": "2021-10-20T20:49:40.000000Z"
                            }
                        },
                        {
                            "id": 4,
                            "attributes": {
                                "order_id": 5,
                                "renewal_prompter_status": "interested",
                                "owner": "Olawunmi Titilayo Yinka",
                                "creator": "Oladeji Omodamola Oluwagbemisola",
                                "branch": "Challenge",
                                "feedback": "go away",
                                "created_at": "2021-10-20T22:21:54.000000Z",
                                "updated_at": "2021-10-20T22:21:54.000000Z"
                            }
                        },
                        {
                            "id": 5,
                            "attributes": {
                                "order_id": 5,
                                "renewal_prompter_status": "contacted",
                                "owner": "Olawunmi Titilayo Yinka",
                                "creator": "Oladeji Omodamola Oluwagbemisola",
                                "branch": "Challenge",
                                "feedback": "done",
                                "created_at": "2021-10-21T08:33:41.000000Z",
                                "updated_at": "2021-10-21T08:33:41.000000Z"
                            }
                        },
                        {
                            "id": 10,
                            "attributes": {
                                "order_id": 5,
                                "renewal_prompter_status": "contacted",
                                "owner": "Olawunmi Titilayo Yinka",
                                "creator": "Oladeji Omodamola Oluwagbemisola",
                                "branch": "Challenge",
                                "feedback": "yes",
                                "created_at": "2021-10-22T03:15:03.000000Z",
                                "updated_at": "2021-10-22T03:15:03.000000Z"
                            }
                        },
                        {
                            "id": 15,
                            "attributes": {
                                "order_id": 5,
                                "renewal_prompter_status": "contacted",
                                "owner": "Olawunmi Titilayo Yinka",
                                "creator": "Oladeji Omodamola Oluwagbemisola",
                                "branch": "Challenge",
                                "feedback": "yes",
                                "created_at": "2021-10-22T03:57:15.000000Z",
                                "updated_at": "2021-10-22T03:57:15.000000Z"
                            }
                        },
                        {
                            "id": 16,
                            "attributes": {
                                "order_id": 5,
                                "renewal_prompter_status": "renewed",
                                "owner": "Olawunmi Titilayo Yinka",
                                "creator": "Oladeji Omodamola Oluwagbemisola",
                                "branch": "Challenge",
                                "feedback": "good",
                                "created_at": "2021-10-22T03:57:49.000000Z",
                                "updated_at": "2021-10-22T03:57:49.000000Z"
                            }
                        },
                        {
                            "id": 17,
                            "attributes": {
                                "order_id": 5,
                                "renewal_prompter_status": "contacted",
                                "owner": "Olawunmi Titilayo Yinka",
                                "creator": "Oladeji Omodamola Oluwagbemisola",
                                "branch": "Challenge",
                                "feedback": "yes",
                                "created_at": "2021-10-22T04:02:48.000000Z",
                                "updated_at": "2021-10-22T04:02:48.000000Z"
                            }
                        },
                        {
                            "id": 18,
                            "attributes": {
                                "order_id": 5,
                                "renewal_prompter_status": "contacted",
                                "owner": "Olawunmi Titilayo Yinka",
                                "creator": "Oladeji Omodamola Oluwagbemisola",
                                "branch": "Challenge",
                                "feedback": "goodds",
                                "created_at": "2021-10-22T04:12:34.000000Z",
                                "updated_at": "2021-10-22T04:12:34.000000Z"
                            }
                        },
                        {
                            "id": 20,
                            "attributes": {
                                "order_id": 5,
                                "renewal_prompter_status": "interested",
                                "owner": "Olawunmi Titilayo Yinka",
                                "creator": "Olaosebikan",
                                "branch": "Challenge",
                                "feedback": "okay",
                                "created_at": "2021-10-22T09:01:40.000000Z",
                                "updated_at": "2021-10-22T09:01:40.000000Z"
                            }
                        },
                        {
                            "id": 21,
                            "attributes": {
                                "order_id": 5,
                                "renewal_prompter_status": "interested",
                                "owner": "Olawunmi Titilayo Yinka",
                                "creator": "Olaosebikan",
                                "branch": "Challenge",
                                "feedback": "okay",
                                "created_at": "2021-10-22T09:02:44.000000Z",
                                "updated_at": "2021-10-22T09:02:44.000000Z"
                            }
                        },
                        {
                            "id": 24,
                            "attributes": {
                                "order_id": 5,
                                "renewal_prompter_status": "renewed",
                                "owner": "Olawunmi Titilayo Yinka",
                                "creator": "Olaosebikan",
                                "branch": "Challenge",
                                "feedback": "okay yes",
                                "created_at": "2021-10-23T14:56:40.000000Z",
                                "updated_at": "2021-10-23T14:56:40.000000Z"
                            }
                        },
                        {
                            "id": 29,
                            "attributes": {
                                "order_id": 5,
                                "renewal_prompter_status": "contacted",
                                "owner": "Olawunmi Titilayo Yinka",
                                "creator": "Oladeji Omodamola Oluwagbemisola",
                                "branch": "Challenge",
                                "feedback": "good",
                                "created_at": "2021-10-27T12:49:52.000000Z",
                                "updated_at": "2021-10-27T12:49:52.000000Z"
                            }
                        },
                        {
                            "id": 30,
                            "attributes": {
                                "order_id": 5,
                                "renewal_prompter_status": "interested",
                                "owner": "Olawunmi Titilayo Yinka",
                                "creator": "Olaosebikan",
                                "branch": "Challenge",
                                "feedback": "ok",
                                "created_at": "2021-10-27T13:18:32.000000Z",
                                "updated_at": "2021-10-27T13:18:32.000000Z"
                            }
                        },
                        {
                            "id": 32,
                            "attributes": {
                                "order_id": 5,
                                "renewal_prompter_status": "contacted",
                                "owner": "Olawunmi Titilayo Yinka",
                                "creator": "Olaosebikan",
                                "branch": "Challenge",
                                "feedback": "okay",
                                "created_at": "2021-10-27T14:17:53.000000Z",
                                "updated_at": "2021-10-27T14:17:53.000000Z"
                            }
                        },
                        {
                            "id": 35,
                            "attributes": {
                                "order_id": 5,
                                "renewal_prompter_status": "interested",
                                "owner": "Olawunmi Titilayo Yinka",
                                "creator": "Olaosebikan",
                                "branch": "Challenge",
                                "feedback": "soon",
                                "created_at": "2021-10-29T14:55:44.000000Z",
                                "updated_at": "2021-10-29T14:55:44.000000Z"
                            }
                        },
                        {
                            "id": 44,
                            "attributes": {
                                "order_id": 5,
                                "renewal_prompter_status": "renewed",
                                "owner": "Olawunmi Titilayo Yinka",
                                "creator": "Olaosebikan",
                                "branch": "Challenge",
                                "feedback": "yah",
                                "created_at": "2021-11-01T14:16:05.000000Z",
                                "updated_at": "2021-11-01T14:16:05.000000Z"
                            }
                        },
                        {
                            "id": 72,
                            "attributes": {
                                "order_id": 5,
                                "renewal_prompter_status": "contacted",
                                "owner": "Olawunmi Titilayo Yinka",
                                "creator": "Olaosebikan",
                                "branch": "Challenge",
                                "feedback": "ok",
                                "created_at": "2021-11-23T13:12:40.000000Z",
                                "updated_at": "2021-11-23T13:12:40.000000Z"
                            }
                        },
                        {
                            "id": 82,
                            "attributes": {
                                "order_id": 5,
                                "renewal_prompter_status": "renewed",
                                "owner": "Olawunmi Titilayo Yinka",
                                "creator": "Olaosebikan",
                                "branch": "Challenge",
                                "feedback": "yes o",
                                "created_at": "2021-12-06T15:31:44.000000Z",
                                "updated_at": "2021-12-06T15:31:44.000000Z"
                            }
                        }
                    ]
                },
                "last_renewal_prompter_activity": {
                    "id": 82,
                    "attributes": {
                        "order_id": 5,
                        "renewal_prompter_status": "renewed",
                        "owner": "Olawunmi Titilayo Yinka",
                        "creator": "Olaosebikan",
                        "branch": "Challenge",
                        "feedback": "yes o",
                        "created_at": "2021-12-06T15:31:44.000000Z",
                        "updated_at": "2021-12-06T15:31:44.000000Z"
                    }
                },
                "order_discount": null
            },
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
					renewalList: '/api/renewal/prompters',
					statuses: '/api/renewal/prompters/statuses',
					renewalListExport: '/api/renewal/prompters/customer-list',
					statuses: '/api/renewal/prompters/statuses',
					dsas: `/api/get-users?role=18&limit=200`,
				},
				meta: {},
				renewal: true,
				statuses: '',
				OId: 1,
                businessTypes: [],
				currentTab: 'all',
				statuses: [],
				dsas: [],
				isProcessing: true,
				role: parseInt(localStorage.getItem('role')),
			};
		},

		async mounted() {
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
				// await this.fetchData();
			}
			this.$root.$on('feedback', (payload) => {
				this.fetchData();
			});
			this.$root.$on('owner_updated', (payload) => {
				this.fetchData();
			});
			// await this.getRenewalStatuses();
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
				console.log(this.searchQuery);
				this.toDate = '';
				this.fromDate = '';
				this.pageParams.page = 1;
				this.currentTab = 'all';

				let query = Object.assign({}, this.$route.query);
				query.fromDate = '';
				delete query.toDate;
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
