import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ProductContext } from '../../context/ProductsContext'

const AddProducts = () => {


    const { fetchProducts, allProducts, setAllProducts } = useContext(ProductContext)

    const { productId } = useParams();
    const isEditMode = Boolean(productId);
    // console.log("isEditMode", isEditMode)

    const [product, setProduct] = useState(null)

    const mainImageRef = useRef(null);
    const subImageRefs = useRef([]);

    const [mainImage, setMainImage] = useState(null);
    const [subImages, setSubImages] = useState([null, null, null, null]);


    const [size, setSize] = useState("")
    const [sizeQyt, setSizeQyt] = useState("")

    const [Loading, setLoading] = useState(false)

    const [checkBoxes, setCheckBoxes] = useState({
        isActive: true,
        featured: false
    })

    const handleMainImage = (e) => {
        setMainImage(e.target.files[0]);
    };

    const handleSubImage = (e, index) => {
        const newImages = [...subImages];
        newImages[index] = e.target.files[0];
        setSubImages(newImages);
    };

    const [productDetails, setProductDetails] = useState({
        title: '',
        price: '',
        category: '',
        description: ''
    })

    function handleChange(e) {
        const { name, value } = e.target
        setProductDetails((prev) => ({ ...prev, [name]: value }))
    }

    // console.log('productDetails', productDetails)
    // console.log('id', productId)


    function handleCheckBox(e) {
        // console.log(e.target.name, e.target.value)
        const { name, checked } = e.target;
        setCheckBoxes((prev) => ({ ...prev, [name]: checked }))
    }

    // to reset Form
    function resetForm() {
        setProductDetails({
            title: '',
            price: '',
            stock: '',
            category: '',
            dimensions: '',
            description: ''
        });

        setMainImage(null);
        setSubImages([null, null, null, null]);

        if (mainImageRef.current) mainImageRef.current.value = "";

        subImageRefs.current.forEach((input) => {
            if (input) input.value = "";
        });
    }


    async function fetchSingleProduct(productId) {
        try {
            const response = await axios({
                method: 'get',
                url: `${import.meta.env.VITE_BASE_URL}/product/fetchSingleProduct/${productId}`,
                withCredentials: true
            })
            const { message, success, product } = response.data;
            if (success) {
                console.log(message);
                setProduct(product);
            }
        }
        catch (error) {
            console.error("add product error", error)
        }
    }
    useEffect(() => {
        if (isEditMode && productId) {
            fetchSingleProduct(productId);
        }
    }, [isEditMode, productId]);

    console.log('product', product)

    // const pp = product?.productSizes.map((item, index) => console.log(item))


    useEffect(() => {
        if (isEditMode && product) {
            setProductDetails({
                title: product.productTitle || '',
                price: product.productPrice || '',
                stock: product.productStock || '',
                category: product.productMaterial || '',
                dimensions: product.productDimensions || '',
                description: product.productDescription || ''
            });
        }
        if (isEditMode && product) {
            setCheckBoxes({
                isActive: product.isActive || "",
                featured: product.featured || ""
            })
        }

    }, [isEditMode, product]);


    // to add products
    async function handleAddProduct(formData) {

        setLoading(true)

        try {
            const response = await axios({
                method: "post",
                url: `${import.meta.env.VITE_BASE_URL}/product/add-product`,
                data: formData,
                withCredentials: true,
            })
            const { message, success } = response.data;
            if (success) {
                console.log(message)
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
        catch (error) {
            console.error("add product error", error)
            const message = error.response?.data?.message
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
        finally {
            setLoading(false)
            resetForm()
        }
    }

    // to edit products
    async function updateProduct(productId, formData) {
        try {
            const response = await axios({
                method: 'put',
                url: `${import.meta.env.VITE_BASE_URL}/product/updateProduct/${productId}`,
                data: formData,
                withCredentials: true
            })
            const { message, success, product } = response.data;
            if (success) {
                setProduct(product)
                handleClear()
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
        catch (error) {
            console.error("edit product error", error)
            const message = error.response?.data?.message
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
        finally {
            resetForm()
        }
    }

    // to submit form 
    async function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", productDetails.title)
        formData.append("price", productDetails.price)
        formData.append("category", productDetails.category)
        formData.append("description", productDetails.description)
        formData.append("isActive", checkBoxes.isActive)
        formData.append("featured", checkBoxes.featured)
        formData.append("size", size)
        formData.append("sizeQyt", sizeQyt)

        // images
        if (mainImage) {
            formData.append("mainImage", mainImage);
        }

        subImages.forEach((img) => {
            if (img) formData.append("images", img);
        });


        if (isEditMode) {
            await updateProduct(productId, formData);
        }
        else {
            await handleAddProduct(formData)
        }
    }

    function handleSize(e) {
        setSize(e.target.value)
    }

    function handleSizeQyt(e) {
        setSizeQyt(e.target.value)
    }

    // to handel size in edit mode 
    function editSize(clickedSize, clickedStock) {
        setSize(clickedSize)
        setSizeQyt(clickedStock)
    }

    // to clear size field 
    function handleClear() {
        setSize('')
        setSizeQyt('')
    }

    return (

        <div className='flex'>
            {/* <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" /> */}

            <Sidebar />

            <div className="w-full p-6">
                <h2 className="text-3xl font-semibold mb-6 text-gray-800">
                    Add New Product
                </h2>

                <div className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* ---------------- LEFT SIDE • IMAGES ---------------- */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3 text-gray-700">
                            Product Images
                        </h3>

                        {/* Main Image */}
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center mb-6">
                            {mainImage ? (
                                <img
                                    src={URL.createObjectURL(mainImage)}
                                    alt="Main"
                                    className="h-48 w-48 object-cover rounded-lg"
                                />
                            ) : (
                                <p className="text-gray-400 mb-2">Upload Main Image</p>
                            )}
                            <input type="file" ref={mainImageRef} onChange={handleMainImage} className="mt-2" />
                        </div>

                        {/* Sub Images */}
                        <div className="grid grid-cols-2 gap-4">
                            {subImages.map((img, index) => (
                                <div
                                    key={index}
                                    className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center"
                                >
                                    {img ? (
                                        <img
                                            src={URL.createObjectURL(img)}
                                            alt="Sub"
                                            className="h-28 w-28 object-cover rounded-lg"
                                        />
                                    ) : (
                                        <p className="text-gray-400 text-sm">Sub Image {index + 1}</p>
                                    )}
                                    <input
                                        type="file"
                                        ref={(el) => (subImageRefs.current[index] = el)}
                                        onChange={(e) => handleSubImage(e, index)}
                                        className="mt-2 w-[90%]"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ---------------- RIGHT SIDE • PRODUCT DETAILS ---------------- */}
                    <div>
                        <h3 className="text-lg font-semibold mb-5 text-gray-700">
                            Product Details
                        </h3>

                        <form className="space-y-4" onSubmit={handleSubmit}>

                            {/* title */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">Title</label>
                                <input
                                    value={productDetails.title}
                                    name='title'
                                    onChange={handleChange}
                                    type="text"
                                    className="border border-gray-300 p-3 rounded-lg outline-none"
                                    placeholder="Product title"
                                />
                            </div>

                            {/* price and category*/}
                            <div className="grid grid-cols-2 gap-4">

                                {/* price */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700">Price</label>
                                    <input
                                        value={productDetails.price}
                                        name='price'
                                        onChange={handleChange}
                                        type="number"
                                        className="border border-gray-300 p-3 rounded-lg outline-none"
                                        placeholder="₹ Price"
                                    />
                                </div>

                                {/* category */}
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700">Category</label>
                                    <select value={productDetails.category} name='category' onChange={handleChange} className="border border-gray-300 p-3 rounded-lg outline-none">
                                        <option>Select Category</option>
                                        <option>Men</option>
                                        <option>Women</option>
                                        <option>Kid</option>
                                    </select>
                                </div>

                            </div>

                            {/* sizes */}
                            <div className="border-2 rounded-xl p-4 space-y-4">

                                <div className="flex gap-3 flex-wrap">
                                    {/* Size Card */}
                                    {product?.productSizes.map((sizes, index) => {
                                        return (<div key={index} onClick={() => { editSize(sizes.size, sizes.stock) }} className="w-16 cursor-pointer border rounded-lg overflow-hidden text-center shadow-sm">
                                            <div className="bg-blue-600 text-white font-semibold py-1">
                                                {sizes.size}
                                            </div>
                                            <div className="py-1 text-sm font-medium">
                                                Qty: {sizes.stock}
                                            </div>
                                        </div>)
                                    })}

                                </div>

                                {/* SIZE ROW */}
                                <div className="flex gap-4 items-center">
                                    <input
                                        type="text"
                                        placeholder="Size (e.g. S, M, L)"
                                        className="border rounded-md px-3 py-2 w-32"
                                        onChange={handleSize}
                                        value={size}
                                        name='size'
                                    />

                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="Stock"
                                        className="border rounded-md px-3 py-2 w-28"
                                        onChange={handleSizeQyt}
                                        value={sizeQyt}
                                        name='sizeQyt'
                                    />

                                    <div
                                        className="text-red-500 font-bold cursor-pointer"
                                        onClick={() => { handleClear() }}
                                    >
                                        ✕
                                    </div>
                                </div>

                                {/* ADD SIZE BUTTON */}
                                <button
                                    className="text-blue-600 font-medium"
                                >
                                    + Add another size
                                </button>
                            </div>

                            {/* description */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    value={productDetails.description}
                                    name='description'
                                    onChange={handleChange}
                                    rows="3"
                                    className="border border-gray-300 p-3 rounded-lg outline-none"
                                    placeholder="Write full product description..."
                                ></textarea>
                            </div>

                            {/* checkboxes */}
                            <div className="flex gap-6 items-center">

                                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                                    <input
                                        checked={checkBoxes.isActive}
                                        onChange={handleCheckBox}
                                        type="checkbox"
                                        name="isActive"
                                        className="w-4 h-4 accent-green-600"
                                    />
                                    Active
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                                    <input
                                        checked={checkBoxes.featured}
                                        onChange={handleCheckBox}
                                        type="checkbox"
                                        name="featured"
                                        className="w-4 h-4 accent-green-600"
                                    />
                                    Featured
                                </label>

                            </div>

                            <button type='submit' className={`w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center ${Loading ? "opacity-70 cursor-not-allowed" : ""} `}>
                                {Loading ? (<span className="animate-spin border-2 border-white border-t-transparent rounded-full h-5 w-5"></span>) : (isEditMode ? "Update Product" : "Add Product")}
                            </button>

                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AddProducts
