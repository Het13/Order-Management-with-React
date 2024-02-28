import React from 'react';
import {useForm} from 'react-hook-form';

function PaymentForm() {
    const {register, handleSubmit, formState: {errors}, watch} = useForm();
    const onSubmit = (data) => console.log(data);
    const paymentMethod = watch("paymentMethod"); // Watch the selected payment method

    return (
        <form className="p-3 border rounded" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
                <label className="form-label">Payment Method:</label>
                <div className="form-check">
                    <input type="radio" value="cash" className="form-check-input" {...register("paymentMethod")} />
                    <label className="form-check-label">Cash</label>
                </div>
                <div className="form-check">
                    <input type="radio" value="creditcard"
                           className="form-check-input" {...register("paymentMethod")} />
                    <label className="form-check-label">Credit Card</label>
                </div>
                <div className="form-check">
                    <input type="radio" value="netbanking"
                           className="form-check-input" {...register("paymentMethod")} />
                    <label className="form-check-label">Net Banking</label>
                </div>
                <div className="form-check">
                    <input type="radio" value="upi"
                           className="form-check-input" {...register("paymentMethod")} />
                    <label className="form-check-label">UPI</label>
                </div>
            </div>
            {paymentMethod === "creditcard" && (
                <div className="mb-3">
                    <label htmlFor="cardNumber" className="form-label">Card Number:</label>
                    <input type="text" id="cardNumber" className="form-control"/>
                </div>
            )}
            {paymentMethod === "netbanking" && (
                <div className="mb-3">
                    <label htmlFor="netBankingId" className="form-label">Net Banking ID:</label>
                    <input type="text" id="netBankingId" className="form-control"/>
                </div>
            )}
            {paymentMethod === "upi" && (
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
