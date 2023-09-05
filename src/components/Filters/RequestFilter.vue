<template>
	<div>
		<div class="d-flex ">
			<div class="mx-1">
				<input type="text" placeholder="Phone number" class="mx-input w-100" v-model="phoneNumber" />
			</div>
			<div class="mx-1">
				<input type="text" class="mx-input w-100" placeholder="Customer Name" v-model="customerName" />
			</div>
			<div class="w-25 mx-1">
				<select class="custom-select w-100" v-model="orderType">
					<option value="" selected>--Order Type--</option>
					<option value="cash">Cash</option>
					<option value="product">Product</option>
				</select>
			</div>
			<div class="w-25 mx-1">
				<select name="status" id="status" class="custom-select w-100" v-model="status">
					<option value="" selected>--status--</option>
					<option :value="status.value" v-for="status in statuses" :key="status.value">
						{{ status.value }}
					</option>
				</select>
			</div>
			<date-picker
				v-model="fromDate"
				placeholder="Date From"
				class="w-25 mx-1"
				valueType="format"
			></date-picker>
			<date-picker
				v-model="toDate"
				placeholder="Date To"
				class="w-25 mx-1"
				valueType="format"
			></date-picker>
		</div>
        <div class="m-auto text-center my-2">
		<button class="bg-default p-2 w-25 mx-2 my-2" @click="searchAction">Search</button>
		<button class="bg-default p-2 w-25 mx-2 my-2" @click="resetAction">Reset</button>
        </div>
	</div>
</template>

<script>
	import DatePicker from 'vue2-datepicker';
	import 'vue2-datepicker/index.css';

	export default {

		data() {
			return {
				fromDate: '',
				toDate: '',
                status: '',
                phoneNumber: '',
                customerName: '',
                orderType: '',
                selectedFilters: {},
				statuses: [
					{ value: 'pending' },
					{ value: 'processing' },
					{ value: 'declined' },
					{ value: 'accepted' },
				],
			};
		},
		components: {
			DatePicker,
		},
		mounted(){
			if(this.$route.query){
				let obj = this.$route.query;
				obj.fromDate ? this.fromDate = obj.fromDate : '' ;
				obj.toDate ? this.toDate = obj.toDate : '';
				obj.status ? this.status = obj.status : '';
				obj.phoneNumber ? this.phoneNumber = obj.phoneNumber : '';
				obj.orderType ? this.orderType = obj.orderType : '';
				obj.customerName ? this.customerName = obj.customerName : '';
			}
		},
		methods: {
			searchAction() {
                this.fromDate !== '' ? this.selectedFilters.fromDate = this.fromDate : '';
                this.toDate !== '' ? this.selectedFilters.toDate = this.toDate : '';
                this.status !== '' ? this.selectedFilters.status = this.status : '';
                this.orderType !== '' ? this.selectedFilters.orderType = this.orderType : '';
                this.customerName !== '' ? this.selectedFilters.customerName = this.customerName : '';
                this.phoneNumber !== '' ? this.selectedFilters.phoneNumber = this.phoneNumber : '';
				this.$emit('searchParams',this.selectedFilters);
			},
            resetAction() {
                this.fromDate = '';
				this.toDate = '';
                this.status = '';
                this.phoneNumber = '';
                this.customerName = '';
                this.orderType = '';
                this.selectedFilters = {};
				this.$emit('searchParams',this.selectedFilters);
                
            }
		},
	};
</script>

<style lang="scss" scoped></style>
