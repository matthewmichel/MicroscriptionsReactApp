import React from 'react';
import { CardElement } from 'react-stripe-elements';
import './CardSectionStyle.css'
import { Button } from '@material-ui/core';

const style = {
  base: {
    color: "#32325d",
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: "antialiased",
    fontSize: "16px",
    "::placeholder": {
      color: "#aab7c4"
    }
  },
  invalid: {
    color: "#fa755a",
    iconColor: "#fa755a"
  }
};

const CardSection = () => {

  async function submit() {
    console.log('attempt payment submit.');
    try {
        const data = {
            payment_method: {
                card: this.cardNumberRef.current.getElement(),
            }
        }
        const result = await this.props.stripe.confirmCardPayment(this.props.paymentIntent, data)
        console.log(result);
    } catch (err) {
        console.log(err);
    }
  }

  return (
    <label>
      <p style={{ fontFamily: 'Avenir' }}>Card details</p>
      <CardElement className="MyCardElement" style={style} ref={this.cardNumberRef}/>
    </label>
  );
};

export default CardSection;