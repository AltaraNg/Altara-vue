<template>
    <div style="body">
        <div class="mt-5 mb-5 ml-5 pointer w-100" style="display: flex; align-items: center; color: #958A8A;"
            @click="$emit('close')">
            <i class="far  fa-arrow-alt-circle-left float-left " style="font-size: 1.5em;"></i><span class="ml-2"
                style="font-size: small;">Back</span>
        </div>
        <div class="   box bg-default text-white  mb-5 ">
            <p class="pb-5" style="font-size: 16px; font-weight: 700; ">Bank_statement.PDF</p>
            <div class="pb-2 alignCenterJustifyBetween" style=" font-size: 13px;">
                <p>Customer ID : <span style="font-weight: 700;">{{ BankStatement.customer_id }}</span></p>
                <p>Status : <span style="font-weight: 700;">Processed</span></p>
            </div>
            <div class="pb-2 alignCenterJustifyBetween" style=" font-size: 13px;">
                <p>Account Number : <span style="font-weight: 700;">{{ BankStatement.account_number }}</span></p>
                <p>Account Name : <span style="font-weight: 700;">{{ BankStatement.account_name }}</span></p>
            </div>
            <div class="pb-2 alignCenterJustifyBetween" style=" font-size: 13px;">
                <p>Statement Period : <span style="font-weight: 700;">{{ BankStatement.start_date }} - {{
                    BankStatement.end_date }} </span></p>
            </div>
        </div>
        <div>
            <div class="mb-4" style="display: flex; align-items: center;">
                <div class="box " style="width:30%; display: flex; align-items: center; justify-content: space-around;">
                    <img src="../assets/bankStatementIcons/opening_balance.png" style="width:25%; " />
                    <div>
                        <p style="font-size: 13px;">Opening Balance</p>
                        <p style="font-size: 22px; font-weight: 800; color: #074A74;">{{
                            $formatCurrency(BankStatement.opening_balance) }}</p>

                    </div>
                </div>
                <div class="box " style="width:30%; display: flex; align-items: center; justify-content: space-around;">
                    <img src="../assets/bankStatementIcons/closing_balance.png" style="width:25%; " />
                    <div>
                        <p style="font-size: 13px;">Closing Balance</p>
                        <p style="font-size: 22px; font-weight: 800; color: #074A74;">{{
                            $formatCurrency(BankStatement.closing_balance) }}</p>
                    </div>

                </div>
                <div class="box " style="width:30%; display: flex; align-items: center; justify-content: space-around;">
                    <img src="../assets/bankStatementIcons/average_monthly_balance.png" style="width:25%; " />
                    <div>
                        <p style="font-size: 13px;">Average Monthly Balance</p>
                        <p style="font-size: 22px; font-weight: 800; color: #074A74;">{{
                            $formatCurrency(BankStatement.average_monthly_balance) || 'N/A' }}</p>
                    </div>

                </div>
            </div>
            <div class="mb-4" style="display: flex; align-items: center; ">
                <div class="box " style="width:30%; display: flex; align-items: center; justify-content: space-around;">
                    <img src="../assets/bankStatementIcons/turnover_credits.png" style="width:25%; " />
                    <div>
                        <p style="font-size: 13px;">Total Turnover Credits</p>
                        <p style="font-size: 22px; font-weight: 800; color: #074A74;">{{
                            $formatCurrency(BankStatement.total_deposit) }}</p>
                    </div>

                </div>
                <div class="box text-center"
                    style="width:30%; display: flex; align-items: center; justify-content: space-around;">
                    <img src="../assets/bankStatementIcons/total_debits.png" style="width:25%; " />
                    <div>
                        <p style="font-size: 13px;">Total Turnover Debits</p>
                        <p style="font-size: 22px; font-weight: 800; color: #074A74;">{{
                            $formatCurrency(BankStatement.total_withdrawal) }}</p>

                    </div>
                </div>
                <div class="box " style="width:30%; display: flex; align-items: center; justify-content: space-around;">
                    <img src="../assets/bankStatementIcons/predicted_salary.png" style="width:25%; " />
                    <div>
                        <p style="font-size: 13px;"> Predicted Salary Income</p>
                        <p style="font-size: 22px; font-weight: 800; color: #074A74;">{{
                            $formatCurrency(BankStatement.predicted_average_salary) || 'N/A' }}</p>
                    </div>

                </div>
            </div>
            <div class="relative " >
                <div class="box relative " style="margin-top: 50px; margin-bottom: 40px;">
                    
                    <div style="display: flex; justify-content: end;">
                        <div style="width:30%; margin-right: 2%; position: relative;" class="form-group "> 
                            <label style="color: #074A74; font-weight: 800;">REPAYMENT AMOUNT</label>
                            <input type="number" name="repayment_amount" v-model="repayment_amount" class="custom-select flex-1 w-100"
                                />
                                <button style="position: absolute; bottom: 2px; padding:6px 20px; right:3px; text-align: center; border-radius: 5px;" class="  bg-default" @click="getRepaymentCapability" >
    	                                                            Check
    	                                                            <i class="far fa-paper-plane ml-1"></i>
    	                                                        </button>
                        </div>
                    </div>
                    <p class="pb-5" style="font-size: 26px; font-weight: 800; color: #074A74;">Repayment Capability Table.</p>
                    <div class="p-2 alignCenterJustifyBetween" style=" font-size: 18px; font-weight: 800;">
                        <p>Month</p>
                        <p>No of Days</p>
                    </div>
                    <div v-for="(repayment, index) in repaymentCapability" :key="index">
                         <div class="p-2 mb-2 alignCenterJustifyBetween" style=" font-size: 18px; background-color: #F7F7FF;">
                            <p>{{ repayment.month_name || 0 }}</p>
                            <p style="font-weight: 700;">{{ repayment.count || 0 }}</p>
                        </div>
                    </div>
                   
                    <!-- <div class="p-2 mb-2 alignCenterJustifyBetween" style=" font-size: 18px; background-color: #E9E9FF;">
                        <p>Month 2</p>
                        <p style="font-weight: 700;">0</p>
                    </div>
                    <div class="p-2 mb-2 alignCenterJustifyBetween" style=" font-size: 18px; background-color: #F7F7FF;">
                        <p>Month 3</p>
                        <p style="font-weight: 700;">0</p>
                    </div> -->
                </div>
                </div>
            
             
        </div>
        <!-- <div v-if="BankStatement.status == 'pending'" style="display: flex; justify-content: center;">
            <img src="../assets/Spinner-1s-200px.gif"/>
        </div> -->
        <!-- <div v-if="BankStatement.status == 'failed'">
                <div class="box p-5">
                    <div style="display: flex; align-items: start;">
                        <warning />
                        <p class="text-danger pl-5" style="font-size: 30px; font-weight: 700;">Upload Failed</p>
                    </div>
                    <p class="mt-5" style="font-size: 16px;">There was an error during file processing. please try again later.</p>
                </div>
            </div> -->

    </div>
</template>
<script>
import back from '../assets/back.vue';
import warning from '../assets/warning.vue';
import excel from '../assets/excel.vue';
import { get, post, put } from "../utilities/api"
export default {
    components: {
        back,
        warning,
        excel
    },
    props: {
        BankStatement: {
            type: Object
        }
    },
     computed: {
        repaymentCapabilityUrl() {
            return `https://fast-alt-7790f3f68854.herokuapp.com/bank-statements/${this.BankStatement.id}/repayment/capability/${this.repayment_amount}`;
        }
    },
    data() {
        return {
            repayment_amount: '',
            repaymentCapability:[]
        }
    },
    methods:{
         async getRepaymentCapability() {
            this.$LIPS(true)
            console.log('hello', this.repayment_amount)
            try {
                const fetchRepaymentCapability = await get(this.repaymentCapabilityUrl);
                this.repaymentCapability = fetchRepaymentCapability.data.data
                console.log(this.repaymentCapability, 'this.repaymentCapability');
            } catch (err) {
                this.$displayErrorMessage(err);
            } finally{
                this.$LIPS(false)
            }
        },
    }
}
</script>
<style scoped>
.box {
    border-radius: 5px;
    box-shadow: 2px 2px 10px 1px rgba(1, 1, 1, 0.3);
    color: #474A57;
    padding: 20px 40px;
    background-color: white;
    margin: 0 25px;
}

.alignCenterJustifyBetween {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.body{
    overflow-y: scroll;
    height: 100%;
}

</style>