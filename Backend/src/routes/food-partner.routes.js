const express = require("express")
const { authFoodPartnerMiddleware, authUserMiddleware } = require("../middlewares/auth.middleware")
const foodPartnerController = require("../controllers/food-partner.controller")
const router = express.Router()

/* /api/food-partner/:id */
router.get("/:id",
    authUserMiddleware,
    foodPartnerController.getFoodPartnerById
)

module.exports = router