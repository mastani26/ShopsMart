import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../Context/AppContext'
import toast from 'react-hot-toast';


const SellerLogin = () => {
    const {isseller, setisseller,navigate,axios} = useAppContext()
    const[email,setemail] = useState("");
    const [password,setpassword] = useState("");

    const onsubmithandler = async(event)=>{
        try {
            event.preventDefault();

            const {data} = await axios.post('/api/seller/login',{email,password})
            if(data.success){
                setisseller(true)
                navigate('/seller')
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
        
    }

    useEffect(()=>{
        if(isseller){
            navigate("/seller")
        }
    },[isseller])

  return !isseller && (
    <form onSubmit={onsubmithandler} autoComplete="off" className='min-h-screen flex items-center text-sm text-gray-600'>
        <div className='flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88
            rounded-lg shadow-xl border border-gray-200'>
            <p className='text-2xl font-medium m-auto'><span className='text-primary'>Seller</span>Login</p>

            <div className='w-full'>
                <p>Email</p>
                <input onChange={(e)=> setemail(e.target.value)} value={email} type="email" placeholder='Enter Your Email' 
                className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary'
                required/>
            </div>

            <div className='w-full'>
                <p>Password</p>
                <input onChange={(e)=> setpassword(e.target.value)} value={password} type="password" placeholder='Enter Your Password' 
                className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary'
                required/>
            </div>

            <button className='bg-primary text-white w-full py-2 rounded-md cursor-pointer'>Log In</button>

        </div>
    </form>
  )
}

export default SellerLogin
