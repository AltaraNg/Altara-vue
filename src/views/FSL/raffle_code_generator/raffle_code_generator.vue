<template>
	<div class="wrapper">
		<div class="w-50 pt-5 mt-5">
			<div class="form-group " style="position: relative;">
                                  <label style="font-weight: 700;">GENERATE RAFFLE CODE</label>
                                  <input
                                        class="form-control"
										style="border-radius: 4px; padding: 20px;"
                                        name="phone_number"
                                        placeholder="Enter Phone number ..."
                                        type="number"
                                        v-model="phone_number"
                                        />
										  <button style="position: absolute; bottom: 5px; padding:6px 20px; right:5px; text-align: center; border-radius: 5px;" class="  bg-default" type="submit" :disabled="phone_number.length !== 11" @click="GenerateRaffleCode">
	                                                            Generate
	                                                            <i class="far fa-paper-plane ml-1"></i>
	                                                        </button>
    
                                </div>
								<p v-if="result" class="mt-5 pt-5 pr-5 mr-5" style="font-size: 50px; font-weight: 700;">The raffle code for {{ phone_number }} is <span style="color: #074A74;">{{ raffle_code }}</span> <CopyItem :item="raffle_code"/> </p>
		</div>
		<div class="p-4" ><img style="height:80vh; width: auto;"  src="../../../assets//barcode.png"/></div>
	</div>
</template>
<script>
import CopyItem from '../../../components/CopyItem.vue';
export default{
	components: {
		CopyItem
	},
	data(){
		return{
			phone_number:'',
			result:false,
			raffle_code:'ATfy65GO'
		}
	},
	methods: {
		GenerateRaffleCode(){
			this.result= true
		}
	},
}
</script>
<style>
.w-50{
	width:50%
}
.wrapper{
	width: 100%;
	display: flex;
	direction: row;
	align-items: flex-start;
	justify-content: space-between;
	margin-top: 10px;
	padding:0 25px;
}
</style>