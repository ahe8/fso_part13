require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')

const express = require('express')
const app = express()
app.use(express.json())

const sequelize = new Sequelize(process.env.DATABASE_URL);


class Blog extends Model { }
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

Blog.sync()


app.get('/api/blogs', async (req, res) => {
  const blog = await Blog.findAll()
  if (blog) {
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

app.get('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

app.post('/api/blogs', async (req, res) => {
  try {
    console.log(req.body)
    const blogs = await Blog.create(req.body)
    res.json(blogs)
  } catch (error) {
    res.status(400).json({ error })
  }
})

app.put('/api/notes/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    blog.author = req.body.author
    await blog.save()
    res.json(blog)
  } else {
    res.status(404).end()
  }
})


app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params
    await Blog.destroy({ where: { id } })
    res.status(204).end()
  } catch (error) {
    res.status(400).json({ error })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})