import express from 'express'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const app = express();
dotenv.config()

app.use(express.json())

const posts = [
    {
        username: 'Neil',
        title: 'Post1'
    },
    {
        username: 'AB',
        title: 'Post2'
    }
]

app.get('/posts', authenticate, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})

function authenticate(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        console.log(err)
        if(err) return res.sendStatus(403);

        req.user = user
        next()
    })
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>  console.log(`Server Started on Port Number ${PORT}`))