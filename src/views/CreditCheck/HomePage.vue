<template>
    <transition name="fade">
        <div>
            <div v-for="portal in portals" :key="portal.id">
                <portal-card :url="portal.url" :title="portal.title" :url_c="portal.url_c" :desc="portal.desc" :aces="portal.aces"/>
            </div>
        </div>
    </transition>
</template>
<script>
    import PortalCard from '../../components/portalCard';

    export default {
        components: {PortalCard},
        data() {
            return {
                portals: [
                   
                    {
                        id: 2,
						url: 'lookup',
						title: 'Customer Lookup',
						url_c: 'Manage customer repayment details',
						desc: 'Customer Lookup',
                        aces: this.$store.getters.auth('CreditCheckAccess'),

					},
                ]
            }
        }
    }
</script>
