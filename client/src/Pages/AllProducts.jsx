import React, { useEffect, useState } from 'react'
import { useAppContext } from '../Context/AppContext'
import ProductCard from '../Components/ProductCard'

const AllProducts = () => {

    const { products, searchquery } = useAppContext()
    const [filterproducts, setfilterproducts] = useState([])

    useEffect(() => {
        if (searchquery && searchquery.length > 0) {
            setfilterproducts(
                products.filter(product =>
                    product.name.toLowerCase().includes(searchquery.toLowerCase())
                )
            )
        } else {
            setfilterproducts(products)
        }
    }, [products, searchquery])

    return (
        <div className='mt-16 flex flex-col'>

            {/* Heading */}
            <div className='flex flex-col items-end w-max'>
                <p className='text-2xl font-medium uppercase'>ALL PRODUCTS</p>
                <div className='w-16 h-0.5 bg-primary rounded-full'></div>
            </div>

            {/* Products */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 
            lg:grid-cols-5 gap-3 md:gap-6 mt-6'>
                {filterproducts
                    .filter(product => product.inStock) // show only in-stock
                    .map((product, index) => (
                        <ProductCard key={index} product={product} />
                    ))
                }
            </div>

        </div>
    )
}

export default AllProducts
