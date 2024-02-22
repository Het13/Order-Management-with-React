import * as yup from "yup";

const phoneNumberRegex = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

export const registerSchema = yup
    .object({
        firstName: yup
            .string()
            .required("First name required"),
        lastName: yup
            .string()
            .required("Last Name required"),
        email: yup
            .string()
            .email()
            .required("email required"),
        password: yup
            .string()
            .min(8, "Password must be 8 characters long")
            .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)(?=.*[!@#$*])/, {
                message: "Password should contain at least one uppercase letter, lowercaseletter, digit and special symbol."
            })
            .required("Password required"),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password"), null], "Password does not match")
            .required(),
        username: yup
            .string()
            .required(),
        gender: yup
            .string()
            .oneOf(['M', 'F']),
        phone: yup
            .string()
            .matches(phoneNumberRegex, "Invalid Phone Number")
            .required(),
        addressLine1: yup
            .string()
            .required(),
        addressLine2: yup
            .string()
            .required(),
        city: yup
            .string(),
        state: yup
            .string(),
        pincode: yup
            .number()
            .positive()
            .integer()
            .required(),
        country: yup
            .string().required()
    })


export const loginSchema = yup
    .object({
        email: yup.string()
            .email("Invalid Email")
            .required("Email required"),
        password: yup.string()
            .min(8, "Password must be 8 characters long")
            .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)(?=.*[!@#$*])/, {
                message: "Password should contain at least one uppercase letter, lowercaseletter, digit and special symbol."
            })
            .required("Password required")
    })
    .required()
