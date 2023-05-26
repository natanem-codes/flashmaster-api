const {Router} = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/user")
const { route } = require("./user")


const router = Router()

router.post("/login", async(req, res) => {
    const {username, password} = req.body
    try {
        const foundUser = await User.findByUsername(username, password)
        const token = await foundUser.generateToken()

        res.send({
                _id: foundUser._id,
                firstname: foundUser.firstName,
                lastName: foundUser.lastName,
                username: foundUser.username,
                token
            })
    } catch (error) {
        console.log(error.message)
        res.status(400).send({error: error.message})
    }
})

router.post("/register", async(req, res) => {
    const {firstName, lastName, username, password} = req.body
    console.log(req.body)
    try {
        const foundUser = await User.findOne({username})
        if(foundUser) {
            return res.status(403).send({error: "Unable to registering."})
        }
        const newUser = new User({firstName, lastName, username, password})
        await newUser.save()

        const token = await newUser.generateToken()
        
        res.status(201).send({
                _id: newUser._id,
                firstname: newUser.firstName,
                lastName: newUser.lastName,
                username: newUser.username,
                token
            })
    } catch (error) {
        console.log(error.message)
        res.status(400).send({error: error.message})
    }
})

module.exports = router