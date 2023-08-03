<template>
	<div class="wrapper">
		<div class=" pt-5 mt-5 child-div-1 ">
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
										  <button style="position: absolute; bottom: 5px; padding:6px 20px; right:5px; text-align: center; border-radius: 5px;" class="  bg-default" type="submit" :disabled="phone_number.length > 14" @click="GenerateRaffleCode">
	                                                            Generate
	                                                            <i class="far fa-paper-plane ml-1"></i>
	                                                        </button>
    
			</div>
			<p style="margin-top: -3px;" >Please enter a valid phone number using the format: 080XXXXXXXX (11 digits).</p>
			<div v-if="result" class="mt-5 pt-5 pr-5 mr-5 ">
				<div class="paragraph-container" >
					<span style="margin-right:30px;">The raffle code for </span> 
						<CopyItem :item="phone_number" /> <span style="margin-left:30px; margin-right:20px;">is</span>  
						<CopyItem :item="raffle_code" class="inline-component" style="color:#074A74"/>
					
				</div>
			</div>
								
		</div>
		<div class="p-4 child-div-2 " ><img style="height:80vh; width: auto;"  src="../../../assets//barcode.png"/></div>
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
			this.formatPhoneNumber()
			this.result= true
		},
		formatPhoneNumber () {
			const cleanPhoneNumber = this.phone_number.replace(/\D/g, '').slice(-10);
			this.phone_number =  `0${cleanPhoneNumber}`;
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
.paragraph-container {
	width: 100%;
  display: flex;
  font-size: 50px;
  font-weight: 700;
  flex-wrap: wrap; 
  /* Use Flexbox to keep the content inline */
}
@media (max-width: 768px) {
  .child-div-2 {
    display: none; /* Hide the second child div on tablet and mobile */
  }
  .child-div-1{
	width: 100%;
  }
  .paragraph-container{
	font-size: 26px;
	font-weight: 600;
  }
}
.child-div-1{
	 flex: 1; 
}
</style>