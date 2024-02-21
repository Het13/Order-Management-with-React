import {useForm} from "react-hook-form";

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm()

    const onSubmit = (data) => {
        console.log(data)
    }
    return (
        <form className="w-25 m-auto my-5 " onSubmit={handleSubmit(onSubmit)}>
            <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

            <div className="form-floating">
                <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid Email"
                        }
                    })}
                />
                {errors.email && <p className="error-message">{errors.email.message}</p>}
                <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating">
                <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    {...register("password", {
                        required: "Password is Required",
                        validate: {
                            checkLength: (value) => value.length >= 6,
                            checkPattern: (value) => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)(?=.*[!@#$*])/.test(value)
                        }
                    })}
                />
                {errors.password?.type === "required" && (
                    <p className="errorMsg">Password is required.</p>
                )}
                {errors.password?.type === "checkLength" && (
                    <p className="errorMsg">
                        Password should be at-least 6 characters.
                    </p>
                )}
                {errors.password?.type === "checkPattern" && (
                    <p className="errorMsg">
                        Password should contain at least one uppercase letter, lowercase
                        letter, digit, and special symbol.
                    </p>
                )}
                <label htmlFor="floatingPassword">Password</label>
            </div>

            <button className="btn btn-primary w-100 py-2 my-4" type="submit">Sign in</button>
            {/*<div className="form-floating w-100">*/}
            {/*    <a href="#" onClick={}>Sign Up</a>*/}
            {/*</div>*/}
        </form>
    );

}

export default Login;