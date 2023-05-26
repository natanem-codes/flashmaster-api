const jwt = require("jsonwebtoken")
const User = require("../models/user")

const verify = async (req, res, next) => {
  try {
    const token = req.header("Authorization").split(" ")[1]

    if(!token) {
        res.status(401).send()
    }
    
    const decoded = jwt.verify(token, process.env.AUTH_TOKEN)
    const user = await User.findOne({_id: decoded._id})

    if(!user) {
        throw new Error()
    }

    req.user = user
    next()

  } catch (error) {
    res.status(401).send({error: "Please authenticate."})
  }

}


module.exports = verify
