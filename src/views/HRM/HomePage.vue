<template>
  <transition name="fade">
    <div>
      <div v-for="(portal, index) in portals" :key="index">
        <portal-card
          :desc="portal.desc"
          :title="portal.title"
          :url="portal.url"
          :url_c="portal.url_c"
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
            url: "employee",
            title: "Staff Management",
            url_c: "Manage staff Details!",
            desc: "For Registering new staff",
          },
          {
            url: "attendance",
            title: "Manage Attendance",
            url_c: "Manage Attendance!",
            desc: "Managing staff attendance",
          },
          {
            url: "caution",
            title: "Manage Caution",
            url_c: "Manage Caution!",
            desc: "Managing staff caution",
          },
          {
            url: "message",
            title: "Messaging",
            url_c: "Send messages!",
            desc: "For sending messages to customers,",
          },
        ],
      };
    },
  };
</script>
