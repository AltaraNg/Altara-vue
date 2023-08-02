<template>
    <div  @click="copyItem" class="copy position-relative">  
       <p class="hover-trigger">{{ item }}
        <span  class="icon"  style="margin-left: -8px;">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.2" d="M21 10.9991V20.9991H27V4.99911H11V10.9991H21Z" fill="black"/>
    <path d="M21 20.9991H27V4.99911H11V10.9991" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20.9998 10.9993H4.99976V26.9993H20.9998V10.9993Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

        </span>
        </p>
    </div>
</template>

<script>
import Flash from "../utilities/flash";
export default {
    props:{
        item:{
            required: true,
            type: String
        }
    },
    methods: {
     copyItem() {
            
            navigator.clipboard.writeText(this.item)
                .then(() => {
                    Flash.setSuccess(`${this.item} has been copied to clipboard!`);
                })
                .catch((error) => {
                    Flash.setError("Copy failed. Please try again.")
                });
        },
    },
};
</script>
<style>
.copy{
    cursor: pointer;
    margin-right: 15px;;
}
.hover-trigger:hover .icon {
  display: inline;
}

.icon {
  display: none;
  position: absolute;
  padding: 0 5px
}
</style>


