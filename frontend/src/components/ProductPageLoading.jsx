import React from 'react';
import {css} from '@emotion/react';
import {RingLoader} from 'react-spinners';

function ProductPageLoading() {
    const override = css`
        display: block;
        margin: 0 auto;
    `;

    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
            <RingLoader color={'#3cba54'} css={override} size={150}/>
        </div>
    );
}

export default ProductPageLoading;
