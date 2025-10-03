const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String
    }
},
    { timestamps: true }
)

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;