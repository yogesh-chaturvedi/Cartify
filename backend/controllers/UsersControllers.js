const UsersModel = require('../models/User')
const bcrypt = require('bcrypt')


const formatName = (fullName) => {
    return fullName
        .trim()
        .split(" ")
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

// to fetch all users 
const fetchUsersControllers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status = "user",
            search = "",
            sort = "newest"
        } = req.query;

        const skip = (page - 1) * limit;

        let query = {};

        if (status) {
            query.role = status;
        }

        // SEARCH
        if (search.trim() !== "") {
            const regex = new RegExp(search, "i");
            query.$or = [
                { name: regex },
                { email: regex },
                { country: regex }
            ];
        }

        // SORT
        let sortQuery = {};
        switch (sort) {
            case "name-asc":
                sortQuery.name = 1;
                break;
            case "name-desc":
                sortQuery.name = -1;
                break;
            case "oldest":
                sortQuery.createdAt = 1;
                break;
            default:
                sortQuery.createdAt = -1;
        }

        const totalUsers = await UsersModel.countDocuments(query);

        const users = await UsersModel.find(query).sort(sortQuery)
            .skip(skip)
            .limit(Number(limit));

        return res.json({
            message: "Users fetched successfully", success: true, users, pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(totalUsers / limit),
                totalUsers
            }
        });
    }
    catch (error) {
        console.error('fetchUsersControllers error', error);
        res.status(400).json({ message: 'fetchUsersControllers request fails', success: false });
    }
}

// to remove users 
const deleteUsersControllers = async (req, res) => {
    try {
        const { userId } = req.params;
        const users = await UsersModel.findByIdAndDelete(userId)

        return res.json({ message: "User removed successfully", success: true });
    }
    catch (error) {
        console.error('deleteUsersControllers error', error);
        res.status(400).json({ message: 'deleteUsersControllers request fails', success: false });
    }
}

// to edit users profile
const editProfileControllers = async (req, res) => {
    try {
        const { fullName, newPassword, phoneNumber, country } = req.body

        const userId = req.user._id;

        const user = await UsersModel.findById(userId)

        if (!user) {
            return res.status(400).json({ message: "User not found", success: false });
        }

        if (fullName) user.name = formatName(fullName)

        if (newPassword) {
            user.password = await bcrypt.hash(newPassword, 10);
        }

        if (phoneNumber) user.phoneNumber = phoneNumber
        if (country) user.country = country


        // ✅ profile image
        if (req.file) {
            user.profileImage = {
                url: req.file.path,
                public_id: req.file.filename,
            };
        }

        await user.save();

        res.status(200).json({ message: "Profile updated successfully", success: true, user });

    }
    catch (error) {
        console.error('editProfileControllers error', error);
        res.status(500).json({ message: 'editProfileControllers request fails', success: false });
    }
}

module.exports = { fetchUsersControllers, deleteUsersControllers, editProfileControllers }