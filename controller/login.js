const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const body = request.body

    const user = await User.findOne({ username: body.username })
    const passwordCorrect = user !== null
        ? await bcrypt.compare(body.password, user.passwordHash)
        : false
    
    if(!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'Username or password is not found.'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn: 60*60 }
    )

    response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter