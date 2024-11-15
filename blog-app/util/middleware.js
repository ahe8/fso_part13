const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeDatabaseError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

module.exports = {
    errorHandler
}