const UserModel = require("../models/user.model");
const FoodPartnerModel = require("../models/foodpartner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
    const { fullname, email, password } = req.body

    const isUserPresent = await UserModel.findOne({ email: email })

    if (isUserPresent) {
        return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await UserModel.create({
        fullname,
        email,
        password: hashedPassword
    })

    const token = jwt.sign({
        userId: user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    // Return token in response so frontend can store Authorization header for single-origin or CORS setups
    return res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
            _id: user._id,
            fullname: user.fullname,
            email: user.email
        }
    })
}

async function loginUser(req, res) {
    const { email, password } = req.body

    const user = await UserModel.findOne({
        email: email
    })

    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid email or password" })
    }

    const token = jwt.sign({
        userId: user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)
    return res.status(200).json({
        message: "User logged in successfully",
        token,
        user: {
            _id: user._id,
            fullname: user.fullname,
            email: user.email
        }
    })
}

function logoutUser(req, res) {
    res.clearCookie("token")
    return res.status(200).json({ message: "User logged out successfully" })
}

async function registerFoodPartener(req, res) {
    const { name, email, password, phone, address, contactName } = req.body

    const isFoodPartnerPresent = await FoodPartnerModel.findOne({ email: email })

    if (isFoodPartnerPresent) {
        return res.status(400).json({ message: "Food Partner already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const foodPartner = await FoodPartnerModel.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        contactName
    })

    const token = jwt.sign({
        foodPartnerId: foodPartner._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    return res.status(201).json({
        message: "Food Partner registered successfully",
        token,
        foodPartner: {
            _id: foodPartner._id,
            name: foodPartner.name,
            email: foodPartner.email,
            phone: foodPartner.phone,
            address: foodPartner.address,
            contactName: foodPartner.contactName
        }
    })
}

async function loginFoodPartner(req, res) {
    const { email, password } = req.body
    const foodPartner = await FoodPartnerModel.findOne({
        email: email
    })
    if (!foodPartner) {
        return res.status(400).json({ message: "Invalid email or password" })
    }
    const isPasswordCorrect = await bcrypt.compare(password, foodPartner.password)
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid email or password" })
    }
    const token = jwt.sign(
        { foodPartnerId: foodPartner._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" })

    return res.status(200).json({
        message: "Food Partner logged in successfully",
        token,
        foodPartner: {
            _id: foodPartner._id,
            name: foodPartner.name,
            email: foodPartner.email
        }
    })
}

function logoutFoodPartner(req, res) {
    res.clearCookie("token")
    return res.status(200).json({ message: "Food Partner logged out successfully" })
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartener,
    loginFoodPartner,
    logoutFoodPartner
}