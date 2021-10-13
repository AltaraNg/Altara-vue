<template>
	<div>
		<div class="row  pt-3 pb-4 mx-auto ">
			<div class="col light-heading" v-for="header in headings">
				{{ header }}
			</div>			
		</div>
        <div class="mt-1 text-center">
				<div
					class="mb-3 row attendance-item mx-auto text-center"
					:key="index"
					v-for="(customer, index) in customers"
					v-if="customers"
				>
					<div class="col d-flex align-items-center" style="max-width: 120px">
						<span class="user mx-auto" >{{
							index + OId
						}}</span>
					</div>
					<div
						class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center"
					>
						{{ customer.name }}
					</div>
					<div
						class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center"
						data-hoverable="true"
						@click="viewStuffs(order, 'order')"
					>
						{{ customer.order_date }}
					</div>
					<div
						class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center"
						data-hoverable="true"
					>
						ID: {{ customer.id }}-{{ customer.employment_status }}
					</div>	
                    <div
						class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center"
					>
						{{ customer.name }}
					</div>

                    <div
						class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center"
					>
                    <input type="text" v-model="customer.action" class=""/>
					</div>	

                    <div
						class="col-12 col-xs-3 col-md col-lg d-flex align-items-center justify-content-center"
					>
                        <button class="my-auto p-2 h-50  rounded bg-default">Submit</button>

					</div>	
                    
                    				
				</div>
			</div>
	</div>
</template>

<script>
	export default {
		props: {
			headings: {
				type: Array,
				required: false,
				default: () => ['S/N', 'Order Number', 'Customer Info Summary', 'Repayment Summary', 'Last Activity', 'Status', 'Feedback'],
			},
            customers: {
                type: Array,
                required: false,
                default: () => [{
                    name: 'Omodamola Oladeji',
                    order_date: '12-27-2021',
                    id: 1234,
                    employment_status: 'Employed formal',
                    action: ''
                }]
            }
		},
        data() {
            return {
                OId: 1,
            }
        }
	};
</script>

<style lang="scss" scoped></style>
