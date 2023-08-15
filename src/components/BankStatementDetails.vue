<template>
    <div>
        <div class="pt-5 mb-5 ml-5 pointer" style="display: flex; align-items: center; color: #958A8A;"
            @click="$emit('close')">
            <back /><span class="ml-2">Back</span>
        </div>
        <div class="   box  mb-5 ">
            <p class="pb-5" style="font-size: 16px; font-weight: 700; ">Bank_statement.PDF</p>
            <div class="pb-2 alignCenterJustifyBetween" style=" font-size: 13px;">
                <p>Customer ID : <span style="font-weight: 700;">27976-formal</span></p>
                <p>Status : <span style="font-weight: 700;">Processed</span></p>
            </div>
            <div class="pb-2 alignCenterJustifyBetween" style=" font-size: 13px;">
                <p>Account Number : <span style="font-weight: 700;">0976890887</span></p>
                <p>Account Name : <span style="font-weight: 700;">Olumide Olakode</span></p>
            </div>
            <div class="pb-2 alignCenterJustifyBetween" style=" font-size: 13px;">
                <p>Statement Period : <span style="font-weight: 700;">October 2, 2022 - December 31, 2022 </span></p>
            </div>
        </div>
        <div class="mb-4" style="display: flex; align-items: center;">
            <div class="box text-center" style="width:30%">
                <p style="font-size: 13px;">Opening Balance</p>
                <p style="font-size: 22px; font-weight: 800; color: #074A74;">₦527,382.25</p>
            </div>
            <div class="box text-center" style="width:30%">
                <p style="font-size: 13px;">Closing Balance</p>
                <p style="font-size: 22px; font-weight: 800; color: #074A74;">₦4,123.55</p>
            </div>
            <div class="box text-center" style="width:30%">
                <p style="font-size: 13px;">Average Monthly Balance</p>
                <p style="font-size: 22px; font-weight: 800; color: #074A74;">₦8,329.87</p>
            </div>
        </div>
        <div class="mb-4" style="display: flex; align-items: center; ">
            <div class="box text-center" style="width:30%">
                <p style="font-size: 13px;">Total Turnover Credits</p>
                <p style="font-size: 22px; font-weight: 800; color: #074A74;">₦527,382.25</p>
            </div>
            <div class="box text-center" style="width:30%">
                <p style="font-size: 13px;">Total Turnover Debits</p>
                <p style="font-size: 22px; font-weight: 800; color: #074A74;">₦485,226.06</p>
            </div>
            <div class="box text-center" style="width:30%">
                <p style="font-size: 13px;"> Predicted Salary Income</p>
                <p style="font-size: 22px; font-weight: 800; color: #074A74;">₦208,329.87</p>
            </div>
        </div>
        <div class="box  " style="margin-top: 50px; margin-bottom: 40px;">
            <div style="display: flex; justify-content: end;">
                <div style="width:30%; margin-right: 2%;">
                    <label style="color: #074A74; font-weight: 800;">REPAYMENT AMOUNT</label>
                    <input type="number" name="repayment_duration" class="custom-select flex-1 w-100"
                        v-model="repaymentPlan" />
                </div>
            </div>
            <p class="pb-5" style="font-size: 26px; font-weight: 800; color: #074A74;">Repayment Capability Table.</p>
            <div class="p-2 alignCenterJustifyBetween" style=" font-size: 18px; font-weight: 800;">
                <p>Month</p>
                <p>No of Days</p>
            </div>
            <div class="p-2 mb-2 alignCenterJustifyBetween" style=" font-size: 18px; background-color: #F7F7FF;">
                <p>Month 1</p>
                <p style="font-weight: 700;">20</p>
            </div>
            <div class="p-2 mb-2 alignCenterJustifyBetween" style=" font-size: 18px; background-color: #E9E9FF;">
                <p>Month 2</p>
                <p style="font-weight: 700;">15</p>
            </div>
            <div class="p-2 mb-2 alignCenterJustifyBetween" style=" font-size: 18px; background-color: #F7F7FF;">
                <p>Month 3</p>
                <p style="font-weight: 700;">16</p>
            </div>
        </div>
    </div>
</template>
<script>
import back from '../assets/back.vue';
export default {
    components: {
        back
    },
    emit: []
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
</style>