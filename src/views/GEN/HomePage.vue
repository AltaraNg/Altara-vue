<template>
    <transition name="fade">
       <div class="my-5">
          <div v-for="(portal, index) in portals" :key="index">
             <portal-card :desc="portal.desc" :title="portal.title" :url="portal.url" :url_c="portal.url_c"/>
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
                   url: 'website-product', title: 'Manage Products on Website', url_c: 'Manage Products on Website!',
                   desc: 'Manage Products on Website'
                },
                
             ]
          }
       }
    }
 </script>