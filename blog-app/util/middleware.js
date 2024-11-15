const jwt = require('jsonwebtoken')

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeDatabaseError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'token invalid' })
    }

    next(error)
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        req.token = authorization.replace('Bearer ', '')
    }
    next()
}

const userExtractor = (req, res, next) => {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    req.user = decodedToken.id

    next()
}

module.exports = {
    errorHandler,
    tokenExtractor,
    userExtractor
}