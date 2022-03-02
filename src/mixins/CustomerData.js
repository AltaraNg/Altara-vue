import { required, minLength, maxLength } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      selected: "",
      data: {},
      newCustomer: {},
      formData: {
        cc_reg_id: "",
        newCustomer: {
          first_name: "",
          last_name: "",
          middle_name: "",
          telephone: "",
          email: "",
          date_of_birth: "",
          civil_status: "",
          year_together: "",
          gender: "",
          level_of_education: "",
          add_street: "",
          add_houseno: "",
          add_nbstop: "",
          area_address: "",
          city: "",
          state: "",
          add_addinfo_description: "",
          duration_of_residence: "",
          people_in_household: "",
          depend_on_you: "",
          number_of_work: "",
          visit_hour_from: "",
          visit_hour_to: "",
          type_of_home: "",
          no_of_rooms: "",
          nextofkin_first_name: "",
          nextofkin_middle_name: "",
          nextofkin_last_name: "",
          nextofkin_telno: "",
          employment_status: "",
          occupation: "",
          working_individual_Phone_number: "",
          name_of_company_or_business: "",
          current_sal_or_business_income: "",
          post_in_company: "",
          receive_income_means: "",
          payment_period: "",
          years_of_existence_or_work_duration: "",
          days_of_work: "",
          comp_street_name: "",
          comp_house_no: "",
          cadd_nbstop: "",
          comp_area: "",
          company_city: "",
          company_state: "",
          company_telno: "",
          cvisit_hour_from: "",
          cvisit_hour_to: "",
          market_name: "",
          monthly_gains: "",
          bank_account: "",
          cadd_addinfo: "",
        },
      },
      validationRules: [
        {
          newCustomer: {
            first_name: { required },
            last_name: { required },
            telephone: {
              required,
              minLength: minLength(11),
              maxLength: maxLength(11),
            },
            email: { required },
            date_of_birth: { required },
            civil_status: { required },
            gender: { required },
            level_of_education: { required },
          },
        },
        {
          newCustomer: {
            add_street: { required },
            add_houseno: { required },
            add_nbstop: { required },
            area_address: { required },
            city: { required },
            state: { required },
          },
        },
        {
          newCustomer: {
            duration_of_residence: { required },
            people_in_household: { required },
            depend_on_you: { required },
            number_of_work: { required },
            visit_hour_from: { required },
            visit_hour_to: { required },
            type_of_home: { required },
            no_of_rooms: { required },
            nextofkin_first_name: { required },
            nextofkin_last_name: { required },
            nextofkin_telno: {
              required,
              minLength: minLength(11),
              maxLength: maxLength(11),
            },
          },
        },
        {
          newCustomer: {
            employment_status: { required },
            occupation: { required },
            working_individual_Phone_number: {
              required,
              minLength: minLength(11),
              maxLength: maxLength(11),
            },
            company_telno: {
              required,
              minLength: minLength(11),
              maxLength: maxLength(11),
            },
            name_of_company_or_business:{required},
            current_sal_or_business_income:{required},
            years_of_existence_or_work_duration:{required},
            days_of_work:{required},
            comp_street_name:{required},
            comp_house_no:{required},
            cadd_nbstop:{required},
            comp_area:{required},
            company_city:{required},
            company_state:{required},
            cvisit_hour_from:{required},
            cvisit_hour_to:{required},
          },
        },
      ],
      occupations: [
        {
          id: 1,
          jobType: "Trader",
          category: "informal(business)",
          names: ["Food", "Drinks", "Homeware", "Clothing", "Miscellaneous"],
        },
        {
          id: 2,
          jobType: "Driver",
          category: "informal(business)",
          names: ["Keke Napep", "Taxi", "Motorbike", "Bus driver", "Private"],
        },
        {
          id: 3,
          jobType: "Banker",
          category: "formal",
          names: [
            "Teller",
            "Financial Analyst",
            "Loan Officer",
            "Operation",
            "Risk Specialist",
            "Security & Fraud Specialist",
          ],
        },
        {
          id: 4,
          jobType: "Elementary workers",
          category: "informal(business)",
          names: [
            "Mining worker",
            "Construction worker",
            "Manufacturing laborer",
          ],
        },
        {
          id: 5,
          jobType: "Maintenance Worker",
          category: "informal(business)",
          names: [
            "Cleaner",
            "Electrician",
            "Plumber",
            "Carpenter",
            "Welder",
            "Painter",
            "Vulcanizer",
            "Security Guard",
          ],
        },
        {
          id: 6,
          jobType: "Farming",
          category: "informal(business)",
          names: ["Livestock farmer", "Crop farmer"],
        },
        {
          id: 7,
          jobType: "Civil Servant",
          category: "formal",
          names: [],
        },
        {
          id: 8,
          jobType: "Sales & Services",
          category: "informal(business)",
          names: [
            "Car-wash",
            "Laundry",
            "Sales Assistant",
            "Cook",
            "Hairdresser/Barber",
            "Cashier",
            "Waiter",
            "Hotel Assistant",
            "Receptionist",
          ],
        },
        {
          id: 9,
          jobType: "Technical Professionals",
          category: "formal",
          names: [
            "Teacher",
            "Doctor",
            "Lawyer",
            "Nurse",
            "Pharmacist",
            "Journalist",
            "Engineer",
            "Civic",
            "Electrical",
            "Chemical",
            "Mechanical",
            "I.T.",
          ],
        },
        {
          id: 10,
          jobType: "Pastor",
          category: "informal(business)",
          names: [],
        },
        {
          id: 11,
          jobType: "Entertainment",
          category: "informal(business)",
          names: [
            "Actor/Actress",
            "Event Planner",
            "Musician",
            "Producer",
            "Tailor/Fashion Designer",
          ],
        },
        {
          id: 12,
          jobType: "NYSC",
          category: "formal",
          names: [],
        },
        {
          id: 13,
          jobType: "Other",
          category: "informal(business)",
          names: [],
        },
      ],
      mode: this.$route.meta.mode,
      cc_reg_id: "",
      user: {},
      error: {},
      states: {},
      branches: {},
      registered: false,
      fillWorkGuarantor: false,
      gender: [ "female"],
      fillPersonalGuarantor: false,
      typesOfHome: [ "owned", "rented"],
      paymentPeriod: ["daily", "weekly", "monthly"],
      receiveIncomeMeans: ["bank deposit", "cheque", "cash"],
      noOfRooms: ["two room", "more than Two room"],
      employmentStatus: ["formal", "informal(business)", "unemployed"],
      relationshipPG: ["friend", "family", "co-worker", "employee", "other"],
      civilStatus: ["married", "divorced", "widow", "live together"],
      relationshipWG: [
        "supervisor",
        "neighbouring worker",
        "co-worker",
        "employee",
      ],
      weekdays: [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ],
      highestLevelOfEdu: [
        "secondary",
        "polytechnic",
        "primary",
        "university",
        "masters",
      ],
      durations: [
        "less than 1 year",
        "1 year",
        "2 years",
        "3 years",
        "between 4 - 9 years",
        "more than 10 years",
        "more than 20 years",
      ],
      relationships: [
        "spouse",
        "mother",
        "sibling",
        "uncle",
        "nephew",
        "in-law",
        "friend",
        "child",
        "father",
        "grandparent",
        "cousin",
        "caretaker",
        "grandchild",
      ],

      isLifestyle: false,
      isClick: false,
      occName: [],
      isActive: false,
      isOther: false,
      identity: 0,
    };
  },
};
