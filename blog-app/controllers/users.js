const router = require('express').Router()

const { User, Blog } = require('../models')
const { checkValidSession } = require('../util/middleware')

router.get('/', async (req, res) => {
    const users = await User.findAll({
        include: {
            model: Blog,
            attributes: { exclude: ['userId'] }
        }
    })
    res.json(users)
})

router.post('/', async (req, res) => {
    const user = await User.create(req.body)
    res.json(user)
})

router.get('/:id', async (req, res) => {
    console.log(req.query.read);
    console.log(typeof req.query.read === 'boolean');
    const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'disabled'] },
        include: [{
            model: Blog,
            as: 'reading_list',
            attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
            through: {
                where: req.query.read && {
                    read: req.query.read
                },
                attributes: ["id", "read"],
            },
        },
        ]
    })
    if (user) {
        res.json(user)
    } else {
        res.status(404).end()
    }
})

router.put('/:username', checkValidSession, async (req, res) => {
    const user = await User.findOne({ where: { username: req.params.username } })
    if (user && req.body?.username) {
        user.username = req.body.username
        await user.save()
        res.json(user)
    } else {
        res.status(400).end()
    }
})

module.exports = router