import React from 'react';

const PaymentImage = () => (
  <img 
    style={{
      display: 'block',
      WebkitUserSelect: 'none',
      margin: 'auto',
     
      transition: 'background-color 300ms',
      backgroundColor: 'rgb(12 11 11)'
    }}
    src="https://codewithsadee.github.io/anon-ecommerce-website/assets/images/payment.png" 
    alt="Payment Options" 
  />
);

export default PaymentImage;