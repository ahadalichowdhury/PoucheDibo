import axios from 'axios';
import React, { useState, useEffect } from 'react';

function StripeForDriver() {
  const [stripe, setStripe] = useState(null);
  const userDetailsString = localStorage.getItem("userDetails");
  const userDetails = JSON.parse(userDetailsString);

  const email = userDetails.email;
  console.log(email);

  useEffect(() => {
    const loadStripe = async () => {
      const stripeModule = await import('@stripe/stripe-js');
      const stripeObject = await stripeModule.loadStripe('pk_test_51OEnDEE7CJNVLFNH7NY5UAy4dvnMbmcQufcniFdAJLq66B1Qy9dZhIOzqsNooORfpUhOGKQEiEhde9fKG0sIrItV00hQp8a0kZ'); // Replace with your actual publishable key
      setStripe(stripeObject);
    };

    loadStripe();
  }, []);

  const handlePaymentClick = async () => {
    try {
      if (!stripe) {
        console.error('Stripe.js has not been loaded.');
        return;
      }

      const response = await axios.post("http://localhost:8000/api/v1/make-instructor", {
        email: email,
      });

      const sessionId = response.data.sessionId;

      // Use the dynamically loaded stripe object
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>

      <button onClick={handlePaymentClick}>Click Here</button>
    </div>
  );
}

export default StripeForDriver;
