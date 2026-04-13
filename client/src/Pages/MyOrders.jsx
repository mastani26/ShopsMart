import React, { useEffect, useState } from 'react'
import { useAppContext } from '../Context/AppContext'

const MyOrders = () => {
  const [myorders, setmyorders] = useState([])
  const { currency, axios, user } = useAppContext()

  const fetchmyorders = async () => {
    try {
      const { data } = await axios.get('/api/order/user', {
        withCredentials: true
      })


      if (data.success) {
        setmyorders(data.orders)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchmyorders()
    }
  }, [user])

  return (
    <div className='mt-16 pb-16'>

      {/* TITLE */}
      <div className='flex flex-col items-end w-max mb-8'>
        <p className='text-2xl font-medium uppercase'>My Orders</p>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>

      {/* NO ORDERS */}
      {myorders.length === 0 && (
        <p className='text-gray-500'>No orders found</p>
      )}

      {/* ORDERS */}
      {myorders.map((order, index) => (
        <div
          key={index}
          className='border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl'
        >

          {/* HEADER */}
          <p className='flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col gap-2'>
            <span>OrderId: {order._id}</span>
            <span>Payment: {order.paymenttype}</span>
            <span>Total: {currency}{order.amount}</span>
          </p>

          {/* ITEMS */}
          {order.items && order.items.length > 0 ? (
            order.items.map((item, idx) => (
              <div
                key={idx}
                className='border-b border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4'
              >

                {/* IMAGE */}
                <div className='flex items-center'>
                  <img
                    src={item.productId?.image?.[0] || "https://via.placeholder.com/80"}
                    alt=""
                    className='w-16 h-16 object-cover'
                  />
                </div>

                {/* DETAILS */}
                <div>
                  <h2 className='text-lg font-medium'>
                    {item.productId?.name || "Product not found"}
                  </h2>
                  <p>Category: {item.productId?.category || "-"}</p>
                </div>

                {/* INFO */}
                <div>
                  <p>Qty: {item.quantity}</p>
                  <p>Status: {order.status}</p>
                  <p>
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* PRICE */}
                <p className='text-primary font-medium'>
                  {currency}
                  {(item.productId?.offerprice || 0) * item.quantity}
                </p>

              </div>
            ))
          ) : (
            <p className='text-red-500 mt-3'>⚠ No items found</p>
          )}

        </div>
      ))}

    </div>
  )
}

export default MyOrders
