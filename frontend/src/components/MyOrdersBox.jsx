import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import {Link} from 'react-router-dom'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

function MyOrdersBox({handleSetIsOrder, handleSetOrder, orders}) {


    const handleInfoClick = (order) => {
        handleSetIsOrder(true)
        handleSetOrder(order)
    }

    if (orders === null) {
        return (<>
            <SkeletonTheme baseColor="grey" highlightColor="#444" height={60}>
                <Skeleton count={7}/>
            </SkeletonTheme>
        </>)
    } else if (Object.keys(orders).length === 0) {
        return (<>
            <h1>No orders</h1>
            <Link to='/products' className="btn btn-outline-info">Continue Shopping</Link>
        </>)
    }

    const options = {day: '2-digit', month: 'short', year: 'numeric'};


    return (<>
        <div className="accordion my-order-accordian" id="accordionExample">
            {orders.map((order, index) => (<div className="accordion-item" key={index}>
                <h2 className="accordion-header" id={`heading-${index}`}>
                    <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse-${index}`}
                        aria-expanded="false"
                        aria-controls={`collapse-${index}`}
                    >
                        <div className="container">
                            <div className="row align-items-center fw-semibold"
                                 style={{
                                     color: order.status === 'In process' ? 'dodgerblue' : order.status === 'Shipped' ? 'lightgreen' : 'orangered',
                                 }}>
                                {order.status === 'Cancelled'
                                    ? <>
                                        <div className="col-3">{order.status}</div>
                                        <div className="col-7"></div>
                                    </>
                                    : <>
                                        <div className="col-3">{order.status}</div>
                                        <div className="col-4">Rs. {order.amount_paid.toFixed(2)}</div>
                                        <div
                                            className="col-3"> {new Date(order['order_date']).toLocaleDateString('en-US', options)}
                                        </div>
                                    </>
                                }
                                <div className="col-2">
                                    <button className="btn btn-outline-info btn-sm border-0"
                                            onClick={() => {
                                                handleInfoClick(order)
                                            }}><InfoOutlinedIcon/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </button>
                </h2>

                <div
                    id={`collapse-${index}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`heading-${index}`}
                    data-bs-parent="#accordionExample"
                >
                    {order.status === 'Cancelled' || <div className="accordion-body">
                        <div className='row'>
                            <div className="col-7 fw-bold">Product</div>
                            <div className="col-3 fw-bold text-center">Quantity</div>
                        </div>
                        {order.products.map((product) => (<div className='row'>
                            <div className="col-7 fs-6">{product.name}</div>
                            <div className="col-3 text-center fs-6">{product.quantity}</div>
                        </div>))}
                    </div>}
                </div>
            </div>))}
        </div>
    </>)
}


export default MyOrdersBox;