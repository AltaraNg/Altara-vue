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
import PortalCard from "../../components/portalCard";

export default {
  components: { PortalCard },
  data() {
    return {
      portals: [
        {
          url: "inventory",
          title: "Inventory",
          url_c: "View Inventory!",
          desc: "For inventory and management",
        },
        // {
        //   url: "inventorydashboard",
        //   title: "Inventory Dashboard",
        //   url_c: "View Inventory Dashboard",
        //   desc: "For inventory and management",
        // },
        {
          url: "suppliers",
          title: "Manage Suppliers",
          url_c: "Create/Update Supplier",
          desc: "Manage all the suppliers details!",
        },
        {
          url: "brands",
          title: "Manage Brands",
          url_c: "Create/Update Brands",
          desc: "Manage all the brands details!",
        },
        {
          url: "categories",
          title: "Manage Categories",
          url_c: "Create/Update Categories",
          desc: "Manage all the category details!",
        },
        {
          url: "products",
          title: "Manage Products",
          url_c: "Create/Update Products",
          desc: "Manage all the product details!",
        },
      ],
    };
  },
};
</script>