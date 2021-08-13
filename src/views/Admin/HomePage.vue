<template>
    <transition name="fade">
        <div>
            <div v-for="portal in portals">
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
                        url: 'reporting', title: 'Reporting Tool', url_c: 'View daily report',
                        desc: 'View daily report',
                    },
                    
                ]
            }
        }
    }
</script>
