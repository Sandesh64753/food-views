const foodPartnerModel = require("../models/foodpartner.model")
const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")

async function authFoodPartnerMiddleware(req, res, next) {
    // Accept token from cookie or Authorization header (Bearer <token>)
    let token = req.cookies && req.cookies.token
    if (!token && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ')
        if (parts.length === 2 && parts[0] === 'Bearer') token = parts[1]
    }

    if (!token) {
        return res.status(401).json({
            message: "Please login first"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const foodPartner = await foodPartnerModel.findById(decoded.foodPartnerId)
    if (!foodPartner) return res.status(401).json({ message: 'Invalid token' })
    req.foodPartner = foodPartner
    next()
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}

async function authUserMiddleware(req, res, next) {
    // Accept token from cookie or Authorization header (Bearer <token>)
    let token = req.cookies && req.cookies.token
    if (!token && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ')
        if (parts.length === 2 && parts[0] === 'Bearer') token = parts[1]
    }

    if (!token) {
        return res.status(401).json({
            message: "Please login first"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // token is signed with { userId: ... } in auth.controller
        const user = await userModel.findById(decoded.userId)
        if (!user) return res.status(401).json({ message: 'Invalid token' })
        req.user = user
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" })
    }
}

module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware
}

// Allow either a regular user or a food partner to access a route
async function authUserOrPartnerMiddleware(req, res, next) {
    // Accept token from cookie or Authorization header (Bearer <token>)
    let token = req.cookies && req.cookies.token
    if (!token && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ')
        if (parts.length === 2 && parts[0] === 'Bearer') token = parts[1]
    }

    if (!token) {
        return res.status(401).json({ message: 'Please login first' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (decoded.userId) {
            const user = await userModel.findById(decoded.userId)
            if (!user) return res.status(401).json({ message: 'Invalid token' })
            req.user = user
            return next()
        }

        if (decoded.foodPartnerId) {
            const partner = await foodPartnerModel.findById(decoded.foodPartnerId)
            if (!partner) return res.status(401).json({ message: 'Invalid token' })
            req.foodPartner = partner
            return next()
        }

        return res.status(401).json({ message: 'Invalid token' })
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' })
    }
}

// export the new middleware
module.exports.authUserOrPartnerMiddleware = authUserOrPartnerMiddleware