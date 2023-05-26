const {Schema, model} = require("mongoose")

const flashcardSchema = new Schema({
    term: {
        type: String, 
        required: [true, "Term is required"]
    },
    definition: {
        type: String, 
        required: [true, "Definition is required"]
    },
    deck: {
        type: Schema.Types.ObjectId,
        ref: "Deck"
    }
})

const Flashcard = model("Flashcard", flashcardSchema)

module.exports = Flashcard