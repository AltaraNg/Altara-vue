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
import PortalCard from '../../components/portalCard'
export default {
  components: { PortalCard },
  data() {
    return {
      portals: [
        {
          url: 'reporting',
          title: 'Daily Invoice Report',
          url_c: 'View daily report',
          desc: 'View daily report',
        },
         {
          url: 'repayment-schedule',
          title: 'Repayment Schedule',
          url_c: 'View repayment schedule',
          desc: 'View repayment schedule',
        },

        {
          url: 'reminder-reporting',
          title: 'Reminder and Collection Charts',
          url_c: 'View reminder report',
          desc: 'View reminder report',
        },
        {
						url: 'raffle_code_generator',
						title: 'Raffle Code Generator',
						url_c: 'Generate Raffle Code',
						desc: 'Generate Raffle Code for Prospective Customers',
        },
      ],
    }
  },
}
</script>
