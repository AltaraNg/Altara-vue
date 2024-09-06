<template>
    <div class="mb-5 w-100 px-0 row align-items-center" v-if="pageParam.total > pageParam.per_page">
        <div class="w-100 mb-4 mt-5 mx-0 hr"></div>
        <div class="clearfix w-100 mt-4 d-flex justify-content-center bd-highlight">
            <div>First </div>
            <nav class="mb-5 w-100 px-0 row align-items-center justify-content-center">
                <span @click="performAction(link)" v-for="(link, index) in pageParam.links" :key="index" v-html="link.label" class="mx-3 pointer"></span>
            </nav>
            <div>Last </div>
        </div>
    </div>
</template>
<script>
import {get} from '../../utilities/api'
export default {
    components: {},
    props: {
        pageParam: {
            type: Object,
            required: true,
        },
    },
    //v-if="pageParam.total > pageParam.per_page"

    methods: {
        async performAction(link){
            this.$LIPS(true);
            let res = await get(link.url);
            console.log(res);
            this.$LIPS(false);
        }
        },

    created() {},
};
</script>
