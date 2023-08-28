import { Validator } from "vee-validate"
import { required } from "vee-validate"

Validator.extend("age_check", {
  ...required,
  validate: value => {
    if (!value) {
      return required.validate(value)
    }

    const selectedDate = new Date(value)
    const today = new Date()
    const minDate = new Date(
      today.getFullYear() - 21,
      today.getMonth(),
      today.getDate()
    )

    return selectedDate <= minDate
  },
  getMessage: field => `Customer must be at least 21 years old.`,
})
