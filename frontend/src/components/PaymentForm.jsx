import React from 'react';
import {useForm} from 'react-hook-form';

function PaymentForm({onPlaceOrder}) {
    const {
        register,
        handleSubmit,
        formState: {errors},
        watch
    } = useForm();

    const onSubmit = (data) => {
        onPlaceOrder(data)
        console.log(data);
    }


    const paymentMethod = watch("paymentMethod");

    return (
        <form className="p-3 border rounded" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
                <label className="form-label">Payment Method:</label>
                <div className="form-check">
                    <input type="radio" value="Cash" className="form-check-input" {...register("paymentMethod")} />
                    <label className="form-check-label">Cash</label>
                </div>
                <div className="form-check">
                    <input type="radio" value="Credit Card"
                           className="form-check-input" {...register("paymentMethod")} />
                    <label className="form-check-label">Credit Card</label>
                </div>
                <div className="form-check">
                    <input type="radio" value="Net Banking"
                           className="form-check-input" {...register("paymentMethod")} />
                    <label className="form-check-label">Net Banking</label>
                </div>
                <div className="form-check">
                    <input type="radio" value="UPI"
                           className="form-check-input" {...register("paymentMethod")} />
                    <label className="form-check-label">UPI</label>
                </div>
            </div>
            {paymentMethod === "Credit Cart" && (
                <div className="mb-3">
                    <label htmlFor="cardNumber" className="form-label">Card Number:</label>
                    <input type="text" id="cardNumber" className="form-control"/>
                </div>
            )}
            {paymentMethod === "Net Banking" && (
                <div className="mb-3">
                    <label htmlFor="netBankingId" className="form-label">Net Banking ID:</label>
                    <input type="text" id="netBankingId" className="form-control"/>
                </div>
            )}
            {paymentMethod === "UPI" && (
                <div className="mb-3">
                    <label htmlFor="upiId" className="form-label">UPI ID:</label>
                    <input type="text" id="upiId" className="form-control"/>
                </div>
            )}
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    );
}

export default PaymentForm;
