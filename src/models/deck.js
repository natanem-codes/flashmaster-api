const { Schema, model} = require("mongoose")


const deckSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Title is required."]
    },
    description: {
        type: String,
        trim: true
    },
    author: {
        type:Schema.Types.ObjectId,
        ref: "User"
    }, 
    isCopied: {
        type: Boolean,
        default: false
    }
    
}
, {
    timestamps: true
})

deckSchema.virtual("flashcards", {
    ref: "Flashcard",
    localField: "_id",
    foreignField: "deck"
})

// deckSchema.pre("deleteOne", function(){
//     console.log("deleteing deckkkk", this)
// })

const Deck = model("Deck", deckSchema)

module.exports = Deck