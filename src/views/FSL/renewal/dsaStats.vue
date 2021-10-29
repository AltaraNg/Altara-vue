<template>
    <div class="container-fluid mt-5 card mx-4">
        <h4 class="h4 mx-3">Top 10 DSAs In Renewal</h4>
        <div class="mx-3">
            <table class="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th v-for="header in headers">
                            {{header}}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(agent, index) in agents">
                        <td>{{index + 1}}</td>

                        <td>{{agent.agent_name}}</td>
                        <td>{{agent.number_sales}}</td>
                        <td>{{agent.total_renewals}}</td>
                        <td>{{((agent.total_renewals / agent.number_sales) * 100).toFixed(2)}}</td>

                    </tr>
                </tbody>
            </table>
        </div>
        
    </div>
</template>

<script>
import { get } from '../../../utilities/api';
import flash from '../../../utilities/flash';
    export default {
        data() {
            return {
                apiUrl: {
                    agentList: "/api/renewal/prompters/stats"
                },
                error: [],

                headers: [
                    "S/N", "Name", "Total Sales", "Total Renewals", "Conversion Rate (%)"
                ],
                agents: []
            }
        },

        beforeMount()   {
            this.fetchDsaStats();
        },

        methods: {
            async fetchDsaStats(){
                this.$LIPS(true);
                let list =  await get(this.apiUrl.agentList).catch(error => {
                    flash.setError(error.response);
                }).finally(() => {
                    this.$LIPS(false);
                })
                this.agents = list.data?.data?.renewal_prompter_agents_stat;
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>