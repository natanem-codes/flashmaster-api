
const { Router } = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const verify = require("../middlewares/auth")
const User = require("../models/user")


const router = Router()

router.patch("", verify, async(req, res ) => {
   console.log(req.body)
   console.log(req.user)
    try {
        const updatedUser = await User.findByIdAndUpdate({_id: req.user._id}, req.body, {new: true}).select("-password")
        if(!updatedUser) {
            return res.status(404).send({error: "User not found."})
        }
        
        res.send(updatedUser)
    } catch (error) {
        res.status(400).send()
    }
})

router.delete("", verify, async(req, res ) => {
    try {
        const deletedUser = await User.findByIdAndDelete({_id: req.user._id}).select("-password")
        if(!deletedUser) {
            return res.status(404).send()
        }
        
        res.send(deletedUser)
    } catch (error) {
        res.status(400).send()
    }
})

router.get("/me", verify, async(req, res) => {
        res.send({
            _id: req.user._id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            username: req.user.username,
        })
})




module.exports = router