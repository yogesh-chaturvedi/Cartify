const ProductModels = require('../models/Products')
const mongoose = require('mongoose')
const cloudinary = require('../cloudinary')

// to add new products
const addProductsControllers = async (req, res) => {
    try {
        const { title, price, category, description, isActive, featured, size, sizeQyt } = req.body;

        // ✅ MAIN IMAGE
        const mainImage = req.files?.mainImage?.[0]
            ? {
                url: req.files.mainImage[0].path,
                publicId: req.files.mainImage[0].filename, // ✅ FIX
            }
            : null;

        // ✅ SUB IMAGES
        const images = req.files?.images
            ? req.files.images.map((file) => ({
                url: file.path,
                publicId: file.filename, // ✅ FIX
            }))
            : [];

        const product = new ProductModels({
            productTitle: title,
            productPrice: price,
            productSizes: [
                {
                    size: size.toUpperCase(),
                    stock: sizeQyt
                }
            ],
            productDescription: description,
            mainImage: mainImage,
            images: images,
            productMaterial: category,
            isActive: isActive,
            featured: featured
        })


        await product.save();

        res.status(200).json({ message: "Product added successfully", success: true, product });
    }
    catch (error) {
        console.error('addProducts error', error);
        res.status(500).json({ message: 'Add products request fails', success: false });
    }
}

// to fetch all products 
const fetchProductsControllers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 15,
            status = "All",
            search = "",
            sort = "date-new"
        } = req.query;

        const skip = (page - 1) * limit;
        let query = {};

        // FILTER
        if (status && status !== "All") {
            query.productMaterial = status;
        }

        // SEARCH
        if (search.trim() !== "") {
            const regex = new RegExp(search, "i");
            query.$or = [
                { productTitle: regex },
                { productDescription: regex },
                { productMaterial: regex }
            ];
        }

        // SORT
        let sortQuery = {};
        switch (sort) {
            case "amount-asc":
                sortQuery.productPrice = 1;
                break;
            case "amount-desc":
                sortQuery.productPrice = -1;
                break;
            case "date-old":
                sortQuery.createdAt = 1;
                break;
            default:
                sortQuery.createdAt = -1;
        }

        const totalProducts = await ProductModels.countDocuments(query);

        const products = await ProductModels.find(query)
            .sort(sortQuery)
            .skip(skip)
            .limit(Number(limit));

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(totalProducts / limit),
                totalProducts
            }
        });

    } catch (error) {
        console.error("fetchProductsControllers error", error);
        res.status(400).json({
            success: false,
            message: "Failed to fetch products"
        });
    }
};

// to edit products 
const editProductsControllers = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await ProductModels.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // ---------------- TEXT FIELDS ----------------
        const {
            title,
            price,
            category,
            description,
            size,
            sizeQyt
        } = req.body;

        const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];

        if (title) product.productTitle = title;
        if (price) product.productPrice = price;
        if (category) product.productMaterial = category;
        if (description) product.productDescription = description;


        // to edit size's quantiy
        if (size) {
            const index = product.productSizes.findIndex((p) => p.size === size.toUpperCase())

            if (index !== -1) {
                // product.productSizes[index].size = size;
                product.productSizes[index].stock = sizeQyt;
            }
            else {
                product.productSizes.push({
                    size: size.toUpperCase(),
                    stock: sizeQyt
                })
            }

            // Maintain correct order
            product.productSizes.sort(
                (a, b) =>
                    SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size)
            );

        }

        // ---------------- MAIN IMAGE ----------------
        if (req.files?.mainImage?.[0]) {
            product.mainImage = {
                url: req.files.mainImage[0].path,
                publicId: req.files.mainImage[0].filename
            };
        }

        // ---------------- SUB IMAGES ----------------
        if (req.files?.images?.length) {
            product.images = req.files.images.map(file => ({
                url: file.path,
                publicId: file.filename
            }));
        }

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });
    }
    catch (error) {
        console.error('editProductsControllers error', error);
        res.status(400).json({ message: 'editProductsControllers request fails', success: false });
    }
}

// to delete products 
const deleteProductControllers = async (req, res) => {
    try {
        const { productId } = req.params;

        // 1. Find the product first (to get image publicIds)
        const product = await ProductModels.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        // 2. Collect all image publicIds
        const imagePublicIds = [];

        // Main image
        if (product.mainImage?.publicId) {
            imagePublicIds.push(product.mainImage.publicId);
        }

        // Gallery images
        if (product.images?.length > 0) {
            product.images.forEach(img => {
                if (img.publicId) {
                    imagePublicIds.push(img.publicId);
                }
            });
        }


        // 3. Delete images from Cloudinary (parallel for speed)
        if (imagePublicIds.length > 0) {
            await Promise.all(
                imagePublicIds.map(publicId =>
                    cloudinary.uploader.destroy(publicId)
                        .catch(err => {
                            console.error(`Failed to delete image ${publicId}:`, err);
                            // Don't fail the whole operation if one image fails
                        })
                )
            );
        }

        const products = await ProductModels.findByIdAndDelete(productId);

        return res.json({ message: "Product removed successfully", success: true, products });
    }
    catch (error) {
        console.error('deleteProductControllers error', error);
        res.status(400).json({ message: 'deleteProductControllers request fails', success: false });
    }
}

// to fetch single product
const fetchSingleProductControllers = async (req, res) => {
    try {

        const { productId } = req.params;
        const product = await ProductModels.findById(productId);

        if (!product) {
            return res.status(400).json({ message: "There is no Product", success: false });
        }

        return res.json({ message: "Product fetched successfully", success: true, product });
    }
    catch (error) {
        console.error('fetchSingleControllers error', error);
        res.status(400).json({ message: 'fetchSingleControllers request fails', success: false });
    }
}

module.exports = { addProductsControllers, fetchProductsControllers, editProductsControllers, deleteProductControllers, fetchSingleProductControllers };