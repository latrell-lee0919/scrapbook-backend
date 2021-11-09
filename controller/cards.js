const cardRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Card = require('../models/card')

cardRouter.get('/', async (request, response) => {
    const cards = await Card
        .find({})
        .populate('user', { username: 1, name: 1 })
    response.json(cards)
})

cardRouter.get('/:id', async (request, response) => {
    const card = await Card.findById(request.params.id)
    if(card) {
        response.json(card)
    } else {
        response.status(404).end()
    }
})

cardRouter.post('/', async (request, response) => {
    const body = request.body
    const userId = request.user
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token is missing or invalid' })
    }

    const user = await User.findById(userId)

    const card = new Card({
        title: body.title,
        description: body.description,
        year: body.year,
        imageURL: body.imageURL, // this will change when we implement multer
        user: user._id
    })

    if(card.year && card.title) { // go back and test error validation
        const savedCard = await card.save()
        user.cards = user.cards.concat(savedCard._id)
        await user.save()
        response.json(savedCard.toJSON())
    } else {
        response.status(400).end()
    }
})

module.exports = cardRouter