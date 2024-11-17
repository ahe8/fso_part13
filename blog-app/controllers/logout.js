const router = require('express').Router()

const { ActiveSession } = require('../models')

router.delete('/', async (req, res) => {
    const result = await ActiveSession.destroy({
        where: {
            authToken: req.token
        }
    })
    if (result) {
        res.status(200).end()
    } else {
        res.status(404).end()
    }
})

module.exports = router