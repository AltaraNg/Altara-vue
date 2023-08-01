<template>
	<transition name="fade">
		<div>
			<div v-for="portal in filteredArray">
				<portal-card 
					:url="portal.url"
					:title="portal.title"
					:url_c="portal.url_c"
					:desc="portal.desc"
					:aces="portal.aces"
				/>
			</div>
		</div>
	</transition>
</template>
<script>
	import PortalCard from '../../components/portalCard';

	export default {
		components: { PortalCard },
		methods: {
			auth(role) {
				return this.$store.getters.auth(role);
			},
		},
		data() {
			return {
				portals: [
					{
						url: 'attendance/create',
						title: 'Log Daily Attendance',
						url_c: 'Log Attendance!',
						desc: 'For Logging staff attendances!',
						aces: this.auth('supervisor'),
					},
					{
						url: 'branch',
						title: 'Manage Branches',
						url_c: 'Manage Branches now!',
						desc: 'Manage all the branch details',
						aces: this.auth('FSLLead'),
					},
					{
						url: '/customer',
						title: 'Customer List',
						url_c: 'View Customer List',
						desc: 'View all registered customers!',
					},
					{
						url: 'sales',
						title: 'Sales List',
						url_c: 'View Sales List',
						desc: 'View all Sales!' /*, aces: this.auth('FSLLead')*/,
					},

					{
						url: 'lookup',
						title: 'Customer Lookup',
						url_c: 'Manage customer repayment details',
						desc: 'Customer Lookup',
					},
					{
						url: 'reminder/renewal',
						title: 'Renewal list',
						url_c: 'View Renewals',
						desc: 'View all renewal!',
					},

					{
						url: 'renewal',
						title: 'Renewal list Revamped',
						url_c: 'View Renewals',
						desc: 'View renewal list!',
					},
					{
						url: 'payment-logger',
						title: 'Payment Logger',
						url_c: 'Log payment by customer',
						desc: 'Log all payments',
					},
					{
						url: 'sales-logger',
						title: 'Sales Logger',
						url_c: 'Log sales in showroom',
						desc: 'Log all sales',
					},
					{
						url: 'dashboard',
						title: 'Showroom Dashboard',
						url_c: 'View Dashboard for showroom',
						desc: 'View Dashboard',
					},

					{
						url: 'customer/create',
						title: 'Customer Registration',
						url_c: 'Register new customer now!',
						desc: 'Registering new customers',
					},
          	{
						url: 'order-request',
						title: 'Order Request',
						url_c: 'Order Request from mobile app',
						desc: 'Order Request from mobile app',
					},
					 	{
						url: 'raffle_code_generator',
						title: 'Raffle Code Generator',
						url_c: 'Generate Raffle Code for Prospective Customers',
						desc: 'Generate Raffle Code for Prospective Customers',
					},
				],
			};
		},
		computed:{
			  filteredArray() {
			if (!localStorage.getItem('flag') ) {
				return this.portals.filter(item => item.url !== 'raffle_code_generator');
			} else {
				return this.portals;
			}
		}
		}
	};
</script>
