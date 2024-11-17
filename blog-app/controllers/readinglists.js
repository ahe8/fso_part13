const router = require('express').Router()

const { ReadingList } = require('../models');
const { userExtractor, checkValidSession } = require('../util/middleware');


router.get('/', async (req, res) => {
    const readingLists = await ReadingList.findAll();
    res.json(readingLists);
})


router.post('/', checkValidSession, async(req, res) => {
    const readingList = await ReadingList.create(req.body)

    res.json(readingList)
})

router.put('/:id', [checkValidSession, userExtractor], async(req, res) => {
    const readingList = await ReadingList.findByPk(req.params.id)

    if(req.user === readingList.userId) {
        readingList.read = req.body.read;
        await readingList.save()

        res.json(readingList)
    } else {
        res.status(401).send({'error': 'token invalid'})
    }
})



module.exports = router