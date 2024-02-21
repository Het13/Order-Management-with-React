import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {Link, useNavigate} from "react-router-dom";


const schema = yup
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

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm({
        resolver: yupResolver(schema)
    })

    const onSubmit = (data) => {
        console.log(data)
    }

    let navigate = useNavigate();
    const routeChange = () => {
        let path = '/cart';
        navigate(path)
    }
    return (
        <form className="w-25 m-auto my-5 " onSubmit={handleSubmit(onSubmit)}>
            <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

            <div className="form-floating">
                <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                    {...register("email")}
                />
                <p className="pt-2">{errors.email?.message}</p>
                <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating">
                <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    {...register("password")}
                />
                <p>{errors.password?.message}</p>
                <label htmlFor="floatingPassword">Password</label>
            </div>
            <div className="text-center">
                <button className="btn btn-outline-success w-50 py-2 mt-4" type="submit">Sign in</button>
            </div>
            <div className="text-center">
                <Link to="/signup" className="btn btn-outline-dark w-50 py-2 mt-2">Sign up</Link>
            </div>
        </form>
    );

}

export default Login;