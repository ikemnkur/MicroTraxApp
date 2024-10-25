// Move these components to the top level of your file or into separate files
require('dotenv').config();
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
// import { stripePromise } from './path-to-stripe-promise'; // Ensure you import your stripePromise correctly
import { fetchUserProfile, walletReloadAction } from "./api";
import { loadStripe } from '@stripe/stripe-js';


const stripePromise = loadStripe('pk_test_51OPgiOEViYxfJNd2ZA0pYlZ3MKdsIHDEhE9vzihdcj6CUW99q7ULSgR44nWfNVwhKvEHJ1JQCaf1NcXGhTROu8Dh008XrwD0Hv');

export const CheckoutForm = ({ setCoins }) => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const amount = query.get('amount');
    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() => {
        const fetchClientSecret = async () => {
            const YOUR_DOMAIN = 'http://localhost:5000';
            const response = await fetch(`${YOUR_DOMAIN}/create-checkout-session?amount=${amount}`, {
                method: "POST",
            });
            const data = await response.json();
            setClientSecret(data.clientSecret);
        };

        fetchClientSecret();
    }, [amount]);

    useEffect(() => {
        setCoins(parseInt(amount));
        console.log("Coins set to:", amount);
    }, [amount, setCoins]);

    if (!clientSecret) {
        return <div>Loading...</div>;
    }

    return (
        <div id="checkout">
            <div style={{ margin: "auto", padding: "auto", textAlign: "center" }}>
                <h1>You are buying: {(amount * 1000).toLocaleString()} Coins.</h1>
            </div>
            <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={{ clientSecret }}
            >
                <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
        </div>
    );
};

export const Return = ({ increaseCoins }) => {
    const [status, setStatus] = useState(null);
    const [customerEmail, setCustomerEmail] = useState('');
    const [done, setDone] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const sessionId = urlParams.get('session_id');

        const YOUR_DOMAIN = 'http://localhost:5000';
        fetch(`${YOUR_DOMAIN}/session-status?session_id=${sessionId}`)
            .then((res) => res.json())
            .then((data) => {
                setStatus(data.status);
                setCustomerEmail(data.customer_email);
            });

    }, []);

    useEffect(() => {
        if (status === 'complete' && !done) {
            const amount = parseInt(new URLSearchParams(window.location.search).get('amount')) || 0;
            increaseCoins(amount * 1000);
            setDone(true);
            // alert("Purchase Successful");
            console.log(status)
        } else if (status === 'open') {
            navigate('/checkout');
        }
    }, [status, done, increaseCoins, navigate]);

    useEffect(() => {
        if (status === 'complete') {
            setTimeout(() => {
                return <div>Server Error. Same Request.</div>;
            }, 5000)
        }

        setTimeout(() => {
            navigate('/');
        }, 10000)
    })


    if (status === 'complete') {
        return (
            <section id="success">
                <p>
                    We appreciate your business! A confirmation email will be sent to {customerEmail}.
                </p>
                <p>
                    If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
                </p>
            </section>
        );
    }

    return <div>Processing...</div>;
};
