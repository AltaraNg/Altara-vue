<template>
    <div>
        <div class="dropdown">
            <input
                type="text"
                class="form-control w-100 custom-select"
                v-model="inputValue"
                @input="searchEvent"
            />
            <div v-show="inputValue && apiLoaded" class="dropdown-list">
                <div v-if="itemList.length === 0" class="dropdown-item">
                    Inventory not available!!
                </div>
                <div
                    @click="selectItem(item)"
                    v-for="item in itemList"
                    :key="item.id"
                    class="dropdown-item"
                    v-else
                >
                    {{
                        formatInput(item)
                    }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import queryParam from "../utilities/queryParam";
import { get, post } from "../utilities/api";

export default {
    name: "AutoComplete",
    props: {
        apiUrl: "",
        // inputValue: {
        //     type: String,
        //     default: ""
        // },
    },
    data() {
        return {
            selectedItem: {},
            itemList: [],
            apiLoaded: false,
        inputValue:null,
        }
    },



    methods: {
        setValue: function(value) {
            this.inputValue = value;
        },
        selectItem(data) {
            this.inputValue = this.formatInput(data);
            this.apiLoaded = false;
            this.$emit("childToParent", data);
            
        },
        searchEvent() {
            this.getproduct();
        },

        async getproduct() {
            let query = {};
            if (this.apiUrl === "/api/inventory") {
                query = {
                    productName: this.inputValue,
                    salesLogger:true,

                };
            }
            else {
                query = {
                    name: this.inputValue
                };
            }
            try {
                const fetchProduct = await get(this.apiUrl + queryParam(query));
                this.itemList = fetchProduct.data.data.data;
                this.apiLoaded = true;
            } catch (err) {
                this.$displayErrorMessage(err);
            }
        },
        formatInput(item){
            if(item !== undefined){
            let result = '';
            if(this.apiUrl !== "/api/inventory"){
                result = item.name                
            }
            else{               
                result =  `${item.product_name}   ${item.inventory_sku}`
                if(item.inventory_status.status === 'Repossessed'){
                    result = result + `   Repossessed`
                }
            }
            return result;}


        }
    }
    
};
</script>

<style>
.dropdown {
    position: relative;
    width: 100%;
    margin: 0 auto;
}
.dropdown-input,
.dropdown-selected {
    width: 100%;
    padding: 10px 16px;
    border: 1px solid transparent;
    background: #edf2f7;
    line-height: 1.5em;
    outline: none;
    border-radius: 8px;
}
.dropdown-input:focus,
.dropdown-selected:hover {
    background: #fff;
    border-color: #e2e8f0;
}
.dropdown-input::placeholder {
    opacity: 0.7;
}
.dropdown-selected {
    font-weight: bold;
    cursor: pointer;
}
.dropdown-list {
    width: 100%;
    max-height: 500px;
    margin-top: 4px;
    overflow-y: auto;
    background: #ffffff;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
}
.dropdown-item {
    display: flex;
    width: 100%;
    padding: 11px 16px;
    cursor: pointer;
}
.dropdown-item:hover {
    background: #edf2f7;
}
.dropdown-item-flag {
    max-width: 24px;
    max-height: 18px;
    margin: auto 12px auto 0px;
}
</style>
