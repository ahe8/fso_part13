
const { sequelize } = require('../util/db')

const router = require('express').Router()


const { Blog, User } = require('../models')

router.get('/', async (req, res) => {
    const authors = await Blog.findAll({
        group: 'author',
        attributes: [
            'author',
            [sequelize.fn('COUNT', sequelize.col('*')), 'articles'],
            [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
        ]
    })

    res.json(authors);
})

module.exports = router