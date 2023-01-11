<template>
  <transition name="fade">
    <div>
      <div v-for="portal in portals">
        <portal-card
          :url="portal.url"
          :title="portal.title"
          :url_c="portal.url_c"
          :desc="portal.desc"
        />
      </div>
    </div>
  </transition>
</template>
<script>
import PortalCard from "../../components/portalCard";

export default {
  components: { PortalCard },
  data() {
    return {
      portals: [
      {
          url: 'bnpl-vendors',
          title: 'BNPL Vendors',
          url_c: 'Manage BNPL Vendors',
          desc: 'Manage BNPL Vendors',
        },
        {
          url: 'bnpl-orders',
          title: 'BNPL Orders',
          url_c: 'Manage BNPL Orders',
          desc: 'Manage BNPL Orders',
        },
        {
          url: 'bnpl-dashboard',
          title: 'BNPL Dashboard',
          url_c: 'View BNPL Dashboard',
          desc: 'View BNPL Dashboard',
        },
      ],
    };
  },
};
</script>