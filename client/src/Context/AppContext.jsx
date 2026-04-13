/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect, useState } from "react"; // ✅ FIXED
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

// ✅ GLOBAL AXIOS SETUP
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKENDURL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();

    const [user, setuser] = useState(null);
    const [isseller, setisseller] = useState(false);
    const [showuserlogin, setshowuserlogin] = useState();
    const [products, setproducts] = useState([]);

    const [cartitems, setcartitems] = useState({});
    const [searchquery, setsearchquery] = useState({});

    // ✅ Fetch Seller
    const fetchseller = async () => {
        try {
            const { data } = await axios.get('/api/seller/is-auth', {
                withCredentials: true
            });
            setisseller(data.success);
        } catch {
            setisseller(false);
        }
    };

    // ✅ Fetch User
    const fetchuser = async () => {
        try {
            const { data } = await axios.get('/api/user/is-auth', {
                withCredentials: true
            });

            if (data.success) {
                setuser(data.user);
                setcartitems(data.user.cartitems || {}); // ✅ FIX
            }

        } catch {
            setuser(null);
        }
    };

    // ✅ Fetch Products
    const fetchproducts = async () => {
        try {
            const { data } = await axios.get('/api/product/list');
            if (data.success) {
                setproducts(data.products);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // ✅ Add to Cart
    const addtoCart = (itemId) => {
        let cartdata = structuredClone(cartitems);

        if (cartdata[itemId]) {
            cartdata[itemId] += 1;
        } else {
            cartdata[itemId] = 1;
        }

        setcartitems(cartdata);
        toast.success("Added to Cart");
    };

    // ✅ Update Cart Quantity
    const updatecartitems = (itemId, quantity) => {
        let cartdata = structuredClone(cartitems);
        cartdata[itemId] = quantity;
        setcartitems(cartdata);
        toast.success("Cart Updated");
    };

    // ✅ Remove Item
    const removeitem = (itemId) => {
        let cartdata = structuredClone(cartitems);

        if (cartdata[itemId]) {
            cartdata[itemId] -= 1;
            if (cartdata[itemId] === 0) {
                delete cartdata[itemId];
            }
        }

        setcartitems(cartdata);
        toast.success("Removed from Cart");
    };

    // ✅ Cart Count
    const getcartcount = () => {
        let total = 0;
        for (const item in cartitems) {
            total += cartitems[item];
        }
        return total;
    };

    // ✅ Cart Amount
    const getcartAmount = () => {
        let total = 0;

        for (const item in cartitems) {
            let product = products.find(p => p._id === item);
            if (product) {
                total += product.offerprice * cartitems[item];
            }
        }

        return Math.floor(total * 100) / 100;
    };

    // ✅ Initial Load
    useEffect(() => {
        fetchuser();
        fetchproducts();
        fetchseller();
    }, []);

    // ✅ Sync Cart to DB
    useEffect(() => {
        const updatecart = async () => {
            try {
                await axios.post('/api/cart/update',
                    { cartitems },
                    { withCredentials: true } // ✅ FIX
                );
            } catch (error) {
                toast.error(error.message);
            }
        };

        if (user) {
            updatecart();
        }

    }, [cartitems]);

    const value = {
        navigate, user, setuser, isseller, setisseller,
        showuserlogin, setshowuserlogin,
        products, currency,
        addtoCart, updatecartitems, removeitem,
        cartitems, searchquery, setsearchquery,
        getcartAmount, getcartcount,
        axios, fetchproducts,setcartitems
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
