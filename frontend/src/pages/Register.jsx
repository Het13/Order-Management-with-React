import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {registerSchema} from "../yupSchemas";
import {yupResolver} from "@hookform/resolvers/yup";
import {Link, redirect} from "react-router-dom";
import {City, Country, State} from 'country-state-city';
import axios from "axios";
import Input from "../components/Input";


const Register = () => {
    const [messageToShow, setMessageToShow] = useState('')
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');

    useEffect(() => {
    }, [country, state]);
    const {
        register,
        handleSubmit,
        formState: {
            errors
        }
    } = useForm({
        resolver: yupResolver(registerSchema)
    })

    async function registerCustomer(data) {
        const user_details = {
            "first_name": data.firstName,
            "last_name": data.lastName,
            "email": data.email,
            "password": data.password,
            "phone": data.phone,
            "address": {
                "address_line_1": data.addressLine1,
                "address_line_2": data.addressLine2,
                "city": data.city,
                "state": data.state,
                "pincode": data.pincode,
                "country": data.country
            },
            "username": data.username,
            "gender": data.gender
        }
        return await axios.post("/api/v1/customers", user_details);
    }

    const onSubmit = async (data) => {
        console.log(data)
        const response = await registerCustomer(data)
        console.log(response.data)
        if (response.data.status === "success") {
            setMessageToShow("Registered Successfully. Redirecting to Login Page")
            setTimeout(() => {
                return redirect('/login')
            }, 3000)
        } else {
            let message = response.data.message;
            if (message.toLowerCase() === "Duplicate email".toLowerCase()) {
                setMessageToShow("You already have an account. Try logging in.")
            } else {
                setMessageToShow("Some error occurred. Try again.")
            }
        }
    }


    return (
        <form className="w-50 m-auto my-5 " onSubmit={handleSubmit(onSubmit)}>
            <h6 style={{color: "red"}}>{messageToShow}</h6>
            <h1 className="h3 mb-3 fw-normal">Register</h1>
            <div className="row">
                <div className="col form-floating ">
                    <Input
                        title="First Name"
                        type="text"
                        id="first-name"
                        placeholder="First Name"
                        register={register}
                        errors={errors.firstName}
                        name="firstName"
                    />
                </div>
                <div className="col form-floating ">
                    <Input
                        title="Last Name"
                        type="text"
                        id="last-name"
                        placeholder="Last Name"
                        register={register}
                        errors={errors.lastName}
                        name="lastName"
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-8 form-floating">
                    <Input
                        title="Email"
                        type="text"
                        id="email"
                        placeholder="Email"
                        register={register}
                        errors={errors.email}
                        name="email"
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-8 form-floating">
                    <Input
                        title="Password"
                        type="password"
                        id="password"
                        placeholder="Password"
                        register={register}
                        errors={errors.password}
                        name="password"
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-8 form-floating">
                    <Input
                        title="Confirm Password"
                        type="password"
                        id="confirm-password"
                        placeholder="Confirm Password"
                        register={register}
                        errors={errors.confirmPassword}
                        name="confirmPassword"
                    />
                </div>
            </div>
            <div className="row">
                <div className="col input-group form-floating ">
                    <Input
                        title="Username"
                        type="text"
                        id="username"
                        placeholder="Username"
                        register={register}
                        errors={errors.username}
                        name="username"
                    />
                </div>
                <div className="col form-floating ">
                    <Input
                        title="phone"
                        type="number"
                        id="phone"
                        placeholder="Phone"
                        register={register}
                        errors={errors.phone}
                        name="phone"
                    />
                </div>
                <div className="col form-floating ">
                    <Input
                        title="gender"
                        type="text"
                        id="gender"
                        placeholder="Gender"
                        register={register}
                        errors={errors.gender}
                        name="gender"
                    />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col form-floating">
                    <Input
                        title="Address Line 1"
                        type="text"
                        id="address-line-1"
                        placeholder="Address Line 1"
                        register={register}
                        errors={errors.addressLine1}
                        name="addressLine1"
                    />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col form-floating">
                    <Input
                        title="Address Line 2"
                        type="text"
                        id="address-line-2"
                        placeholder="Address Line 2"
                        register={register}
                        errors={errors.addressLine2}
                        name="addressLine2"
                    />
                </div>
            </div>
            <div className="row mb-2">
                <div className="col form-floating">
                    <select
                        className="form-control"
                        name="country"
                        defaultChecked="Select"
                        {...register("country")}
                        onChange={(e) => {
                            const index = e.target.selectedIndex
                            setCountry(e.target.options[index].getAttribute('data-key'))
                        }}
                    >
                        <option className="form-control" data-key={null} value={null}>Select Country</option>
                        {Country.getAllCountries().map((country) => (
                            <option className="form-control" data-key={country.isoCode}
                                    value={country.name}>{country.name}</option>
                        ))}
                    </select>

                </div>
                <div className="col form-floating">
                    <select
                        className="form-control"
                        name="state"
                        {...register("state")}
                        onChange={(e) => {
                            const index = e.target.selectedIndex
                            setState(e.target.options[index].getAttribute('data-key'))
                        }}
                    >
                        <option className="form-control" data-key={null} value={null}>Select State</option>
                        {State.getStatesOfCountry(country).map((state) => (
                            <option className="form-control" data-key={state.isoCode}
                                    value={state.name}>{state.name}</option>
                        ))}

                    </select>
                </div>

            </div>
            <div className="row">
                <div className="col form-floating">
                    <select
                        className="form-control"
                        name="city"
                        {...register("city")}

                    >
                        <option className="form-control" data-key={null} value={null}>Select City</option>
                        {City.getCitiesOfState(country, state).map((city) => (
                            <option className="form-control"
                                    value={city.name}>{city.name}</option>
                        ))}

                    </select>
                </div>
                <div className="col form-floating ">
                    <Input
                        title="Pincode"
                        type="number"
                        id="pincode"
                        placeholder="Pincode"
                        register={register}
                        errors={errors.pincode}
                        name="pincode"
                    />
                </div>
            </div>
            <div className="text-center">
                <button className="btn btn-outline-success w-50 py-2 mt-4 fw-bold" type="submit">Sign in</button>
            </div>
            <div className="text-center">
                <Link to="/login" className="btn btn-outline-light w-50 py-2 mt-4">Already have account? Log In</Link>
            </div>

        </form>
    )
}

export default Register;