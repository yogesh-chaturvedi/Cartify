import React from 'react'
import { getMainProductImage, getProductCardImage, getThumbnailImage } from '../utils/cloudinary'
import { Link } from 'react-router-dom'

const CollectionsComp = ({ products }) => {
    return (
        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 ">
            {products.length === 0 ? (<div className='text-black font-bold text-3xl'>No product available</div>) : (products.map((product) => (
                <div
                    key={product._id}
                    className="bg-whitem shadow-lg rounded-xl hover:shadow-xl transition-shadow p-4"
                >
                    <div className="w-full aspect-square overflow-hidden rounded-lg bg-gray-100">
                        <img
                            src={getProductCardImage(product.mainImage.url, 400, 400)}
                            alt={product.productTitle}
                            className="w-full h-full object-contain bg-gray-100"
                        />
                    </div>

                    <p className="font-bold text-xl mt-4 text-blue-900 truncate">
                        {product.productTitle}
                    </p>

                    <p className="text-gray-600 text-sm mt-1 truncate">
                        {product.productDescription}
                    </p>

                    <p className="font-semibold text-lg mt-3 text-green-600">
                        {product.productPrice}
                    </p>

                    <Link to={`/product/${product._id}`} state={product} className="mt-4 block bg-green-400 text-white px-5 py-2 rounded-lg hover:bg-green-500 transition-colors w-full text-center">
                        View Details
                    </Link>
                </div>
            )))}
        </div>
    )
}

export default CollectionsComp
