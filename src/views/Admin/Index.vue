<template>
  <div class="px-md-4 px-2">
    <div style="margin-bottom: 10px ;">
       <app-navigation
      :pageTitle="'Admin Portal'"
      :pageTitleSmall="'Admin Portal'"
      :previous="{ path: $routerHistory.previous().path }"
      :forward="{ path: $routerHistory.next().path }"
    />
    </div>
   
    <router-view />
  </div>
</template>
<script>
import AppNavigation from '../../components/AppNavigation'

export default {
  components: { AppNavigation },
}
</script>
