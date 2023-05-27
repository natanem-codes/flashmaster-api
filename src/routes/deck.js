const { Router } = require("express")

const verify = require("../middlewares/auth")
const Deck = require("../models/deck")
const Flashcard = require("../models/flashcard")

const router = Router()

router.route("/")
.get(async(req, res) => {
    try {
        const decks = (await Deck.find().populate("author flashcards", "username"))
        const decksArr = []

        for(let deck of decks) {
            const {_id, title, author, createdAt, updatedAt} = deck
            decksArr.push({
                _id, title, author, createdAt, updatedAt, flashcardsCount: deck.flashcards.length
            })
        }
        res.send(decksArr)
    } catch (error) {
        res.status(400).send()
    }
})
.post(verify, async(req, res) => {
    const { title, description } = req.body
    try {
        const newDeck = new Deck({title, description, author: req.user._id})
        await newDeck.save()
        res.status(201).send(newDeck)
    } catch (error) {
        res.status(400)
    }
})

router.get("/latest", async(req, res) => {
    try {
        const deck = await Deck.find().sort("-date").limit(5)
        res.send(deck)
    } catch (error) {
        res.status(400).send()
    }
})

router.get("/my-decks",verify, async(req, res) => {
    console.log(req.user)
    try {
        const deck = await Deck.find({author: req.user}).populate("author", "username").sort("-date")
        res.send(deck)
    } catch (error) {
        res.status(400).send()
    }
})

router.post("/:id/copy", verify, async(req, res) => {
    const {id} = req.params
    console.log("deck to be coppied: ",id)
    try {
        const deck = await Deck.findById(id).populate("flashcards")
        const newDeck = new Deck({
        title: deck.title,
        description: deck.description,
        author: req.user._id,
        isCopied: true
    })
    await newDeck.save()
    for(let flashcard of deck.flashcards) {
        console.log("copying flascard ", flashcard.term)
        await Flashcard.create({term: flashcard.term, definition: flashcard.definition, deck: newDeck._id})
    }
    res.status(201).send(newDeck)
    } catch (error) {
        console.log(error.message)
        res.status(400).send({error: error.message})
    }
})
router.post("/:id/addToFavorites", verify, async(req, res) => {
    const {id} = req.params
    console.log("deck to be added to favorites: ", id)
    console.log(req.user.favorites)
    try {
        if(req.user.favorites.includes(id)) {
            req.user.favorites = req.user.favorites.filter(fav => fav != id)
        }else {
            req.user.favorites.push(id)
        }
        await req.user.save()
        res.send(req.user.favorites)
    } catch (error) {
        console.log(error.message)
        res.status(400).send({error: error.message})
    }
})
router.route("/:id")
.get(async(req, res) => {
    const {id} = req.params
    try {
        const deck = await Deck.findById(id).populate("author flashcards", "username")
        // console.log("flashcards: ", deck.flashcards)
        if(!deck) {
            return res.status(404).send()
        }
        res.send(deck)
    } catch (error) {
        console.log(error.message)
        res.status(400).send()
    }
})


.patch( verify, async(req, res) => {
    const {id} = req.params
    try {
        const updatedDeck = await Deck.updateOne({_id: id, author: req.user._id }, req.body, {new: true})
                
        if(!updatedDeck) {
            return res.status(404).send()
        }
        res.send(updatedDeck)
    } catch (error) {
        res.status(400).send()
    }
})

.delete( verify, async(req, res) => {
    const {id} = req.params
    console.log(req.params)
    try {
        const deletedDeck = await Deck.deleteOne({_id: id, author: req.user._id})
        await Flashcard.deleteMany({deck: id})

        if(!deletedDeck) {
            return res.status(404).send()
        }
        res.send(deletedDeck)
    } catch (error) {
        console.log(error.message)
        res.status(400).send()
    }
})


module.exports = router