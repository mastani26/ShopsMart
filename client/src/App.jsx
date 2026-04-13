import React from "react";
import Navbar from './Components/Navbar'
import { Route,Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import { Toaster } from "react-hot-toast";
import Footer from "./Components/Footer";
import { useAppContext } from "./Context/AppContext";
import Login from "./Components/Login";
import AllProducts from "./Pages/AllProducts";
import ProductCategory from "./Pages/ProductCategory";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import AddAddress from "./Pages/AddAddress";
import MyOrders from "./Pages/MyOrders";
import SellerLogin from "./Components/Seller/SellerLogin";
import SellerLayout from "./Pages/Seller/SellerLayout";
import AddProducts from "./Pages/Seller/AddProducts";
import ProductList from "./Pages/Seller/ProductList";
import Orders from "./Pages/Seller/Orders";
import Loading from "./Components/Loading";

const App = () =>{
  const issellerpath = useLocation().pathname.includes("seller")
  const {showuserlogin,isseller} = useAppContext()
  return(
    <div className="text-default min-h-screen text-gray-700 bg-white">

        {issellerpath?null :<Navbar/>}
        {showuserlogin? <Login/>:null} 

        <Toaster/>
        <div className={`${issellerpath ? "":"px-6 md:px-16 lg:px-24 xl:px-32"}`}>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/products" element={<AllProducts/>}/>
             <Route path="/products/:category" element={<ProductCategory/>}/>
             <Route path="/products/:category/:id" element={<ProductDetails/>}/>
             <Route path="/Cart" element={<Cart/>}/>
             <Route path="/addaddress" element={<AddAddress/>}/>

             <Route path="/my-orders" element={<MyOrders/>}/>

             <Route path="/loader" element={<Loading/>}/>


             <Route path="/seller" element={isseller ? <SellerLayout/> : <SellerLogin/>}>
                <Route index element={<AddProducts/>}/>
                <Route path="product-list" element={<ProductList/>}/>
                <Route path="orders" element={<Orders/>}/>
            </Route>


          </Routes>


        </div>
        {!issellerpath && <Footer/>}
    </div>
  );
}



export default App