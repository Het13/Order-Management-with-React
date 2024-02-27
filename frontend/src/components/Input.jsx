function Input(props) {
    const {register} = props
    return (<>
        <input
            type={props.type}
            className="form-control"
            id={props.id}
            placeholder={"name@example.com"}
            {...register(props.name)}
        />
        <p className="pt-2" style={{"color": "red"}}>{props.errors?.message}</p>
        <label htmlFor={props.id}>{props.title}</label>
    </>)
}

export default Input;