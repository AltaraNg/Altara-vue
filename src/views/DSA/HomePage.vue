<template>
	<transition name="fade">
		<div>
			<div v-for="portal in portals">
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
		data() {
			return {
				portals: [
					{
						url: 'customer/create',
						title: 'Customer Registration',
						url_c: 'Register new customer now!',
						desc: 'Registering new customers',
					},
					{
						url: 'customer/update',
						title: 'Customer Update',
						url_c: 'Update customers details!',
						desc: 'Updating customers details',
					},
					{
						url: 'report',
						title: 'Sales Reporting',
						url_c: 'Get Reports',
						desc: 'Real time DSA reports!',
						aces: this.$store.getters.auth('DSACaptain'),
					},
					{
						url: '/customer',
						title: 'Customer List',
						url_c: 'View Customer List',
						desc: 'View all registered customers!',
					},
					{
						url: 'renewal',
						title: 'Renewal list Revamped',
						url_c: 'View Renewals',
						desc: 'View renewal list!',
					},
				],
			};
		},
	};
</script>
