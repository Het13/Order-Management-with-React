import {useState} from "react";
import 'react-toastify/dist/ReactToastify.css';
import {connect} from "react-redux";
import Skeleton from "react-loading-skeleton";

function Product(props) {
    const [inCart, setInCart] = useState(props.cart === undefined ? false : props.cart.some(item => item.id === props.id))

    function handleAddToCart() {
        setInCart(true)
        props.onAdd(props.product)
    }

    return (<div className="card col-3 " style={{width: "18rem"}}>
        <div className="card-body ">
            <h5 className="card-title">{props.name || <Skeleton count={1}/>}</h5>
            <h6 className="card-subtitle mb-2 text-body-secondary">{props.price}</h6>
            <p className="card-text">{props.class || <Skeleton count={1}/>}</p>
            {inCart === false ? <button className="btn btn-success me-5" onClick={() => {
                handleAddToCart()
            }}>Add to Cart
            </button> : <div className="d-flex align-items-center">
                <button className="btn btn-danger me-5" onClick={() => {
                    setInCart(false)
                    props.onRemove(props.id)
                }}>Remove
                </button>
            </div>}
        </div>
    </div>)
}

const mapStateToProps = (state) => ({
    user: state.user
})
export default connect(mapStateToProps)(Product);