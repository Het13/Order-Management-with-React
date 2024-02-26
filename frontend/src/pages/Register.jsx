import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {registerSchema} from "../yupSchemas";
import {yupResolver} from "@hookform/resolvers/yup";
import {Link, redirect} from "react-router-dom";
import {City, Country, State} from 'country-state-city';
import axios from "axios";


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
            <h6 style={{color: "red"}}>Message={messageToShow}</h6>
            <h1 className="h3 mb-3 fw-normal">Register</h1>
            <div className="row">
                <div className="col form-floating ">
                    <input
                        type="text"
                        className="form-control"
                        id="floatingInput"
                        placeholder="First Name"
                        {...register("firstName")}
                    />
                    <p className="pt-2">{errors.firstname?.message}</p>
                    <label htmlFor="floatingInput">First Name</label>
                </div>
                <div className="col form-floating ">
                    <input
                        type="text"
                        className="form-control"
                        id="floatingInput"
                        placeholder="Last Name"
                        {...register("lastName")}
                    />
                    <p className="pt-2">{errors.lastname?.message}</p>
                    <label htmlFor="floatingInput">Last Name</label>
                </div>
            </div>
            <div className="row">
                <div className="col-8 form-floating">
                    <input
                        type="text"
                        className="form-control"
                        id="floatingInput"
                        placeholder="name@example.com"
                        {...register("email")}
                    />

                    <label htmlFor="floatingInput">Email address</label>
                </div>
                <p className="col-4 m-2">{errors.email?.message}</p>
            </div>
            <div className="row">
                <div className="col-8 form-floating">
                    <input
                        type="password"
                        className="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        {...register("password")}
                    />
                    <label htmlFor="floatingPassword">Password</label>
                </div>
                <p className="col-4 m-2">{errors.password?.message}</p>
            </div>
            <div className="row">
                <div className="col-8 form-floating">
                    <input
                        type="password"
                        className="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        {...register("confirmPassword")}
                    />
                    <label htmlFor="floatingPassword">Confirm Password</label>
                </div>
                <p className="col-4 m-2">{errors.confirmPassword?.message}</p>
            </div>
            <div className="row">
                <div className="col form-floating ">
                    <input
                        type="text"
                        className="form-control"
                        id="floatingInput"
                        placeholder="Username"
                        {...register("username")}
                    />
                    <p className="pt-2">{errors.username?.message}</p>
                    <label htmlFor="floatingInput">Username</label>
                </div>
                <div className="col form-floating ">
                    <input
                        type="text"
                        className="form-control"
                        id="floatingInput"
                        placeholder="Phone"
                        {...register("phone")}
                    />
                    <p className="pt-2">{errors.phone?.message}</p>
                    <label htmlFor="floatingInput">Phone</label>
                </div>
                <div className="col form-floating ">
                    <input
                        type="text"
                        className="form-control"
                        id="floatingInput"
                        placeholder="Gender"
                        {...register("gender")}
                    />
                    <label htmlFor="floatingInput">Gender</label>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col form-floating">
                    <input
                        type="text"
                        className="form-control"
                        id="floatingInput"
                        placeholder="line 2"
                        {...register("addressLine1")}
                    />
                    <label htmlFor="floatingInput">Address Line 1</label>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col form-floating">
                    <input
                        type="text"
                        className="form-control"
                        id="floatingInput"
                        placeholder="line 1"
                        {...register("addressLine2")}
                    />
                    <label htmlFor="floatingInput">Address Line 2</label>
                </div>
            </div>
            <div className="row mb-2">
                <div className="col form-floating">
                    <select
                        className="form-control"
                        name="country"
                        {...register("country")}
                        onChange={(e) => {
                            const index = e.target.selectedIndex
                            setCountry(e.target.options[index].getAttribute('data-key'))
                        }}
                    >
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
                        {City.getCitiesOfState(country, state).map((city) => (
                            <option className="form-control"
                                    value={city.name}>{city.name}</option>
                        ))}

                    </select>
                </div>
                <div className="col form-floating ">
                    <input
                        type="text"
                        className="form-control"
                        id="floatingInput"
                        placeholder="Last Name"
                        {...register("pincode")}
                    />
                    <label htmlFor="floatingInput">Pincode</label>
                </div>
            </div>
            <div className="text-center">
                <button className="btn btn-outline-success w-50 py-2 mt-4" type="submit">Sign in</button>
            </div>
            <div className="text-center">
                <Link to="/login" className="btn btn-outline-dark w-50 py-2 mt-4">Already have account? Log In</Link>
            </div>

        </form>
    )
}

export default Register;