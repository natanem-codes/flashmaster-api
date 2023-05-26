const { Router } = require("express")
const Deck = require("../models/deck")
const Flashcard = require("../models/flashcard")
const verify = require("../middlewares/auth")

const router = Router()

router.route("/")
.get(async (req, res) => {
    const {deckId} = req.query
    console.log(req.query)
    console.log(req.body)
    try {
        const flashcards = await Flashcard.find({deck: deckId})
    res.send(flashcards)
    } catch (error) {
        res.status(400).send()
    }
})

.post(verify, async (req, res) => {
    const {term, definition, deck} = req.body
    try {
        const flashcard = new Flashcard({term, definition, deck})
        await flashcard.save()
        res.status(201).send(flashcard)
    } catch (error) {
        console.log(error.message)
        res.status(400).send()
    }
})

router.route("/:id")
.get(async(req, res) => {
    const {id} = req.params
    try {
        const flashcard = await Flashcard.findById(id)
    if(!flashcard) {
        return res.status(404).send()
    }
    res.send(flashcard)
    } catch (error) {
        res.status(400).send()
    }
})
.patch(verify, async(req, res) => {
    console.log("updating..")
    const {id} = req.params
    try {
        const updatedFlashcard = await Flashcard.findByIdAndUpdate(id, req.body, {new: true})
        if(!updatedFlashcard) {
            return res.status(404).send()
        }
        res.send(updatedFlashcard)
    } catch (error) {
        res.status(400).send()
    }
})
.delete(verify, async(req, res) => {
    const {id} = req.params
    console.log("deleting... ", id)
    try {
        const deletedFlashcard = await Flashcard.findByIdAndDelete(id)
        if(!deletedFlashcard) {
            return res.status(404).send()
        }
        res.send(deletedFlashcard)
    } catch (error) {
        res.status(400).send()
    }
})


module.exports = router