function CartBox(props) {
    const totalAmount = props.cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const discount = 5;
    return (
        <>
            <div className="col-md-5 col-lg-6 order-md-last">
                <h4 className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-warning">Your cart</span>
                    <span className="badge bg-warning rounded-pill">{props.cart.length}</span>
                </h4>
                <ul className="list-group mb-3">
                    {props.cart.map((item) => (<li className="list-group-item d-flex justify-content-between lh-sm">
                        <div>
                            <h6 className="my-0">{item.product}</h6>
                        </div>
                        <span className="text-body-secondary">{(item.price * item.quantity).toFixed(2)}</span>
                    </li>))}
                    <li className="list-group-item d-flex justify-content-between text-success">
                        <span>Discount </span>
                        <strong>-{discount}%</strong>
                    </li>
                    <li className="list-group-item d-flex justify-content-between text-primary">
                        <span>Total </span>
                        <strong>${(totalAmount - 0.05 * totalAmount).toFixed(2)}</strong>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default CartBox;