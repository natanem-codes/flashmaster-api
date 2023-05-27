
const { Router } = require("express")

const verify = require("../middlewares/auth")
const User = require("../models/user")
const Deck = require("../models/deck")
const Flashcard = require("../models/flashcard")


const router = Router()

router.patch("/:id", verify, async(req, res ) => {
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

router.delete("/:id", verify, async(req, res ) => {
    console.log("deleting")
    try {
        const deletedUser = await User.deleteOne({_id: req.user._id}).select("-password")
        if(!deletedUser) {
            return res.status(404).send()
        }
        const decksFromUser = await Deck.find(({author: req.user._id}))
        for(let deck of decksFromUser) {
            await deck.deleteOne()
            await Flashcard.deleteMany({deck: deck._id})
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