<template>
    <transition name="fade">
        <div class="pt-md-3 pt-2 attendance-view" id="index">

            <custom-header :to="'.'" :title="'Send Caution'" :button-title="'view cautions!'"/>

            <div class="attendance-body">
                <form @submit.prevent="onSave">
                    <div class="p-5 row bg-white shadow-sm card-radius">
                        <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                            <label>Employee Name</label>
                            <typeahead :options="users" :value="value" caption="full_name" v-model="form.user_id"/>
                        </div>
                        <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                            <label>Issued by</label>
                            <select class="custom-select w-100" data-vv-validate-on="blur" disabled name="issued_by"
                                    v-model="form.issuer_id" v-validate="'required'">
                                <option :value="issuer.id">{{issuer.full_name}}</option>
                            </select>
                        </div>
                        <div class="spaceAfter"></div>
                        <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                            <div class="form-check pl-3 ml-1">
                                <input class="form-check-input" id="reason"
                                       type="checkbox" v-model="autoReason" value="true">
                                <label class="form-check-label" for="reason">Select Reason From List</label>
                            </div>
                            <select v-if="autoReason"
                                    class="custom-select w-100"
                                    data-vv-validate-on="blur"
                                    name="reason"
                                    v-model="form.reason"
                                    :disabled="!autoReason"
                                    v-validate="'required'">
                                <option disabled selected value="">&#45;&#45; select reason &#45;&#45;</option>
                                <option :value="reason" v-for="{reason} in cautions">
                                    {{reason | capitalize}}
                                </option>
                            </select>

                            <textarea :disabled="autoReason" v-else class="form-control"
                                      name="reason" rows="2"
                                      v-model="form.reason"
                                      v-validate="'required'"></textarea>
                            <small v-if="errors.first('reason')">{{errors.first('reason')}}</small>
                        </div>

                        <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                            <div class="form-check pl-3 ml-1">
                                <input class="form-check-input" id="penalty"
                                       type="checkbox" v-model="autoPenalty" value="true">
                                <label class="form-check-label" for="penalty">Add Penalty Automatically</label>
                            </div>
                            <input v-if="autoPenalty"
                                   :disabled="autoPenalty"
                                   class="form-control"
                                   name="penalty"
                                   v-model="form.penalty"
                                   v-validate="'required'">

                            <textarea :disabled="autoPenalty" v-else class="form-control"
                                      rows="2"
                                      name="penalty"
                                      v-model="form.penalty"
                                      v-validate="'required'"></textarea>

                            <small v-if="errors.first('penalty')">{{errors.first('penalty') }}</small>
                        </div>

                        <div class="spaceBefore"></div>

                        <div class="form-group col-md-6 col-12 float-left px-0 px-md-3">
                            <label>Date</label>
                            <input class="form-control" data-vv-as="date" name="date" type="date"
                                   v-model="form.date" v-validate="'required'">
                            <small v-if="errors.first('date')">{{errors.first('date')}}</small>
                        </div>

                    </div>
                    <div class="mb-5 px-0 row align-items-center">
                        <div class="w-100 mb-4 mt-5 mx-0 hr"></div>
                        <div class="clearfix d-flex justify-content-end w-100">
                            <button :disabled="$isProcessing" class="btn bg-default" type="submit">
                                Submit Caution <i class="far fa-paper-plane ml-1"></i>
                            </button>
                        </div>
                    </div>
                </form>
            </div>

        </div>
    </transition>
</template>

<script>
    import Vue from 'vue';
    import {log} from "../../../utilities/log";
    import Flash from "../../../utilities/flash";
    import {get, post} from "../../../utilities/api";
    import Typeahead from '../../../components/Typeahead';
    import {EventBus} from "../../../utilities/event-bus";
    import CustomHeader from '../../../components/customHeader';

    export default {
        components: {Typeahead,CustomHeader},
        data() {
            return {
                users: null,
                columns: {},
                show: false,
                form: {},
                error: {},
                issuer: {},
                autoPenalty: true,
                autoReason: true,
                cautions: null,
                value: null
            }
        },
        beforeRouteEnter(to, from, next) {
            get(`/api/caution/create`)
                .then(({data}) => next(vm => vm.prepareForm(data)))
                .catch(() => next(() => Flash.setError('Error Preparing form')));
        },
        methods: {
            onSave() {
                this.$validator.validateAll().then(result => {
                    if (result) {
                        if (this.$network()) {
                            this.$LIPS(true);
                            this.error = {};
                            post('/api/caution', {form: this.form})
                                .then(({data}) => {
                                    if (data.saved) {
                                        log(`CautionSent`, `${this.users.find(({id}) => id === this.form.user_id).staff_id}`);
                                        this.prepareForm(data);
                                        Flash.setSuccess(`Caution sent!`, 5000);
                                    }
                                })
                                .catch(e => {
                                    e = e.response;
                                    if (e.status === 422) {
                                        this.error = e.data.errors ? e.data.errors : e.data;
                                        this.$networkErr('unique');
                                    }
                                }).finally(() => {
                                this.$LIPS(false);
                                this.$scrollToTop();
                            });
                        } else this.$networkErr()
                    } else this.$networkErr('form');
                })
            },
            prepareForm({form, users, cautionsList: cautions}) {
                Vue.set(this.$data, 'form', form);
                Vue.set(this.$data, 'users', users);
                Vue.set(this.$data, 'cautions', cautions);
                this.issuer = users.find(({id}) => id === form.issuer_id);
                this.show = true;
                this.$LIPS(false);
                this.value = null;
                EventBus.$emit('clearTypeAhead');
            }
        },
        watch: {
            form: {
                handler: function (val) {
                    let caution = this.cautions.find(obj => obj.reason === val.reason);
                    Vue.set(this.$data.form, 'penalty', caution ? caution.penalty : '');
                },
                deep: true
            }
        },
    }
</script>