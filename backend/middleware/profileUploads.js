const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../cloudinary");

const profileStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "users/profile", // 👈 separate folder
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        public_id: (req, file) => {
            return `profile-${req.user._id}`; // overwrite same image
        },
    },
});

const uploadProfile = multer({ storage: profileStorage });

module.exports = uploadProfile;