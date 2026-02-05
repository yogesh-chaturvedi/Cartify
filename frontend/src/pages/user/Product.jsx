import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { ProductContext } from '../../context/ProductsContext';
import axios from 'axios';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { getProductCardImage, getMainProductImage, getThumbnailImage } from '../../utils/cloudinary';
import CollectionsComp from '../../components/CollectionsComp';
import ChatBot from '../../components/ChatBot';

const Product = () => {
    const { verifyUser, user, setUser, loading } = useContext(AuthContext)
    const { fetchProducts, allProducts, setAllProducts } = useContext(ProductContext)
    const { fetchCart, cart, setCart } = useContext(CartContext)

    // to scroll at top when component mount
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    console.log('cart', cart)

    const [selectedSize, setSelectedSize] = useState('')

    const productId = useParams();
    const location = useLocation();

    const [product, setProduct] = useState(null)
    // console.log(product)

    const [firstImage, setfirstImage] = useState(null)

    const relatedProducts = allProducts.filter((item) => item.productMaterial === product?.productMaterial &&
        item._id !== product?._id)

    // fetching fresh product 
    async function fetchFreshProduct(productId) {
        try {
            const response = await axios({
                method: 'get',
                url: `${import.meta.env.VITE_BASE_URL}/product/fetchSingleProduct/${productId}`,
                withCredentials: true
            })
            const { message, success, product } = response.data;
            if (success) {
                console.log(message);
                setProduct(product)
                setfirstImage(product.mainImage.url);
                setfirstImage(product.mainImage.url);
            }
        }
        catch (error) {
            console.error("fetchFreshProduct error", error)
        }
    }
    useEffect(() => {
        fetchFreshProduct(productId.id)
    }, [productId.id])


    // to add and update cart 
    async function addToCart(product, productId, selectedSize, quantity = 1) {

        // check if size is available or not 
        if (selectedSize === "") {
            toast("Please select size", {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            return
        }

        // deepcopy for rollback
        const prevCart = JSON.parse(JSON.stringify(cart));

        setCart(prev => {
            if (!prev) return prev;

            const items = [...prev.items];
            const index = items.findIndex(
                item => item.product._id === productId && item.size === selectedSize);

            if (index > -1) {
                items[index] = { ...items[index], quantity: items[index].quantity + quantity };
            } else {
                items.push({ product, size: selectedSize, quantity, priceAtThatTime: product.productPrice });
            }

            return { ...prev, items };
        })

        try {
            const response = await axios({
                method: 'post',
                url: `${import.meta.env.VITE_BASE_URL}/cart/addItem/${productId}`,
                data: { selectedSize, quantity },
                withCredentials: true
            })
        }
        catch (error) {
            setCart(prevCart)
            console.error("addToCart error", error)
            const message = error.response?.data?.message;
            toast(message, {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    }

    const availableSizes = product?.productSizes.filter((size) => size.stock !== 0)

    function handleSize(sizes) {
        setSelectedSize(sizes.size)
    }

    return (

        <div>

            <Navbar />

            <div className="min-h-screen bg-white px-6 py-10">

                {/* product image and details  */}
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

                    {/* LEFT: PRODUCT IMAGES */}
                    <div className="flex gap-4 items-center">

                        {/* THUMBNAILS */}
                        <div className="flex flex-col gap-2">
                            {product && ([product?.mainImage, ...(product?.images || [])].map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setfirstImage(img.url)}
                                    className={`w-20 h-20 rounded-lg overflow-hidden border transition
            ${firstImage === img.url ? "border-blue-600" : "border-gray-300"}
          `}
                                >
                                    <img
                                        src={getThumbnailImage(img.url, 150)}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            )))}
                        </div>

                        {/* MAIN IMAGE */}
                        <div className="w-full max-w-[520px] aspect-[4/3] bg-white rounded-xl shadow-md flex items-center justify-center overflow-hidden">
                            {firstImage && getMainProductImage(firstImage, 900, 900) ? (<img
                                src={getMainProductImage(firstImage, 900, 900)}
                                className="w-full h-full object-contain bg-gray-100"
                                loading="eager"
                                alt='productImage'
                            />) : (<div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                                Loading Image...
                            </div>)}
                        </div>

                    </div>

                    {/* RIGHT: PRODUCT DETAILS */}
                    <div className="space-y-5">
                        <h2 className="text-3xl font-bold text-black">
                            {product?.productTitle}
                        </h2>

                        <p className="text-green-600 text-2xl font-semibold">
                            ₹{product?.productPrice}
                        </p>

                        <p className="text-black leading-relaxed">
                            {product?.productDescription}
                        </p>

                        <p className="text-text-black leading-relaxed">
                            Category: {product?.productMaterial}
                        </p>

                        <div className="text-black leading-relaxed flex gap-1 items-center">
                            sizes: {availableSizes?.map((sizes, index) => {
                                return (<div key={index} onClick={() => { handleSize(sizes) }} className="w-16 cursor-pointer border rounded-lg overflow-hidden text-center shadow-sm">
                                    <div className={`${selectedSize === sizes.size ? 'bg-blue-700' : 'bg-blue-600'} text-white font-semibold py-1`}>
                                        {sizes.size}
                                    </div>
                                </div>)
                            })}
                        </div>

                        <button
                            onClick={() => addToCart(product, product?._id, selectedSize)}
                            className="bg-blue-600 text-white w-full py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                            Add to Cart
                        </button>
                    </div>

                </div>

                {/* customer chatbot */}
                <ChatBot productId={product?._id} />

                {/* RELATED PRODUCTS */}
                <div className="max-w-7xl mx-auto mt-20">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900">Related Products</h3>
                    <CollectionsComp products={relatedProducts} />
                </div>

            </div>

            <Footer />
        </div >
    )
}

export default Product
