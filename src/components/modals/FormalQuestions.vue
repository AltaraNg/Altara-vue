<template>
  <transition>

    <div>
      <div class="modal-header">
        <h3 class=" my-1" id="exampleModalLongTitle">
          Verification Checklists
        </h3>
        <div slot="top-right">
          <span
            type="button"
            class="close text-danger h4 my-0 py-0 pointer"
            data-dismiss="modal"
            aria-label="Close"
            @click="$modal.hide('verificationForm')"
          >
            <span aria-hidden="true" class="h5">&times;</span>
          </span>
        </div>
      </div>
      <div class="modal-body mx-4">
        <div class="d-flex align-items-center justify-content-between">
        <h4>This section is Formal, <strong @click="verifyInformalModal">Click to view the Informal section</strong></h4>
        <div class="d-flex align-items-center" v-if="verificationList.length > 0">
          <div class="circle-icon mt-4">
            <i class="fa fa-check" aria-hidden="true"></i>
          </div>
          <h4 class="ml-2  ">Verified</h4>
        </div>

        </div>
        <h4>Click to view <strong @click="verifyGuarantorModal">Guarantor section</strong> </h4>
        <div class="spaceAfter"></div>
        <form>
            <h5>Generic</h5>
          <div class="form-group my-3">
            <label for="checklist1" class=""
              >What location was visited and verified?
            </label
            ><br />
            <div
              class="form-check form-check-radio form-check-inline"
              v-for="option in verifiedOptions" :key="option"
            >
              <label class="form-check-label">
                <input
                  v-model="verificationData.locations"
                  type="checkbox"
                  class="form-check-input"
                  :value="option"
                  id="option"
                  v-validate="'required'"
                />
                <span class="px-2">{{ option }}</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
          </div>
          <div class="form-group my-3">
            <label for="checklist">If other, Specify</label>
            <textarea
              cols="2"
              class="form-control "
              v-model="verificationData.otherOption"
            ></textarea>
          </div>
          <div class="form-group my-3">
            <label for="exampleFormControlSelect2"
              >Does the address match what was given on the application Form?</label
            >
            <br />
  
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.addressMatch"
                  type="radio"
                  class="form-check-input "
                  value="yes"
                  name="checklist2"
                  v-validate="'required'"
                />
                <span class="px-2">Yes</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.addressMatch"
                  type="radio"
                  class="form-check-input "
                  value="no"
                  name="checklist2"
                  v-validate="'required'"
                />
                <span class="px-2">No</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
          </div>
  
          <div class="form-group my-3">
            <label for="exampleFormControlSelect2"
              >Distance to the customer's house/office/ business/shop verified does not cost more than N300?</label
            >
            <br />
  
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.customerDistance"
                  type="radio"
                  class="form-check-input "
                  value="yes"
                  name="checklist3"
                  v-validate="'required'"
                />
                <span class="px-2">Yes</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.customerDistance"
                  type="radio"
                  class="form-check-input "
                  value="no"
                  name="checklist3"
                  v-validate="'required'"
                />
                <span class="px-2">No</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
          </div>

          <div class="form-group my-3">
            <label for="checklist4" class=""
              >Is customer married? </label
            ><br />
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.married"
                  type="radio"
                  class="form-check-input "
                  value="yes"
                  name="checklist4"
                  v-validate="'required'"
                />
                <span class="px-2">Yes</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.married"
                  type="radio"
                  class="form-check-input "
                  value="no"
                  name="checklist4"
                  v-validate="'required'"
                />
                <span class="px-2">No</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
          </div>
          <div class="form-group my-3">
            <label for="checklist">If Yes - What is the name of their husband / wife and what is their number</label>
            <textarea
              cols="2"
              class="form-control "
              v-model="verificationData.nameOfSpouse"
            ></textarea>
          </div>

          <div class="form-group my-3">
            <label for="checklist5" class=""
              >How many children does the customer have?</label
            ><br />
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.customerChildren"
                  type="radio"
                  class="form-check-input "
                  value="2 or less"
                  name="checklist5"
                  v-validate="'required'"
                />
                <span class="px-2">2 or less</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.customerChildren"
                  type="radio"
                  class="form-check-input "
                  value="More than 2"
                  name="checklist5"
                  v-validate="'required'"
                />
                <span class="px-2">More than 2</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
          </div>
          <div class="form-group my-3">
            <label for="checklist6" class=""
              >Is the customer's spouse salary earner or have business?</label
            ><br />
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.spouseSalary"
                  type="radio"
                  class="form-check-input "
                  value="yes"
                  name="checklist6"
                  v-validate="'required'"
                />
                <span class="px-2">Yes</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.spouseSalary"
                  type="radio"
                  class="form-check-input "
                  value="no"
                  name="checklist6"
                  v-validate="'required'"
                />
                <span class="px-2">No</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
          </div>
          <div class="form-group my-3">
            <label for="checklist7" class=""
              >Guarantor gave the same house address/workplace address as the customer?</label
            ><br />
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.addressByGuarantor"
                  type="radio"
                  class="form-check-input "
                  value="yes"
                  name="checklist7"
                  v-validate="'required'"
                />
                <span class="px-2">Yes</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.addressByGuarantor"
                  type="radio"
                  class="form-check-input "
                  value="no"
                  name="checklist7"
                  v-validate="'required'"
                />
                <span class="px-2">No</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
          </div>
          <div class="form-group my-3">
            <label for="checklist8" class=""
              >Picture or video of collaterals incase of loan</label
            ><br />
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.collateralPictures"
                  type="radio"
                  class="form-check-input "
                  value="yes"
                  name="checklist8"
                  v-validate="'required'"
                />
                <span class="px-2">Yes</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.collateralPictures"
                  type="radio"
                  class="form-check-input "
                  value="no"
                  name="checklist8"
                  v-validate="'required'"
                />
                <span class="px-2">No</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
          </div>
          <div class="form-group my-3">
            <label for="checklist9" class=""
              >Customer has provided a picture of his accomodation/workplace  and it is the same as what was verified by the VCR?</label
            ><br />
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.accommodationPicture"
                  type="radio"
                  class="form-check-input "
                  value="yes"
                  name="checklist9"
                  v-validate="'required'"
                />
                <span class="px-2">Yes</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.accommodationPicture"
                  type="radio"
                  class="form-check-input "
                  value="no"
                  name="checklist9"
                  v-validate="'required'"
                />
                <span class="px-2">No</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
          </div>
          <div class="form-group my-3">
            <label for="checklist10" class=""
              >Customer has provided their BVN?</label
            ><br />
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.hasBvn"
                  type="radio"
                  class="form-check-input "
                  value="yes"
                  name="checklist10"
                  v-validate="'required'"
                />
                <span class="px-2">Yes</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.hasBvn"
                  type="radio"
                  class="form-check-input "
                  value="no"
                  name="checklist10"
                  v-validate="'required'"
                />
                <span class="px-2">No</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
          </div>
          <div class="form-group my-3">
            <label for="checklist11" class=""
              >None of the Guarantors are the spouse of the customer</label
            ><br />
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.spouseNotGuarantor"
                  type="radio"
                  class="form-check-input "
                  value="yes"
                  name="checklist11"
                  v-validate="'required'"
                />
                <span class="px-2">Yes</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.spouseNotGuarantor"
                  type="radio"
                  class="form-check-input "
                  value="no"
                  name="checklist11"
                  v-validate="'required'"
                />
                <span class="px-2">No</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
          </div>


          <div class="spaceAfter"></div>
          <h5>Home</h5>
  
          <div class="form-group my-3">
            <label for="exampleFormControlSelect2"
              >How long has the customer lived at his/her location? </label
            >
            <br />
  
            <div
              class="form-check form-check-radio form-check-inline"
              v-for="option in locationDurationOptions" :key="option"
            >
              <label class="form-check-label">
                <input
                  v-model="verificationData.locationDuration"
                  type="radio"
                  class="form-check-input "
                  :value="option"
                  name="checklist12"
                  
                />
                <span class="px-2">{{ option }}</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
          </div>
  
          <div class="form-group my-3">
            <label for="bill"
              >Utility Bill OR Rent receipt OR Water bill provided? Does the address match the house address on the form?</label
            >
            <br />
  
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.bill"
                  type="radio"
                  class="form-check-input "
                  value="yes"
                  name="checklist13"
                  
                />
                <span class="px-2">Yes</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.bill"
                  type="radio"
                  class="form-check-input "
                  value="no"
                  name="checklist13"
                  
                />
                <span class="px-2">No</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
          </div>
          <div class="form-group my-3">
            <label for="customerTravels"
              >Does the customer travel often? </label
            >
            <br />
  
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.customerTravels"
                  type="radio"
                  class="form-check-input "
                  value="yes"
                  name="checklist14"
                  
                />
                <span class="px-2">Yes</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.customerTravels"
                  type="radio"
                  class="form-check-input "
                  value="no"
                  name="checklist14"
                  
                />
                <span class="px-2">No</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
          </div>
          <div class="form-group">
            <label for="exampleFormControlTextarea1"
              >What is the nature of the home addess (location description? how does it look? Is it obvious the customer lives there? Family pictures ?)</label
            >
            <textarea
              v-model="verificationData.natureOfHomeAddress"
              class="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="exampleFormControlTextarea2"
              >Who did you see at the house/speak to when you got to the house?</label
            >
            <textarea
              v-model="verificationData.whoYouSpeakTo"
              class="form-control"
              id="exampleFormControlTextarea2"
              rows="3"
            ></textarea>
          </div>
  
          <div class="form-group my-3">
            <label for="exampleFormControlSelect2"
              >Does the customer own their house?</label
            >
            <br />
  
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.ownHouse"
                  type="radio"
                  class="form-check-input "
                  value="yes"
                  name="checklist15"
                  
                />
                <span class="px-2">Yes</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.ownHouse"
                  type="radio"
                  class="form-check-input "
                  value="no"
                  name="checklist15"
                  
                />
                <span class="px-2">No</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
          </div>
  
          <div class="form-group my-3">
            <label for="exampleFormControlSelect2"
              >Based on the feedback from neighbours, How long has the customer lived there?</label
            >
            <br />
  
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.houseLivedDuration"
                  type="radio"
                  class="form-check-input "
                  value="Same with customer"
                  name="checklist22"
                  
                />
                <span class="px-2">Same answer with customer</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.houseLivedDuration"
                  type="radio"
                  class="form-check-input "
                  value="Diffferent answer from customer"
                  name="checklist22"
                  
                />
                <span class="px-2">Different from what customer said</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
          </div>
          <div class="form-group my-3">
            <label for="exampleFormControlSelect2"
              >[Ask Question to neighbour] Have they had any issues with the neighbours or anyone in the area?</label
            >
            <br />
  
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.issueWithNeighbour"
                  type="radio"
                  class="form-check-input "
                  value="yes"
                  name="checklist16"
                  
                />
                <span class="px-2">Yes</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.issueWithNeighbour"
                  type="radio"
                  class="form-check-input "
                  value="no"
                  name="checklist16"
                  
                />
                <span class="px-2">No</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
          </div>
  
          <div class="spaceAfter"></div>
          <h5>Office/ Business</h5>
          <div class="form-group my-3">
            <label for="workingYears"
              >How many years has the customers been working with the company ( >1 year) ?  if Office/Business is verified
            </label
            >
            <br>
            <div
              class="form-check form-check-radio form-check-inline"
              v-for="yearsOption in customerWorkingYearsOptions" :key="yearsOption"
            >
              <label class="form-check-label">
                <input
                  v-model="verificationData.yearsOfWork"
                  type="radio"
                  class="form-check-input "
                  :value="yearsOption"
                  name="checklist17"
    
                />
                <span class="px-2">{{ yearsOption }}</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
          </div>
  
          <div class="form-group my-3">
            <label for="exampleFormControlSelect2"
              >Have we met with the manager/HR/colleagues and do they speak well of the customer?</label
            >
            <br />
  
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.metManager"
                  type="radio"
                  class="form-check-input "
                  value="yes"
                  name="checklist18"
    
                />
                <span class="px-2">Yes</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.metManager"
                  type="radio"
                  class="form-check-input "
                  value="no"
                  name="checklist18"
    
                />
                <span class="px-2">No</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
          </div>
          <div class="form-group my-3">
            <label for="exampleFormControlTextarea3"
              >What does the customer do for the Company?</label
            >
            <textarea
              v-model="verificationData.customerWork"
              class="form-control"
              id="exampleFormControlTextarea3"
              rows="3"

            ></textarea>
          </div>
          <div class="form-group my-3">
            <label for="salaryDate"
              >What dates does customer receive salary?</label
            >
            <br>
            <div class="form-group my-3">
              <textarea
              v-model="verificationData.dateOfSalary"
              class="form-control"
              id="exampleFormControlTextarea3"
              rows="3"

            ></textarea>
                    <small
                            v-if="errors.first('date_of_salary')"
                    >{{errors.first('date_of_salary')}}
                    </small>
            </div>
          </div>

          <div class="form-group my-3">
            <label for="exampleFormControlSelect2"
              >Does the customer travel often?</label
            >
            <br />
  
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.oftenTravel"
                  type="radio"
                  class="form-check-input "
                  value="yes"
                  name="checklist19"
    
                />
                <span class="px-2">Yes</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.oftenTravel"
                  type="radio"
                  class="form-check-input "
                  value="no"
                  name="checklist19"
    
                />
                <span class="px-2">No</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
          </div>
          <div class="form-group my-3">
            <label for="exampleFormControlSelect2"
              >Utility Bill OR Rent receipt OR Water bill provided? Does the address match the house address on the form?</label
            >
            <br />
  
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.receipt"
                  type="radio"
                  class="form-check-input "
                  value="yes"
                  name="checklist20"
    
                />
                <span class="px-2">Yes</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.receipt"
                  type="radio"
                  class="form-check-input "
                  value="no"
                  name="checklist20"
    
                />
                <span class="px-2">No</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
          </div>
  
          <div class="form-group my-3">
            <label for="exampleFormControlTextarea5"
              >Who did you see/speak to when you got to the office?</label
            >
            <textarea
              v-model="verificationData.whoYouSpokeWith"
              class="form-control"
              id="exampleFormControlTextarea5"
              rows="3"

            ></textarea>
          </div>
  
          <div class="form-group my-3">
            <label for="exampleFormControlSelect2"
              >Based on the feedback from collegues, How long has the customer worked there?</label
            >
            <br />
  
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.customerWorkDuration"
                  type="radio"
                  class="form-check-input "
                  value="Same answer with customer"
                  name="checklist21"
    
                />
                <span class="px-2">Same answer with customer</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
            <div class="form-check form-check-radio form-check-inline">
              <label class="form-check-label">
                <input
                  v-model="verificationData.customerWorkDuration"
                  type="radio"
                  class="form-check-input "
                  value="Different from what customer said"
                  name="checklist21"
    
                />
                <span class="px-2">Different from what customer said</span>
                <span class="form-check-sign"> </span>
              </label>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer mr-4">
        <button
          type="button"
          class="btn px-5 rounded bg-danger mx-3 my-5"
          data-dismiss="modal"
          @click="$modal.hide('verificationForm')"
        >
          Close
        </button>
        <button type="button" class="btn px-4 bg-default my-5" @click="save">
          Save changes
        </button>
      </div>
    </div>
  </transition>
    
  </template>
  
  <script>
  import { post } from "../../utilities/api"
  import { EventBus } from '../../utilities/event-bus'
  import Vue from 'vue'
  import InformalQuestions from './InformalQuestions.vue';
  import GuarantorQuestions from './GuarantorQuestions.vue';
  import { mapGetters } from 'vuex'
  
  export default {
    props: {
    customer: {
      required: true,
      default: {},
    },
    verificationList: {
      required: false,
      default: () => [],
    },

  },
    data() {
      return {
        verifiedOptions: ["Home", "Business", "Office", "Other"],
        vAgents: null,
        verificationData: {
          locations: []
        },
        locationDurationOptions: ["less than 6 months","6months - 1 year","More than 1 year",],
        customerWorkingYearsOptions: ["less than 6 months","6months - 1 year","More than 1 year",],
        showCustomer: false,
        status: "Formal",
        showVerifyIcon: false,
      }
    },
    components: {
      // eslint-disable-next-line vue/no-unused-components
    InformalQuestions,
    // eslint-disable-next-line vue/no-unused-components
    GuarantorQuestions
  },
  computed: {
    ...mapGetters(["auth"]),
    full() {
      return this.$route.meta.mode === "full"
    },
  },

    methods: {
      
      setCustomer(customer) {
      Vue.set(this.$data, "customer", customer)
      this.showCustomer = true
    },

    show(modal) {
      this.$modal.show(modal)
    },

    hide(modal) {
      this.$modal.hide(modal)
    },

    verifyInformalModal() {
            this.$modal.show(
                InformalQuestions,
                { customer: this.customer },
                {
                name: "verificationForm",
                classes: ["w-50", "overflow-hidden"],
                adaptive: true,
                resizable: true,
                height: "auto",
                width: "50%",
                clickToClose: true,
                maxHeight: 200,
                },
                {
                closed: () => {},
                }
        )
    },
    verifyGuarantorModal() {
            this.$modal.show(
              GuarantorQuestions,
                { customer: this.customer },
                {
                name: "verificationForm",
                classes: ["w-50", "overflow-hidden"],
                adaptive: true,
                resizable: true,
                height: "auto",
                width: "50%",
                clickToClose: true,
                maxHeight: 200,
                },
                {
                closed: () => {},
                }
        )
    },

      async save() {
        this.$validator.validateAll().then(async result => {
          if (result) {
            try {
              this.$LIPS(true)
              this.verificationData.customer_id = this.customer.id
              this.verificationData.type = "verification"
              this.verificationData.status = this.status

              const genericRequiredKeys = [
              'locations',
              'addressMatch',
              'customerDistance',
              'married',
              'nameOfSpouse',
              'customerChildren',
              'spouseSalary',
              'addressByGuarantor',
              'collateralPictures',
              'accommodationPicture',
              'hasBvn',
              'spouseNotGuarantor'
              ];
              const isGenericSectionFilled = genericRequiredKeys.every(key => this.verificationData[key] !== undefined);


              const homeRequiredKeys = [
              'locationDuration',
              'bill',
              'customerTravels',
              'natureOfHomeAddress',
              'whoYouSpeakTo',
              'ownHouse',
              'houseLivedDuration',
              'issueWithNeighbour',
              ]


              const isHomeSectionFilled = homeRequiredKeys.every(key => this.verificationData[key] !== undefined);

              const officeRequiredKeys = [
              'yearsOfWork',
              'metManager',
              'customerWork',
              'dateOfSalary',
              'oftenTravel',
              'receipt',
              'whoYouSpokeWith',
              'customerWorkDuration',
              ]

              const isOfficeSectionFilled = officeRequiredKeys.every(key => this.verificationData[key] !== undefined);
              


              if (isGenericSectionFilled && (isHomeSectionFilled || isOfficeSectionFilled)) {
              let res = await post("/api/recommendation", this.verificationData)
              if (res.status === 200) {
                this.$swal({
                  icon: "success",
                  title: `verification saved successfully`,
                })
                
                this.verificationData = {}
                EventBus.$emit("updateUser", this.customer.id)
                
                this.$modal.hide("verificationForm")
              }
       
              } else if (isGenericSectionFilled) {
                this.$swal({
                  icon: "error",
                  title: `Unable to complete, Fill either Home section or Office Section completely to save.`,
                })
                this.$LIPS(false)
              } else if (isHomeSectionFilled || isOfficeSectionFilled) {
                this.$swal({
                  icon: "error",
                  title: `Unable to complete, Generic is compulsory`,
                })
                this.$LIPS(false)
              }
              } catch (err) {
                this.$swal({
                  icon: "error",
                  title: `Unable to complete`,
                })
              } finally {
                this.$LIPS(false)
              }
          }
        })
      },
    },
  }
  </script>
  
  <style lang="scss" scoped>
  .modal-dialog {
    overflow-y: initial !important;
  }
  .modal-body {
    height: 75vh;
    overflow-y: auto;
  }

  h5 {
    background-color: rgba(8, 74, 115, 0.07);
    padding: 0.6rem 1.5rem;
    border-radius: 3px;
    font-size: 1.3rem !important;
    font-weight: 600;
    box-shadow: 0 0 0.5rem 0 rgba(8, 74, 115, 0.08) inset;
    float: left;
    width: 100%;
    color: rgba(8, 74, 115, 0.9);
  }

  .spaceAfter {
    padding: 1rem 0;
    float: left;
    width: 100%;
  }

  strong {
    color: #FF3636;
    cursor: pointer;
    
  }
  h4 {
    font-size: 1.3rem !important;
    font-weight: 600;
    color: rgba(8, 74, 115, 0.9);
  }

  .circle-icon {
    display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 10px; /* Adjust the size of the circle */
  height: 10px; /* Adjust the size of the circle */
  background-color: #4CAF50; /* Replace with your desired background color */
  border-radius: 50%;
  padding: 10px; /* Adjust the padding as needed */
  font-size: 10px; /* Adjust the icon size */
  color: white; /* Optionally, set the icon color */
  }
  </style>
  