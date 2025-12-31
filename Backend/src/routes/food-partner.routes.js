const express = require("express")
const { authFoodPartnerMiddleware, authUserMiddleware, authUserOrPartnerMiddleware } = require("../middlewares/auth.middleware")
const foodPartnerController = require("../controllers/food-partner.controller")
const router = express.Router()

/* /api/food-partner/:id */
router.get("/:id",
    authUserOrPartnerMiddleware,
    foodPartnerController.getFoodPartnerById
)

module.exports = router