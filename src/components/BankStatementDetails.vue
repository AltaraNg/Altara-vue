<template>
    <transition name="slide" mode="out-in">
        <div class="mt-5 pt-5">
            <!-- <div class="mt-5 mb-5 ml-5 pointer" style="display: flex; align-items: center; color: #958A8A;"
                @click="$emit('close')">
                <i class="far  fa-arrow-alt-circle-left float-left " style="font-size: 1.5em;"></i><span class="ml-2"
                    style="font-size: small;">Back</span>
            </div> -->
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
                <div class="box " style="background-color: transparent;  ">
                    <div class="mt-5 pb-5" style="display: flex; align-items: center; justify-content: space-between;">
                    <p class=" pl-5" style="font-size: 26px; font-weight: 800; color: #074A74;">Transactions Table. </p>
                 <div style="width:30%; margin-right: 2%; position: relative;" class="form-group ">
                                    <label style="color: #074A74; font-weight: 800;">REPAYMENT AMOUNT</label>
                                    <input type="number" name="repayment_amount" v-model="repayment_amount"
                                        class="custom-select flex-1 w-100" />
                                    <button
                                        style="position: absolute; bottom: 2px; padding:6px 20px; right:3px; text-align: center; border-radius: 5px;"
                                        class="  bg-default" @click="getRepaymentCapability">
                                        Check
                                        <i class="far fa-paper-plane ml-1"></i>
                                    </button>
                                </div>
                </div>
                   
                     
                    <div class="space-between mb-5 pl-5 mt-5 ml-5 px-4">
                        <h3 class="text-capitalize mb-0">Filters</h3>
                    </div>
                    <div class="center my-2 pb-5  ml-5 pl-5 " style=" display: flex; align-items: center;">
                        <div style="width:70%; display: flex;">
                            <div style="width:20%; margin-right: 2%;">
                                <label style="color: #074A74; font-weight: 800;">Date</label>
                                <date-picker class="w-100" v-model="dateRange" :range="true" :language="locale"
                                    :format="dateFormat" valueType="format" placeholder="Date"></date-picker>



                            </div>
                            <div style="width:20%; margin-right: 2%;">
                                <label style="color: #074A74; font-weight: 800;">Description</label>
                                <input type="text" name="account_name" class="customSelect  flex-1 w-100"
                                    v-model="pageParams.description" />
                            </div>
                            <div style="width:20%; margin-right: 2%;">
                                <label style="color: #074A74; font-weight: 800;">Minimum Withdrawal</label>
                                <input type="number" name="account_number" class="custom-select flex-1 w-100"
                                    v-model="pageParams.min_withdrawal" />
                                    <p class="w-100 " v-if="isButtonDisabled" style="color: red; font-size: 9.5px; ">Please enter both minimum and maximum withdrawal together.</p>
                            </div>
                            <div style="width:20%; margin-right: 2%; position: relative; ">
                                <label style="color: #074A74; font-weight: 800;">Maximum Withdrawal</label>
                                <input type="number" name="customer_id" class="custom-select flex-1 w-100"  
                                    v-model="pageParams.max_withdrawal" />
                                     
                            </div>



                        </div>
                        <div style="width:30%; display: flex; justify-content: end; padding-right: 43px;">
                            <button style="width:30%; margin-right: 2%;" class="bg-default rounded  py-2 px-4" :disabled="isButtonDisabled"
                                @click="Search()">
                                <span class="h5" >
                                    Search
                                </span>
                            </button>
                            <button style="width:30%; margin-right: 2%;" class="bg-default rounded  py-2 px-4"
                                @click="resetFilter()">
                                <span class="h5" >
                                    Reset
                                </span>
                            </button>
                        </div>

                    </div>

                    <div class="attendance-head">
                        <div class="row mt-5 px-4 pt-3 pb-4 text-left">

                            <div class="col light-heading" v-for="(header, index) in headings" :key="index">
                           
                        
                            {{ header }}
                       
                            </div>
                        </div>
                    </div>
                    <div class="mt-1 attendance-body text-left" key="table"
                        v-if="BankStatementTransactions.length > 0 && this.BankStatementTransactions">
                        <div class="mb-3 row d-flex bg-white table-hover" :key="index"
                            v-for="(BankStatementTransaction, index) in BankStatementTransactions">
                            <!-- {{ creditCheck }} -->
                            <div class="col-12 col-xs-3 col-md col-lg  align-items-start  ">
                                <span class="user mx-auto text-white bg-default">{{ index + OId }}</span>
                            </div>

                            <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-left">
                                {{ BankStatementTransaction.description }}
                            </div>
                            <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-left">
                                {{ new Date(BankStatementTransaction.created_at).toISOString().split('T')[0] }}


                            </div>
                            <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-left">
                                {{ $formatCurrency(BankStatementTransaction.balance) }}


                            </div>
                            <div class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-left">
                                    {{ $formatCurrency(BankStatementTransaction.withdrawal ) }}


                                </div>

                        </div>
                    </div>
                    <div v-else class="h4 text-center">No Data</div>
                    <div v-if="pageParams">
                        <base-pagination :page-param="pageParams" @fetchData="getAllTransations">
                        </base-pagination>
                    </div>


                </div>
                <modal name="repayment-capability" :clickToClose="true"  :height="'auto'">
                     <div class=" relative p-5 pb-5 mb-5" style="  display: flex; flex-direction: column;">
                        <div class="pb-5"  style="display:flex; align-items: center; justify-content: space-between;">
                             <p class="" style="font-size: 20px; font-weight: 800; color: #074A74;">Repayment Capability Table.</p>
                                <i class="fas fa-times text-danger" style="font-size:15px; cursor:pointer;" @click="hide('repayment-capability')"></i>
                        </div>
                        <div class="p-2 alignCenterJustifyBetween" style=" font-size: 18px; font-weight: 800;" v-if="repaymentCapability.length">
                            <p>Month</p>
                            <p>No of Days</p>
                        </div>
                        <div v-for="(repayment, index) in repaymentCapability" :key="index">
                            <div class="p-2 mb-2 alignCenterJustifyBetween"
                                style=" font-size: 18px; background-color: #F7F7FF;">
                                <p>{{ repayment.month_name || 0 }}</p>
                                <p style="font-weight: 700;">{{ repayment.count || 0 }}</p>
                            </div>
                        </div>
                        <div v-if="!repaymentCapability.length" style="display: flex; flex-direction: column; align-items: center;">
                           <img src="../assets/bankStatementIcons/icons8-info.gif"/>
                            <p style="font-size: 15px; font-weight: 800; color: #074A74;" class="text-center mt-5">This Bank
                                Statement does not have the available funds to repay this repayment amount. </p>
                        </div>
                    </div>
                </modal>
               



            </div>
        </div>

    </transition>
</template>
<script>
import back from '../assets/back.vue';
import warning from '../assets/warning.vue';
import excel from '../assets/excel.vue';
import BasePagination from "../components/Pagination/BankStatementPagination.vue"
import { get, post, put } from "../utilities/api"
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'


export default {
    components: {
        back,
        warning,
        excel,
        BasePagination,
        DatePicker
    },

    computed: {
        repaymentCapabilityUrl() {
            return `https://fast-alt-7790f3f68854.herokuapp.com/bank-statements/${this.$route.params.id}/repayment/capability/${this.repayment_amount}`;
        },
         isButtonDisabled: function () {
            const minEntered = !!this.pageParams.min_withdrawal;
            const maxEntered = !!this.pageParams.max_withdrawal;
            return (minEntered && !maxEntered) || (!minEntered && maxEntered);
        }
    },
    data() {
        return {
            OId:null,
            dateFormat: "YYYY-MM-DD",
            locale: "en-US",
            dateRange: [],
            BankStatement: {},
            transaction_details: `https://fast-alt-7790f3f68854.herokuapp.com/bank-statements/${this.$route.params.id}/transactions`,
            statement_details: `https://fast-alt-7790f3f68854.herokuapp.com/bank-statements/${this.$route.params.id}`,
            repayment_amount: '',
            repaymentCapability: [
                {
                    month_name: 'Month Name',
                    count: 0
                }
            ],
            BankStatementTransactions: [],
            headings: [
                "S/N",
                "Description",
                "Date",
                "Balance",
                "Withdrawal"
            ],
            pageParams: { page: 1, size: 20, max_withdrawal: '', description: '' }
        }
    },
    methods: {
        async getRepaymentCapability() {
            this.$LIPS(true)
            try {
                const fetchRepaymentCapability = await get(this.repaymentCapabilityUrl);
                this.repaymentCapability = fetchRepaymentCapability.data.data
                this.$modal.show('repayment-capability')
                console.log(this.repaymentCapability, 'this.repaymentCapability');
            } catch (err) {
                this.$displayErrorMessage(err);
            } finally {
                this.$LIPS(false)
                //this.$modal.show('repayment-capability')
            }
        },
        async getAllTransations(params = {}) {
            this.$LIPS(true)
            try {
                const fetchBankStatementDetails = await get(this.transaction_details, { ...params, ...this.pageParams, transaction_from_date: this.dateRange[0], transaction_to_date: this.dateRange[1] });
                this.BankStatementTransactions = fetchBankStatementDetails.data.items
                console.log(fetchBankStatementDetails, 'this.BankStatementTransactions');
                this.setPagination(fetchBankStatementDetails.data)
                this.pageParams.page !== 1 ? this.$router.push({
                    query: { page: this.pageParams.page },
                }) : null
            } catch (err) {
                this.$displayErrorMessage(err);
            } finally {
                this.$LIPS(false)
            }
        },
        async resetFilter() {
            this.dateRange = []
            this.pageParams = {
                page: 1, size: 15
            }
            await this.getAllTransations(this.pageParams)
        },
        async Search() {
            this.pageParams.page = 1;
            await this.getAllTransations()
        },
        show(modal) {
			this.$modal.show(modal);
		},

		hide(modal) {
			this.$modal.hide(modal);
		},
        async getBankStatementDetails() {
            this.$LIPS(true)
            try {
                const fetchBankStatementDetails = await get(this.statement_details);
                this.BankStatement = fetchBankStatementDetails.data.data
                console.log(this.BankStatement, 'this.BankStatementTransactions');
            } catch (err) {
                console.log(err)
                this.$displayErrorMessage(err);
            } finally {
                this.$LIPS(false)
            }
        },
        setPagination(response) {
            const {
                page,
                first_page_url,
                from,
                pages,
                last_page_url,
                data,
                size,
                next_page_url,
                to,
                total,
                prev_page_url,
            } = response

            this.pageParams = Object.assign({}, this.pageParams, {
                page,
                first_page_url,
                from,
                pages,
                last_page_url,
                size,
                next_page_url,
                to,
                total,
                prev_page_url,
            })
            this.OId = page == 1 ? page : (page - 1) * size + 1;
            if (response.queryParams !== undefined) {
                this.pageParams = response.queryParams
            }
        },
    },
    async mounted() {

        await this.getBankStatementDetails()
        await this.getAllTransations({ ...this.pageParams })
    },
}
</script>
<style scoped>
.customSelect {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: white;
    border-radius: 2px;
    border-color: rgba(194, 194, 194, 0.282);
    color: black;
    padding: 8px 12px;
    font-size: 16px;
    width: 200px;
    outline: none;
    box-shadow: none;
}

.customSelect:focus {
    border: 0.1px solid #074a7464 !important;
    box-shadow: rgba(#074a74d6, 0.25) 0 0 10px 10px;
}

.slide-enter-active,
.slide-leave-active {
    transition: all 0.4s;
}

.slide-enter,
.slide-leave-to {
    transform: translateX(100%);
}

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
button:disabled{
    opacity: 0.5;
}

.body {
    overflow-y: scroll;
    height: 100%;
}</style>