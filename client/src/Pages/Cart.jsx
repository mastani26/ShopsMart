import React, { useEffect, useState } from 'react'
import { useAppContext } from '../Context/AppContext'
import { assets } from '../assets/assets'
import toast from 'react-hot-toast'

const Cart = () => {
    const {
        products,
        currency,
        cartitems,
        setcartitems,
        removeitem,
        getcartcount,
        updatecartitems,
        navigate,
        getcartAmount,
        axios,
        user
    } = useAppContext()

    const [cartarray, setcartarray] = useState([])
    const [addresses, setaddresses] = useState([])
    const [selectedaddress, setselectedaddress] = useState(null)
    const [paymenyoption, setpaymentoption] = useState("COD")
    const [showAddress, setShowAddress] = useState(false)

    const getcart = () => {
    let temparray = []
    for (const key in cartitems) {
        const foundProduct = products.find((item) => item._id === key) // ✅ renamed

        if (foundProduct) {
            temparray.push({
                ...foundProduct,
                quantity: cartitems[key]
            })
        }
    }
    setcartarray(temparray)
}


    //Function to get user address form db
    
    const getuseraddress = async () => {
    try {
        const { data } = await axios.get('/api/address/get', { withCredentials: true }); // ✅ FIX
        

        if (data.success) {
            setaddresses(data.addresses);

            if (data.addresses.length > 0) {
                setselectedaddress(data.addresses[0]);
            }
        } else {
            toast.error(data.message);
        }

    } catch (error) {
        toast.error(error.message);
    }
};



        
    // PlaceOrder with COD
    const placeorder = async () => {
    try {
        if (!selectedaddress) {
            return toast.error("Please select an address");
        }

        if (paymenyoption === "COD") {

            const { data } = await axios.post('/api/order/cod', {
                items: cartarray.map(item => ({
                productId: item._id,
                quantity: item.quantity
            })),

                address: selectedaddress._id
            }, {
                withCredentials: true   // ✅ IMPORTANT
            });

            if (data.success) {
                toast.success(data.message);
                setcartitems({});   // ✅ works now
                navigate('/my-orders');
            } else {
                toast.error(data.message);
            }
        }else{
            //Place Order with stripe

            const { data } = await axios.post('/api/order/stripe', {
                items: cartarray.map(item => ({
                productId: item._id,
                quantity: item.quantity
            })),

                address: selectedaddress._id
            }, {
                withCredentials: true   // ✅ IMPORTANT
            });

            if (data.success) {
                
                window.location.replace(data.url)

            } else {
                toast.error(data.message);
            }

        }

    } catch (error) {
        toast.error(error.message);
    }
};



    useEffect(() => {
        if (products.length > 0 && cartitems) {
            getcart()
        }
    }, [products, cartitems])

    useEffect(()=>{
        if(user){
            getuseraddress()
        }
    },[user])
    return products.length > 0 && cartitems ? (
        <div className="flex flex-col md:flex-row mt-16">

            {/* LEFT SIDE */}
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-primary">{getcartcount()} Items</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {cartarray.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">

                        {/* PRODUCT */}
                        <div className="flex items-center md:gap-6 gap-3">
                            <div
                                onClick={() => {
                                    navigate(`/products/${product.category.toLowerCase()}/${product._id}`)
                                    window.scrollTo(0, 0)
                                }}
                                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded overflow-hidden"
                            >
                                <img
                                    className="max-w-full h-full object-cover"
                                    src={product.image[0]}
                                    alt={product.name}
                                />
                            </div>

                            <div>
                                <p className="hidden md:block font-semibold">{product.name}</p>

                                <div className="font-normal text-gray-500/70">
                                    <p>Weight: <span>{product.weight || "N/A"}</span></p>

                                    {/* ✅ Quantity Fix */}
                                    <div className='flex items-center'>
                                        <p>Qty:</p>
                                        <select
                                            value={cartitems[product._id]}
                                            onChange={(e) =>
                                                updatecartitems(product._id, Number(e.target.value))
                                            }
                                            className='outline-none'
                                        >
                                            {Array(cartitems[product._id] > 9 ? cartitems[product._id] : 9)
                                                .fill('')
                                                .map((_, i) => (
                                                    <option key={i} value={i + 1}>
                                                        {i + 1}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SUBTOTAL */}
                        <p className="text-center">
                            {currency}{product.offerprice * product.quantity}
                        </p>

                        {/* ✅ REMOVE BUTTON FIX */}
                        <button
                            onClick={() => removeitem(product._id)}
                            className="cursor-pointer mx-auto"
                        >
                            <img
                                src={assets.remove_icon}
                                alt="Remove"
                                className='inline-block w-6 h-6'
                            />
                        </button>
                    </div>
                ))}

                {/* CONTINUE SHOPPING */}
                <button
                    onClick={() => {
                        navigate("/products")
                        window.scrollTo(0, 0)
                    }}
                    className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium"
                >
                    <img
                        className='group-hover:translate-x-1 transition'
                        src={assets.arrow_right_icon_colored}
                        alt="Arrow"
                    />
                    Continue Shopping
                </button>
            </div>

            {/* RIGHT SIDE */}
            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">

                    {/* ADDRESS */}
                    <p className="text-sm font-medium uppercase">Delivery Address</p>

                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500">
                            {selectedaddress
                                ? `${selectedaddress.street}, ${selectedaddress.city}, ${selectedaddress.state}, ${selectedaddress.country}`
                                : "No Address Found"}
                        </p>

                        <button
                            onClick={() => setShowAddress(!showAddress)}
                            className="text-primary hover:underline cursor-pointer"
                        >
                            Change
                        </button>

                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">

                                {/* ✅ ADDRESS FIX */}
                                {addresses.map((address, index) => (
                                    <p
                                        key={index}
                                        onClick={() => {
                                            setselectedaddress(address)
                                            setShowAddress(false)
                                        }}
                                        className="text-gray-500 p-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        {address.street},{address.city},{address.state},{address.country}
                                    </p>
                                ))}

                                <p
                                    onClick={() => navigate("/addaddress")}
                                    className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10"
                                >
                                    Add address
                                </p>
                            </div>
                        )}
                    </div>

                    {/* PAYMENT */}
                    <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

                    <select
                        onChange={(e) => setpaymentoption(e.target.value)}
                        className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
                    >
                        <option value="COD">Cash On Delivery</option>
                        <option value="Online">Online Payment</option>
                    </select>
                </div>

                <hr className="border-gray-300" />

                {/* BILL */}
                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Price</span>
                        <span>{currency}{getcartAmount()}</span>
                    </p>

                    <p className="flex justify-between">
                        <span>Shipping Fee</span>
                        <span className="text-green-600">Free</span>
                    </p>

                    <p className="flex justify-between">
                        <span>Tax (2%)</span>
                        <span>{currency}{getcartAmount() * 2 / 100}</span>
                    </p>

                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total Amount:</span>
                        <span>{currency}{getcartAmount() + (getcartAmount() * 2 / 100)}</span>
                    </p>
                </div>

                {/* ✅ PLACE ORDER FIX */}
                <button
                    onClick={placeorder}
                    className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition"
                >
                    {paymenyoption === "COD" ? "Place Order" : "Proceed to Checkout"}
                </button>
            </div>
        </div>
    ) : null
}

export default Cart
