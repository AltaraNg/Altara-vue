<template>
    <div class="px-md-4 px-2">
        <app-navigation :pageTitle="'Admin'" :pageTitleSmall="'Admin Portal'"
                        :previous="{ path: $routerHistory.previous().path }"
                        :forward="{ path: $routerHistory.next().path }"/>
        <router-view/>
    </div>
</template>
<script>
    import AppNavigation from '../../components/AppNavigation';

    export default {
        components: {AppNavigation}
    }
</script>