const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "products",          // cloudinary folder
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        resource_type: "image",
    },
});

const upload = multer({ storage });

module.exports = upload;