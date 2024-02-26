import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {Link} from "react-router-dom";
import {loginSchema} from '../yupSchemas'
import axios from "axios";
import {useState} from "react";
import {loginSuccess} from "../redux/actions/actions";
import {connect} from "react-redux";
import Input from "../components/Input";


const Login = ({loginSuccess}) => {
    const [messageToShow, setMessageToShow] = useState('')
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm({
        resolver: yupResolver(loginSchema)
    })

    async function login(data) {
        try {
            return await axios.post('/api/v1/users/login', {}, {
                auth: {
                    username: data.email, password: data.password
                }
            })
        } catch (error) {
            return error.response
        }
    }

    const onSubmit = async (data) => {
        const response = await login(data)
        if (response.status === 200) {
            console.log(response)
            loginSuccess(response.data.email, response.data.token, response.data.customer_id, true)
            setMessageToShow(`Logged In Successfully`)
        } else if (response.status === 403) {
            setMessageToShow(response.data.message)
        } else if (response.status === 404) {
            setMessageToShow(response.data.message)
        } else if (response.status === 500) {
            setMessageToShow(response.data.message)
        }
    }

    return (<form className="w-25 m-auto my-5 " onSubmit={handleSubmit(onSubmit)}>
        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

        <div className="form-floating">
            <Input
                register={register}
                title="Email Address"
                type="text"
                id="floatingInput"
                placeholder="name@example.com"
                name="email"
                errors={errors.email}
            />
        </div>
        <div className="form-floating">
            <Input
                register={register}
                title="Password"
                type="password"
                id="floatingPassword"
                placeholder="Password"
                name="password"
                errors={errors.password}
            />
        </div>

        <div className="text-center">
            <button className="btn btn-outline-success w-50 py-2 mt-4" type="submit">Sign in</button>
        </div>
        <div className="text-center">
            <Link to="/register" className="btn btn-outline-dark w-50 py-2 mt-2">No account? Sign up</Link>
        </div>
        <h6 className="h3 mb-3 fw-normal">{messageToShow}</h6>
    </form>);
}


const mapDispatchToProps = {
    loginSuccess
}

export default connect(null, mapDispatchToProps)(Login);