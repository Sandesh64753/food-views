const foodModel = require("../models/food.model")
const storageService = require("../services/storage.services")
const likeModel = require("../models/likes.model")
const saveModel = require("../models/save.model")
const { v4: uuid } = require("uuid")

async function createFood(req, res) {
    // uploadFile returns a URL string
    const fileUrl = await storageService.uploadFile(req.file, uuid())
    console.log("Uploaded to:", fileUrl)

    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        video: fileUrl,
        foodPartner: req.foodPartner._id
    })

    res.status(201).json({
        message: "Food created successfully",
        food: foodItem
    })
}

async function getFoodItems(req, res) {
    const foodItems = await foodModel.find({})

    // Normalize video URLs: if stored as relative paths, convert to absolute URL
    const normalized = foodItems.map(item => {
        const obj = item.toObject ? item.toObject() : item
        if (obj.video && obj.video.startsWith('/')) {
            const host = req.protocol + '://' + req.get('host')
            obj.video = host + obj.video
        }
        console.log('video url:', obj.video)
        return obj
    })

    res.status(200).json({
        message: "Food items fetched successfully",
        foodItems: normalized
    })
}

async function likeFood(req, res) {
    const { foodId } = req.body
    const user = req.user

    const isAlreadyLiked = await likeModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadyLiked) {
        await likeModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: -1 }
        })

        return res.status(201).json({
            message: "food unliked Succesfully"
        })
    }

    const like = await likeModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: 1 }
    })

    res.status(201).json({
        message: "food liked Succesfully",
        like
    })
}

async function saveFood(req, res) {
    const { foodId } = req.body
    const user = req.user

    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadySaved) {
        await saveModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: -1 }
        })

        return res.status(201).json({
            message: "food unsaved successfully"
        })
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId
    })

    res.status(201).json({
        message: "food saved successfully",
        save
    })
}

async function getSaveFoods(req, res) {
    const user = req.user

    const savedFoods = await saveModel.find({ user: user._id }).populate('food')

    if (!savedFoods || savedFoods.length === 0) {
        return res.status(404).json({ message: "No saved foods found" });
    }

    return res.status(200).json({
        message: "Saved foods retrieved successfully",
        savedFoods,
    });

}
module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood,
    getSaveFoods
}