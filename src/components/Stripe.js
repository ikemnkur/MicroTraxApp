// Move these components to the top level of your file or into separate files
require('dotenv').config();
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
// import { stripePromise } from './path-to-stripe-promise'; // Ensure you import your stripePromise correctly
import { fetchUserProfile, walletReloadAction, purchaseCrypto } from "./api";
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import Notifications from './Notifications';


const stripePromise = loadStripe('pk_test_51OPgiOEViYxfJNd2ZA0pYlZ3MKdsIHDEhE9vzihdcj6CUW99q7ULSgR44nWfNVwhKvEHJ1JQCaf1NcXGhTROu8Dh008XrwD0Hv');

export const CheckoutForm = ({ setCoins }) => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const amount = query.get('amount');
    const [clientSecret, setClientSecret] = useState(null);

    useEffect(() => {
        const fetchClientSecret = async () => {
            // const YOUR_DOMAIN = 'http://localhost:5000';
            const API_URL = process.env.REACT_APP_API_SERVER_URL || 'http://localhost:5000'; // Adjust this if your API URL is different
            const response = await fetch(`${API_URL}/create-checkout-session?amount=${amount}`, {
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
    const [userdata, setUserData] = useState([]);
    const navigate = useNavigate();
    const [amnt, setAmnt] = useState(0);
    const [ud, setUD] = useState(() => {
        const storedData = localStorage.getItem("userdata");
        return storedData ? JSON.parse(storedData) : {};
    });

    console.log("Stripe page - user data: ", ud);

    // Move setUserData inside useEffect
    useEffect(() => {
        setUserData(ud);
    }, [ud]);

    const createNotification = async (notificationData) => {
        try {
            const token = localStorage.getItem('token');
            const API_URL = process.env.REACT_APP_API_SERVER_URL || 'http://localhost:5000';
            await axios.post(`${API_URL}/notifications/create`, notificationData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("New notification: ", notificationData.message);
        } catch (error) {
            console.error('Error creating notification:', error);
        }
    };

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const sessionId = urlParams.get('session_id');
        const API_URL = process.env.REACT_APP_API_SERVER_URL || 'http://localhost:5000';

        fetch(`${API_URL}/session-status?session_id=${sessionId}`)
            .then((res) => res.json())
            .then((data) => {
                setStatus(data.status);
                setCustomerEmail(data.customer_email);
            });
    }, []);

    useEffect(() => {
        if (status === 'complete' && !done) {
            const amount = parseInt(new URLSearchParams(window.location.search).get('amount')) || 0;
            setAmnt(amount); // Use setAmnt instead of direct assignment
            increaseCoins(amount * 1000);
            setDone(true);
            console.log(status);
        } else if (status === 'open') {
            navigate('/stripe-checkout');
        }
    }, [status, done, increaseCoins, navigate]);

    useEffect(() => {
        if (status === 'complete') {
            createNotification({
                type: 'coin purchase',
                recipient_user_id: userdata.user_id,
                recipient_username: userdata.username,
                message: `You bought ₡${amnt} via Stripe: [from: Bot].`,
                from: "Admin",
                date: new Date()
            });

            const errorTimeout = setTimeout(() => {
                // Handle server error or duplicate request
                // You might want to set some error state here instead of returning JSX
                console.error("Server Error. Same Request.");
            }, 5000);

            const navigateTimeout = setTimeout(() => {
                navigate('/dashboard');
            }, 10000);

            return () => {
                clearTimeout(errorTimeout);
                clearTimeout(navigateTimeout);
            };
        }
    }, [status, amnt, userdata, navigate]);

    if (status === 'complete') {
        return (
            <section id="success">
                <p>
                    We appreciate your business! A confirmation email will be sent to {customerEmail}. 
                </p>
                <p>
                    If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
                </p>
                <p>
                    This page will be redirected in a few seconds. Click here to go <a href="/dashboard"> Dashboard </a>.
                </p>
            </section>
        );
    }

    return <div>Processing...</div>;
};

// export const Return = ({ increaseCoins }) => {
//     const [status, setStatus] = useState(null);
//     const [customerEmail, setCustomerEmail] = useState('');
//     const [done, setDone] = useState(false);
//     const [userdata, setUserData] = useState([])
//     const navigate = useNavigate();
//     const [amnt, setAmnt] = useState(0);
//     const [ud, setUD] = useState(JSON.parse(localStorage.getItem("userdata")))

//     // let ud = JSON.parse(localStorage.getItem("userdata"))
//     console.log("Stripe page - user data: ", ud)
//     setUserData(ud)

//     const createNotification = async (notificationData) => {
//         try {
//           const token = localStorage.getItem('token');
//           await Axios.post(API_URL + '/notifications/create', notificationData, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           console.log("New notification: ", notificationData.message)
//           // Optionally, update the notifications state or refetch notifications
//         } catch (error) {
//           console.error('Error creating notification:', error);
//         }
//       };
    
    

//     useEffect(() => {
//         const queryString = window.location.search;
//         const urlParams = new URLSearchParams(queryString);
//         const sessionId = urlParams.get('session_id');
//         const API_URL = process.env.REACT_APP_API_SERVER_URL || 'http://localhost:5000'; // Adjust this if your API URL is different
//         // const YOUR_DOMAIN = 'http://localhost:5000';
//         fetch(`${API_URL}/session-status?session_id=${sessionId}`)
//             .then((res) => res.json())
//             .then((data) => {
//                 setStatus(data.status);
//                 setCustomerEmail(data.customer_email);
//             });

//     }, []);

//     useEffect(() => {
//         if (status === 'complete' && !done) {
//             const amount = parseInt(new URLSearchParams(window.location.search).get('amount')) || 0;
//             amnt = amount;
//             increaseCoins(amount * 1000);
//             setDone(true);
//             // alert("Purchase Successful");
//             console.log(status)
//         } else if (status === 'open') {
//             navigate('/stripe-checkout');
//         }
//     }, [status, done, increaseCoins, navigate]);

//     useEffect(() => {
//         if (status === 'complete') {
//             setTimeout(() => {
//                 return <div>Server Error. Same Request.</div>;
//             }, 5000)
//         }

//         setTimeout(() => {
//             navigate('/dashboard');
//         }, 10000)
//     })


//     if (status === 'complete') {
//         // Example usage
//       createNotification({
//         type: 'coin purchase',
//         recipient_user_id: userdata.user_id,
//         recipient_username: userdata.username,
//         message: `You bought ₡${amnt} via Stripe: [from: Bot].`,
//         from: "Admin",
//         date: new Date()
//       });
//         return (
//             <section id="success">
//                 <p>
//                     We appreciate your business! A confirmation email will be sent to {customerEmail}.
//                 </p>
//                 <p>
//                     If you have any questions, please email <a href="mailto:orders@example.com">orders@example.com</a>.
//                 </p>
//             </section>
//         );
//     }

//     return <div>Processing...</div>;
// };
