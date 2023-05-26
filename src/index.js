const express = require("express")
require("dotenv").config()
const cors =require("cors")

require("./db/conn")

const app = express()

const port = process.env.PORT || 5000

app.use(cors())

app.use(express.json())


app.use("/decks", require("./routes/deck"))
app.use("/flashcards", require("./routes/flashcard"))
app.use("/users", require("./routes/user"))
app.use("/auth", require("./routes/auth"))



app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})