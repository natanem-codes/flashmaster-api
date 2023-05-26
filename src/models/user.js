const {Schema, model} = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First name is required."],
    },
    lastName: {
        type: String,
        required: [true, "First name is required."],
    },
    username: {
        type: String,
        unique: true,
        required: [true, "First name is required."],
    },
    password: {
        type: String,
        required: [true, "First name is required."],
    },
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: "Deck"
    }]
})

userSchema.pre("save", async function (next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

userSchema.statics.findByUsername = async (username, password) => {
    const user = await User.findOne({username})
    console.log(user)
    if(!user) {
        throw new Error("Unable to login")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error("Unable to login")
    }

    return user
}

userSchema.methods.generateToken = async function() {
    const token = jwt.sign({_id: this._id.toString()}, process.env.AUTH_TOKEN)

    return token
}

const User = model("User", userSchema)

module.exports = User


