const UserModel = require('./models/User')
const dotenv = require('dotenv')
dotenv.config()
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_URI)
    .then((res) => {
        console.log("create admin connected")
    }).catch((err) => {
        console.log("something went wrong")
    })


const CreateAdmin = async (req, res) => {
    try {

        const admin = await UserModel.findOne({ email: process.env.ADMIN_EMAIL })

        if (admin) {
            console.log("already created")
            return mongoose.disconnect()
        }

        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

        const create = UserModel({
            name: 'Admin',
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            role: 'admin'
        })

        await create.save();
        console.log("admin created successfully")
        mongoose.disconnect()
    }
    catch (error) {
        console.log("admin error", error)
    }
}
CreateAdmin()