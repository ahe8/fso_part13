const router = require('express').Router()
const { Op } = require('sequelize')

const { Blog, User } = require('../models')
const { userExtractor, checkValidSession } = require('../util/middleware')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.get('/', async (req, res) => {
    const blog = await Blog.findAll({
        attributes: { exclude: ['userId'] },
        include: {
            model: User,
            attributes: ['name'],
        },
        where: req.query.search && {
            title: {
                [Op.iLike]: `%${req.query.search}%`
            }
        },
        order: [['likes', 'DESC']]
    })
    if (blog) {
        res.json(blog)
    } else {
        res.status(404).end()
    }
})

router.get('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
        res.json(req.blog)
    } else {
        res.status(404).end()
    }
})

router.post('/', [checkValidSession, userExtractor], async (req, res) => {
    const user = await User.findByPk(req.user)
    const blogs = await Blog.create({ ...req.body, userId: user.id })
    res.json(blogs)
})

router.put('/:id', [checkValidSession, blogFinder], async (req, res) => {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
})


router.delete('/:id', [checkValidSession, blogFinder, userExtractor], async (req, res) => {

    if (req.blog) {
        if (req.blog.userId === req.user) {
            await req.blog.destroy()
        } else {
            res.status(401).end()
        }
    }
    res.status(204).end()
})

module.exports = router