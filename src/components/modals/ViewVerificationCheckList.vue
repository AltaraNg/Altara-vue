<template>
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
          @click="$modal.hide('verificationView')"
        >
          <span aria-hidden="true" class="h5">&times;</span>
        </span>
      </div>
    </div>
    <div class="modal-body" v-if="verification.status === 'Formal' ">
      <ol class="list-group">
        <h5>Generic</h5>
        <li class="list-group-item my-3">
          <label for="checklist1" class=""
            >What location was visited and verified?</label
          >
          <p class="display-text">
            {{ verification.locations.join(", ") }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="checklist">If other, Specify</label>
          <p class="display-text">
            {{ verification.otherOption || 'N/A' }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="checklist1" class=""
            >Does the address match what was given on the application Form?</label
          >
          <p class="display-text">
            {{ verification.addressMatch }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="checklist1" class=""
            >Distance to the customer's house/office/ business/shop verified does not cost more than N300?</label
          >
          <p class="display-text">
            {{ verification.customerDistance }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlSelect2"
            >Is customer married?</label
          >
          <p class="display-text">
            {{ verification.married }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="exampleFormControlSelect2"
            >If Yes - What is the name of their husband / wife and what is their number</label
          >
          <p class="display-text">
            {{ verification.nameOfSpouse }}
          </p>
        </li>
        <li class="list-group-item">
          <label for="exampleFormControlTextarea1"
            >How many children does the customer have?</label
          >
          <p class="display-text">
            {{ verification.customerChildren }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="exampleFormControlSelect2"
            >Is the customer's spouse salary earner or have business?</label
          >
          <p class="display-text">
            {{ verification.spouseSalary }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="exampleFormControlSelect2"
            >Guarantor gave the same house address/workplace address as the customer?</label
          >
          <p class="display-text">
            {{ verification.addressByGuarantor }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Picture or video of collaterals incase of loan</label
          >
          <p class="display-text">
            {{ verification.collateralPictures }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Customer has provided a picture of his accomodation/workplace  and it is the same as what was verified by the VCR?</label
          >
          <p class="display-text">
            {{ verification.accommodationPicture }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Customer has provided their BVN?</label
          >
          <p class="display-text">
            {{ verification.hasBvn }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="checklist">None of the Guarantors are the spouse of the customer</label>
          <p class="display-text">
            {{ verification.spouseNotGuarantor }}
          </p>
        </li>

        <div class="spaceAfter"></div>
        <h5>Home</h5>
        <li class="list-group-item my-3">
          <label for="checklist">How long has the customer lived at his/her location?</label>
          <p class="display-text">
            {{ verification.locationDuration }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Utility Bill OR Rent receipt OR Water bill provided? Does the address match the house address on the form?</label
          >
          <p class="display-text">
            {{ verification.bill }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Does the customer travel often?</label
          >
          <p class="display-text">
            {{ verification.customerTravels }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >What is the nature of the home addess (location description? how does it look? Is it obvious the customer lives there? Family pictures ?)</label
          >
          <p class="display-text">
            {{ verification.natureOfHomeAddress }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Who did you see at the house/speak to when you got to the house?</label
          >
          <p class="display-text">
            {{ verification.whoYouSpeakTo }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Does the customer own their house?</label
          >
          <p class="display-text">
            {{ verification.ownHouse }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Based on the feedback from neighbours, How long has the customer lived there?</label
          >
          <p class="display-text">
            {{ verification.houseLivedDuration }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >[Ask Question to neighbour] Have they had any issues with the neighbours or anyone in the area?</label
          >
          <p class="display-text">
            {{ verification.issueWithNeighbour }}
          </p>
        </li>
        <div class="spaceAfter"></div>
        <h5>Office/ Business</h5>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >How many years has the customers been working with the company ( >1 year) ?  if Office/Business is verified</label
          >
          <p class="display-text">
            {{ verification.yearsOfWork }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Have we met with the manager/HR/colleagues and do they speak well of the customer?</label
          >
          <p class="display-text">
            {{ verification.metManager }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >What does the customer do for the Company?</label
          >
          <p class="display-text">
            {{ verification.customerWork }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >What dates does customer receive salary?</label
          >
          <p class="display-text">
            {{ verification.dateOfSalary }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Does the customer travel often?</label
          >
          <p class="display-text">
            {{ verification.oftenTravel }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Utility Bill OR Rent receipt OR Water bill provided? Does the address match the house address on the form?</label
          >
          <p class="display-text">
            {{ verification.receipt }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Who did you see/speak to when you got to the office?</label
          >
          <p class="display-text">
            {{ verification.whoYouSpokeWith }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Based on the feedback from collegues, How long has the customer worked there?</label
          >
          <p class="display-text">
            {{ verification.customerWorkDuration }}
          </p>
        </li>
        
      </ol>
    </div>
    <div class="modal-body" v-if="verification.status === 'Informal' ">
      <ol class="list-group">
        <h5>Generic</h5>
        <li class="list-group-item my-3">
          <label for="checklist1" class=""
            >What location was visited and verified?</label
          >
          <p class="display-text">
            {{ verification.location.join(", ") }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="checklist">If other, Specify</label>
          <p class="display-text">
            {{ verification.otherOption || 'N/A' }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="checklist1" class=""
            >Does the address match what was given on the application Form?</label
          >
          <p class="display-text">
            {{ verification.addressMatch }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="checklist1" class=""
            >Distance to the customer's house/office/ business/shop verified does not cost more than N300?</label
          >
          <p class="display-text">
            {{ verification.customerDistance }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlSelect2"
            >Is customer married?</label
          >
          <p class="display-text">
            {{ verification.married }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="exampleFormControlSelect2"
            >If Yes - What is the name of their husband / wife and what is their number</label
          >
          <p class="display-text">
            {{ verification.nameOfSpouse }}
          </p>
        </li>
        <li class="list-group-item">
          <label for="exampleFormControlTextarea1"
            >How many children does the customer have?</label
          >
          <p class="display-text">
            {{ verification.customerChildren }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="exampleFormControlSelect2"
            >Is the customer's spouse salary earner or have business?</label
          >
          <p class="display-text">
            {{ verification.spouseSalary }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="exampleFormControlSelect2"
            >Guarantor gave the same house address/workplace address as the customer?</label
          >
          <p class="display-text">
            {{ verification.addressByGuarantor }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Picture or video of collaterals incase of loan</label
          >
          <p class="display-text">
            {{ verification.collateralPictures }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Customer has provided a picture of his accomodation/workplace  and it is the same as what was verified by the VCR?</label
          >
          <p class="display-text">
            {{ verification.accommodationPicture }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Customer has provided their BVN?</label
          >
          <p class="display-text">
            {{ verification.hasBvn }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="checklist">None of the Guarantors are the spouse of the customer</label>
          <p class="display-text">
            {{ verification.spouseNotGuarantor }}
          </p>
        </li>

        <div class="spaceAfter"></div>
        <h5>Home</h5>
        <li class="list-group-item my-3">
          <label for="checklist">How long has the customer lived at his/her location?</label>
          <p class="display-text">
            {{ verification.locationDuration }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Utility Bill OR Rent receipt OR Water bill provided? Does the address match the house address on the form?</label
          >
          <p class="display-text">
            {{ verification.bill }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Does the customer travel often?</label
          >
          <p class="display-text">
            {{ verification.customerTravels }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >What is the nature of the home addess (location description? how does it look? Is it obvious the customer lives there? Family pictures ?)</label
          >
          <p class="display-text">
            {{ verification.natureOfHomeAddress }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Who did you see at the house/speak to when you got to the house?</label
          >
          <p class="display-text">
            {{ verification.whoYouSpeakTo }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Does the customer own their house?</label
          >
          <p class="display-text">
            {{ verification.ownHouse }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Based on the feedback from neighbours, How long has the customer lived there?</label
          >
          <p class="display-text">
            {{ verification.houseLivedDuration }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >[Ask Question to neighbour] Have they had any issues with the neighbours or anyone in the area?</label
          >
          <p class="display-text">
            {{ verification.issueWithNeighbour }}
          </p>
        </li>
        <div class="spaceAfter"></div>
        <h5>Office/ Business</h5>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >"How many years has the customer owned thier business ( >1 year) ?  if Shop/Business is verified</label
          >
          <p class="display-text">
            {{ verification.yearsOfWorkInformal }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Have we met with the sellers/co-workers and do they speak well of the customer?</label
          >
          <p class="display-text">
            {{ verification.metManagerInformal }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >What is the customers's business?</label
          >
          <p class="display-text">
            {{ verification.customerWork }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >How often does the customer make sales? (Sales trend/is it seasonal)</label
          >
          <p class="display-text">
            {{ verification.customerSales }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Does the customer travel often?</label
          >
          <p class="display-text">
            {{ verification.oftenTravel }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Utility Bill OR Rent receipt OR Water bill provided? Does the address match the house address on the form?</label
          >
          <p class="display-text">
            {{ verification.receipt }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Who did you see/speak to when you got to the office?</label
          >
          <p class="display-text">
            {{ verification.whoYouSpokeWith }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Based on the feedback from collegues, How long has the customer worked there?</label
          >
          <p class="display-text">
            {{ verification.customerWorkDuration }}
          </p>
        </li>
        
      </ol>
    </div>
    <div class="modal-body" v-if="verification.status === 'Guarantor' ">
      <ol class="list-group">
        <h5>Guarantor</h5>
        <li class="list-group-item my-3">
          <label for="checklist1" class=""
            >How long have you known the customer</label
          >
          <p class="display-text">
            {{ verification.guarantorHowLong }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="checklist2" class=""
            >What is your relationship with this customer?</label
          >
          <p class="display-text">
            {{ verification.guarantorCustomerRelationship }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="checklist3" class=""
            >What is the customer occupation?</label
          >
          <p class="display-text">
            {{ verification.guarantorCustomerOccupation }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlSelect2"
            >How long has the customer done this business or job?</label
          >
          <p class="display-text">
            {{ verification.guarantorCustomerBusinessYear }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="exampleFormControlSelect2"
            >Where does the customer work or where is the customer's business?</label
          >
          <p class="display-text">
            {{ verification.guarantorCustomerAddress }}
          </p>
        </li>
        <li class="list-group-item">
          <label for="exampleFormControlTextarea1"
            >Does the customer own their own house or shop?</label
          >
          <p class="display-text">
            {{ verification.guarantorCustomerOwnHouse }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="exampleFormControlSelect2"
            >How many times has the customer borrowed money in the last 6 months?</label
          >
          <p class="display-text">
            {{ verification.guarantorCustomerBorrowed }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="exampleFormControlSelect2"
            >Has the customer ever been in trouble with the police?</label
          >
          <p class="display-text">
            {{ verification.guarantorCustomerTrouble }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >What is the name and address of the customer's mosque/church?</label
          >
          <p class="display-text">
            {{ verification.guarantorCustomerChurchAddress }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Does the customer plan to relocate in the next 6 months?</label
          >
          <p class="display-text">
            {{ verification.guarantorCustomerRelocate }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Does the customer spend a lot of time outside their current location [Ibadan/Ilorin/OgunState]?</label
          >
          <p class="display-text">
            {{ verification.guarantorCustomerTimeOutside }}
          </p>
        </li>

        <li class="list-group-item my-3">
          <label for="checklist4">What is the customer called in the neighborhood?</label>
          <p class="display-text">
            {{ verification.guarantorCustomerNameByNeighbor }}
          </p>
        </li>
        
        <li class="list-group-item my-3">
          <label for="checklist5">Does the customer have a large life event in the next 6 months ? (e.g. birth of a child, burial, children going to university)</label>
          <p class="display-text">
            {{ verification.guarantorCustomerLargeLife }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Can you share the name of anyone else who can vouch for the customer?</label
          >
          <p class="display-text">
            {{ verification.guarantorCustomerVouch }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >If Yes (Can you share the name of anyone else who can vouch for the customer?)</label
          >
          <p class="display-text">
            {{ verification.guarantorCustomerYesVouch }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Are you employed or do you own a business?</label
          >
          <p class="display-text">
            {{ verification.guarantorEmployStatus }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Does your monthly pay expend 3x the customer's monthly repayment?</label
          >
          <p class="display-text">
            {{ verification.guarantorMonthlyPay }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Can you provide your own address?</label
          >
          <p class="display-text">
            {{ verification.guarantorAddress }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >Have you stood as a guarantor for this cutomer and/or anyone in particiular before?</label
          >
          <p class="display-text">
            {{ verification.guarantorCustomerStoodFor }}
          </p>
        </li>
        <li class="list-group-item my-3">
          <label for="exampleFormControlTextarea1"
            >What was the outcome of their payment? Did they ever default and if yes how did you handle it?</label
          >
          <p class="display-text">
            {{ verification.guarantorCustomerDefault }}
          </p>
        </li>
        <div class="spaceAfter"></div>
      </ol>
    </div>
    <div class="modal-footer px-4">
      <button
        type="button"
        class="btn btn-danger rounded"
        data-dismiss="modal"
        @click="$modal.hide('verificationView')"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script>
import { get, post } from '../../utilities/api'
export default {
  props: {
    verification: {
      required: true,
      default: {},
    },
  },
  data() {
    return {}
  },

  methods: {},
  created() {},
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
.display-text{
    color: black;
    font-size: 1.5em;
    font-weight: 500;
    text-transform: capitalize;
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
</style>
